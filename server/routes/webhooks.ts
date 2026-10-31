import { Router } from 'express';
import { db } from '../db';
import { verifyWebhookSignature, getPullRequestDiff, postReviewComment } from '../github';
import { analyzeCodeDiff } from '../ai';

export const webhooksRouter = Router();

/**
 * Handle GitHub Webhooks
 */
webhooksRouter.post('/github', async (req: any, res) => {
  const signature = req.headers['x-hub-signature-256'] as string | undefined;
  const event = req.headers['x-github-event'] as string;
  const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;

  // 1. Signature Verification
  if (webhookSecret) {
    const rawBody = req.rawBody || JSON.stringify(req.body);
    const isValid = verifyWebhookSignature(rawBody, signature, webhookSecret);
    if (!isValid) {
      console.warn('GitHub webhook signature mismatch rejected.');
      return res.status(401).json({ error: 'Invalid HMAC signature in X-Hub-Signature-256' });
    }
  }

  // 2. Handle Ping
  if (event === 'ping') {
    return res.json({ message: 'RevAI webhook endpoint active and verified.', zen: req.body?.zen });
  }

  // 3. Handle Pull Request Events
  if (event === 'pull_request') {
    const action = req.body?.action;
    const pr = req.body?.pull_request;
    const repoData = req.body?.repository;

    if (!pr || !repoData) {
      return res.status(400).json({ error: 'Malformed pull_request payload' });
    }

    // Only process actionable PR actions
    if (!['opened', 'synchronize', 'reopened'].includes(action)) {
      return res.json({ message: `Ignored action: ${action}` });
    }

    const repoFullName = repoData.full_name;
    const repo = db.prepare('SELECT * FROM repositories WHERE full_name = ?').get(repoFullName) as any;

    if (!repo) {
      return res.json({ message: `Repository ${repoFullName} is not currently monitored in RevAI.` });
    }

    const prNumber = pr.number;
    const commitSha = pr.head.sha.substring(0, 7);
    const subId = `sub-gh-${repo.id}-${prNumber}`;
    const now = new Date().toISOString();

    // Check duplicate run for same commit
    const existing = db.prepare('SELECT * FROM submissions WHERE id = ?').get(subId) as any;
    if (existing && existing.commit_sha === commitSha && existing.status === 'ai_completed') {
      return res.json({ message: 'Review already exists for this commit SHA.' });
    }

    // Lookup token
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(repo.user_id) as any;
    const token = user?.access_token;

    // Fetch diff
    let rawDiff = '';
    const [owner, repoName] = repoFullName.split('/');
    try {
      rawDiff = await getPullRequestDiff(owner, repoName, prNumber, token);
    } catch (err: any) {
      rawDiff = `// Diff fetch error: ${err.message}`;
    }

    // Execute AI Analysis
    const analysis = await analyzeCodeDiff(pr.title, pr.body || '', rawDiff, repo.language);

    const status = analysis.issues.some((i) => i.severity === 'critical')
      ? 'changes_requested'
      : 'ai_completed';

    // Upsert Submission
    db.prepare(`
      INSERT INTO submissions (
        id, repository_id, pr_number, title, developer_name, developer_avatar,
        developer_role, source_branch, target_branch, commit_sha, status,
        risk_level, risk_score, ai_model, ai_summary, ai_explanation,
        files_changed_count, additions, deletions, github_pr_url,
        review_time_seconds, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 14, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        commit_sha = excluded.commit_sha,
        status = excluded.status,
        risk_level = excluded.risk_level,
        risk_score = excluded.risk_score,
        ai_summary = excluded.ai_summary,
        ai_explanation = excluded.ai_explanation,
        files_changed_count = excluded.files_changed_count,
        additions = excluded.additions,
        deletions = excluded.deletions,
        updated_at = excluded.updated_at
    `).run(
      subId,
      repo.id,
      prNumber,
      pr.title,
      pr.user.login,
      pr.user.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      'Software Engineer',
      pr.head.ref,
      pr.base.ref,
      commitSha,
      status,
      analysis.riskLevel,
      analysis.riskScore,
      'Qwen2.5-Coder 7B',
      analysis.summary,
      analysis.explanation,
      pr.changed_files || 1,
      pr.additions || 0,
      pr.deletions || 0,
      pr.html_url,
      now,
      now
    );

    // Refresh issues
    db.prepare('DELETE FROM issues WHERE submission_id = ?').run(subId);
    const issueStmt = db.prepare(`
      INSERT INTO issues (
        id, submission_id, title, severity, category, file, line_start, line_end,
        explanation, why_it_is_a_problem, suggested_solution, original_snippet,
        suggested_fix_snippet, cwe, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open')
    `);

    for (let idx = 0; idx < analysis.issues.length; idx++) {
      const iss = analysis.issues[idx];
      issueStmt.run(
        `iss-hook-${subId}-${idx + 1}`,
        subId,
        iss.title,
        iss.severity,
        iss.category,
        iss.file,
        iss.lineStart,
        iss.lineEnd,
        iss.explanation,
        iss.whyItIsAProblem,
        iss.suggestedSolution,
        iss.originalSnippet,
        iss.suggestedFixSnippet,
        iss.cwe || null
      );
    }

    // Refresh code file
    db.prepare('DELETE FROM code_files WHERE submission_id = ?').run(subId);
    db.prepare(`
      INSERT INTO code_files (id, submission_id, filename, language, content, patch)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      `cf-hook-${subId}`,
      subId,
      analysis.issues[0]?.file || 'pull_request.diff',
      repo.language.toLowerCase(),
      rawDiff,
      rawDiff
    );

    // Create Notification
    const notifId = `notif-${Date.now()}`;
    db.prepare(`
      INSERT INTO notifications (id, user_id, submission_id, title, message, type, timestamp, read, link, pr_number)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
    `).run(
      notifId,
      repo.user_id,
      subId,
      analysis.issues.some((i) => i.severity === 'critical')
        ? `Security Alert: ${pr.title}`
        : `AI Review Complete: ${pr.title}`,
      analysis.summary,
      analysis.issues.some((i) => i.severity === 'critical') ? 'critical' : 'approval',
      'Just now',
      `/manager/reviews/${subId}`,
      prNumber
    );

    // Optionally post review comment to GitHub PR
    if (token) {
      const issuesSummary = analysis.issues
        .map(
          (i) =>
            `- **[${i.severity.toUpperCase()}]** \`${i.file}:L${i.lineStart}\`: ${i.title}\n  *${i.explanation}*`
        )
        .join('\n');

      const commentBody = `### 🤖 RevAI Automated Code Review (Qwen2.5-Coder)\n\n**Assessment:** ${analysis.summary}\n**Risk Composite:** ${analysis.riskScore}/100 (${analysis.riskLevel.toUpperCase()})\n\n#### Detected Findings (${analysis.issues.length}):\n${issuesSummary || 'No critical issues identified. Code complies with security policies.'}\n\n[Open Detailed Inspection Room in RevAI](${process.env.CLIENT_URL || 'http://localhost:5173'}/manager/reviews/${subId})`;

      try {
        await postReviewComment(owner, repoName, prNumber, commentBody, token);
      } catch (err: any) {
        console.warn('Could not post comment to GitHub PR:', err.message);
      }
    }

    return res.json({
      success: true,
      message: `AI review processed for ${repoFullName}#${prNumber}`,
      riskScore: analysis.riskScore,
      issuesCount: analysis.issues.length,
    });
  }

  res.json({ message: `Event ${event} acknowledged.` });
});
