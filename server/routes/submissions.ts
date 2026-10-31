import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { analyzeCodeDiff } from '../ai';
import { postReviewComment, getPullRequestFiles } from '../github';

export const submissionsRouter = Router();

const JWT_SECRET = process.env.SESSION_SECRET || 'revai_dev_secret_key_change_in_production_32';

/**
 * Get all pull request submissions
 */
submissionsRouter.get('/', (req, res) => {
  const { repository, developer, status, search } = req.query;

  let query = `
    SELECT 
      s.*, 
      r.name as repo_name, 
      r.full_name as repo_full_name, 
      r.language as repo_language,
      r.default_branch as repo_default_branch
    FROM submissions s
    JOIN repositories r ON s.repository_id = r.id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (repository) {
    query += ' AND s.repository_id = ?';
    params.push(repository);
  }

  if (developer) {
    query += ' AND s.developer_id = ?';
    params.push(developer);
  }

  if (status) {
    query += ' AND s.status = ?';
    params.push(status);
  }

  if (search) {
    query += ' AND (s.title LIKE ? OR s.developer_name LIKE ? OR r.name LIKE ?)';
    const term = `%${search}%`;
    params.push(term, term, term);
  }

  query += ' ORDER BY s.created_at DESC';

  const rows = db.prepare(query).all(...params) as any[];

  // Fetch issues for each submission to match frontend interface
  const submissions = rows.map((s) => {
    const issues = db.prepare('SELECT * FROM issues WHERE submission_id = ?').all(s.id) as any[];

    return {
      id: s.id,
      prNumber: s.pr_number,
      title: s.title,
      developer: {
        id: s.developer_id || 'usr-dev',
        name: s.developer_name,
        email: s.developer_email || '',
        avatar: s.developer_avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        role: s.developer_role || 'Developer',
      },
      repository: {
        id: s.repository_id,
        name: s.repo_name,
        branch: s.source_branch,
        targetBranch: s.target_branch,
        url: s.github_pr_url,
      },
      submissionDate: s.created_at,
      language: s.repo_language,
      status: s.status,
      riskLevel: s.risk_level,
      riskScore: s.risk_score,
      aiModel: s.ai_model,
      aiSummary: s.ai_summary || '',
      aiExplanation: s.ai_explanation || '',
      filesChangedCount: s.files_changed_count,
      additions: s.additions,
      deletions: s.deletions,
      reviewTimeSeconds: s.review_time_seconds,
      managerDecision: s.manager_decision_type
        ? {
            decision: s.manager_decision_type,
            decidedAt: s.manager_decision_at,
            managerName: s.manager_name,
            managerAvatar: s.manager_avatar,
            feedback: s.manager_feedback,
            commentsCount: s.manager_comments_count,
          }
        : undefined,
      issues: issues.map((iss) => ({
        id: iss.id,
        title: iss.title,
        severity: iss.severity,
        category: iss.category,
        file: iss.file,
        lineStart: iss.line_start,
        lineEnd: iss.line_end,
        explanation: iss.explanation,
        whyItIsAProblem: iss.why_it_is_a_problem || '',
        suggestedSolution: iss.suggested_solution,
        originalSnippet: iss.original_snippet,
        suggestedFixSnippet: iss.suggested_fix_snippet,
        cwe: iss.cwe,
        status: iss.status,
      })),
      codeFiles: [],
    };
  });

  res.json({ submissions });
});

/**
 * Get single submission with full details
 */
submissionsRouter.get('/:id', (req, res) => {
  const s = db.prepare(`
    SELECT 
      s.*, 
      r.name as repo_name, 
      r.full_name as repo_full_name, 
      r.language as repo_language,
      r.default_branch as repo_default_branch
    FROM submissions s
    JOIN repositories r ON s.repository_id = r.id
    WHERE s.id = ?
  `).get(req.params.id) as any;

  if (!s) {
    return res.status(404).json({ error: 'Submission not found' });
  }

  const issues = db.prepare('SELECT * FROM issues WHERE submission_id = ?').all(s.id) as any[];
  const codeFiles = db.prepare('SELECT * FROM code_files WHERE submission_id = ?').all(s.id) as any[];

  const submission = {
    id: s.id,
    prNumber: s.pr_number,
    title: s.title,
    developer: {
      id: s.developer_id || 'usr-dev',
      name: s.developer_name,
      email: s.developer_email || '',
      avatar: s.developer_avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      role: s.developer_role || 'Developer',
    },
    repository: {
      id: s.repository_id,
      name: s.repo_name,
      branch: s.source_branch,
      targetBranch: s.target_branch,
      url: s.github_pr_url,
    },
    submissionDate: s.created_at,
    language: s.repo_language,
    status: s.status,
    riskLevel: s.risk_level,
    riskScore: s.risk_score,
    aiModel: s.ai_model,
    aiSummary: s.ai_summary || '',
    aiExplanation: s.ai_explanation || '',
    filesChangedCount: s.files_changed_count,
    additions: s.additions,
    deletions: s.deletions,
    reviewTimeSeconds: s.review_time_seconds,
    managerDecision: s.manager_decision_type
      ? {
          decision: s.manager_decision_type,
          decidedAt: s.manager_decision_at,
          managerName: s.manager_name,
          managerAvatar: s.manager_avatar,
          feedback: s.manager_feedback,
          commentsCount: s.manager_comments_count,
        }
      : undefined,
    issues: issues.map((iss) => ({
      id: iss.id,
      title: iss.title,
      severity: iss.severity,
      category: iss.category,
      file: iss.file,
      lineStart: iss.line_start,
      lineEnd: iss.line_end,
      explanation: iss.explanation,
      whyItIsAProblem: iss.why_it_is_a_problem || '',
      suggestedSolution: iss.suggested_solution,
      originalSnippet: iss.original_snippet,
      suggestedFixSnippet: iss.suggested_fix_snippet,
      cwe: iss.cwe,
      status: iss.status,
    })),
    codeFiles: codeFiles.map((cf) => ({
      filename: cf.filename,
      language: cf.language,
      content: cf.content,
      suggestedContent: cf.suggested_content,
      patch: cf.patch,
      status: cf.status,
      additions: cf.additions,
      deletions: cf.deletions,
      problematicLines: issues
        .filter((i) => i.file === cf.filename)
        .map((i) => ({
          line: i.line_start,
          severity: i.severity,
          issueId: i.id,
          message: i.title,
        })),
    })),
  };

  res.json({ submission });
});

/**
 * Trigger / Retry AI Scan
 */
submissionsRouter.post('/:id/trigger-review', async (req, res) => {
  const sub = db.prepare('SELECT * FROM submissions WHERE id = ?').get(req.params.id) as any;
  if (!sub) {
    return res.status(404).json({ error: 'Submission not found' });
  }

  const repo = db.prepare('SELECT * FROM repositories WHERE id = ?').get(sub.repository_id) as any;
  const codeFile = db.prepare('SELECT * FROM code_files WHERE submission_id = ? LIMIT 1').get(sub.id) as any;

  // Mark as reviewing
  db.prepare('UPDATE submissions SET status = \'ai_reviewing\' WHERE id = ?').run(sub.id);

  const diffContent = codeFile?.content || `diff --git a/test.ts b/test.ts\n--- a/test.ts\n+++ b/test.ts\n@@ -1,5 +1,5 @@\n+ ${sub.title}`;

  try {
    const analysis = await analyzeCodeDiff(sub.title, sub.ai_summary || '', diffContent, repo?.language || 'TypeScript');

    // Remove old issues
    db.prepare('DELETE FROM issues WHERE submission_id = ?').run(sub.id);

    // Insert newly generated issues
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
        `iss-${sub.id}-${idx + 1}-${Date.now().toString(36)}`,
        sub.id,
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

    const nextStatus = analysis.issues.some((i) => i.severity === 'critical')
      ? 'changes_requested'
      : 'ai_completed';

    db.prepare(`
      UPDATE submissions SET
        status = ?,
        risk_level = ?,
        risk_score = ?,
        ai_summary = ?,
        ai_explanation = ?,
        review_time_seconds = 14,
        updated_at = ?
      WHERE id = ?
    `).run(nextStatus, analysis.riskLevel, analysis.riskScore, analysis.summary, analysis.explanation, new Date().toISOString(), sub.id);

    res.json({ success: true, analysis });
  } catch (err: any) {
    db.prepare('UPDATE submissions SET status = \'ai_completed\' WHERE id = ?').run(sub.id);
    res.status(500).json({ error: err.message || 'AI Review failed.' });
  }
});

/**
 * Manager Decision (Approve / Request Changes)
 */
submissionsRouter.post('/:id/decision', async (req, res) => {
  const { decision, feedback, managerName, managerAvatar } = req.body;
  const sub = db.prepare('SELECT * FROM submissions WHERE id = ?').get(req.params.id) as any;

  if (!sub) {
    return res.status(404).json({ error: 'Submission not found' });
  }

  const now = new Date().toISOString();
  db.prepare(`
    UPDATE submissions SET
      status = ?,
      manager_decision_type = ?,
      manager_decision_at = ?,
      manager_name = ?,
      manager_avatar = ?,
      manager_feedback = ?,
      manager_comments_count = manager_comments_count + 1,
      updated_at = ?
    WHERE id = ?
  `).run(
    decision === 'approved' ? 'approved' : 'changes_requested',
    decision,
    now,
    managerName || 'Sarah Jenkins',
    managerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    feedback || 'Decision recorded.',
    now,
    sub.id
  );

  // Optional: Post comment to GitHub PR if repository has token
  const repo = db.prepare('SELECT * FROM repositories WHERE id = ?').get(sub.repository_id) as any;
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(repo?.user_id) as any;
  if (repo && user?.access_token && sub.pr_number) {
    const [owner, repoName] = repo.full_name.split('/');
    const commentBody = `### RevAI Engineering Manager Review\n\n**Decision:** ${decision.toUpperCase()}\n**Reviewer:** ${managerName || 'Sarah Jenkins'}\n\n${feedback}`;
    try {
      await postReviewComment(owner, repoName, sub.pr_number, commentBody, user.access_token);
    } catch {
      // Non-fatal
    }
  }

  res.json({ success: true, message: `PR decision recorded: ${decision}` });
});

/**
 * Update issue status (mark addressed or dismiss)
 */
submissionsRouter.post('/:id/issues/:issueId/status', (req, res) => {
  const { status } = req.body;
  if (!['open', 'addressed', 'dismissed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  db.prepare('UPDATE issues SET status = ? WHERE id = ? AND submission_id = ?').run(status, req.params.issueId, req.params.id);

  // Recalculate risk score
  const remainingOpen = db.prepare('SELECT COUNT(*) as count FROM issues WHERE submission_id = ? AND status = \'open\'').get(req.params.id) as any;
  const newScore = Math.max(10, remainingOpen.count * 25);
  const newLevel = newScore > 75 ? 'critical' : newScore > 40 ? 'high' : newScore > 20 ? 'medium' : 'low';

  db.prepare('UPDATE submissions SET risk_score = ?, risk_level = ? WHERE id = ?').run(newScore, newLevel, req.params.id);

  res.json({ success: true, status, newScore, newLevel });
});
