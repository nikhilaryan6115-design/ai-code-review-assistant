import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import {
  getAccessibleRepositories,
  getPullRequestDiff,
  getPullRequestDetails,
  searchGitHubRepositories,
  getSingleRepository,
  getRepositoryContents,
  getRawFileContent,
} from '../github';
import { analyzeCodeDiff } from '../ai';

export const reposRouter = Router();

const JWT_SECRET = process.env.SESSION_SECRET || 'revai_dev_secret_key_change_in_production_32';

function getCurrentUser(req: any) {
  const token = req.cookies?.revai_session || req.headers.authorization?.replace('Bearer ', '');
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string };
    return db.prepare('SELECT * FROM users WHERE id = ?').get(payload.id) as any;
  } catch {
    return null;
  }
}

/**
 * Search GitHub repositories live
 * Query can be a repo name, owner/repo, or a full GitHub URL
 */
reposRouter.get('/search', async (req, res) => {
  const query = ((req.query.q as string) || '').trim();
  const page = parseInt(req.query.page as string, 10) || 1;
  const user = getCurrentUser(req);
  const token = user?.access_token || process.env.GITHUB_PERSONAL_ACCESS_TOKEN || undefined;

  if (!query) {
    return res.json({ items: [], total_count: 0 });
  }

  // Check if user entered a direct GitHub URL or owner/repo shorthand
  const urlMatch = query.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+?)(?:\/|\.git|$)/);
  const ownerRepoMatch = query.match(/^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/);

  if (urlMatch || ownerRepoMatch) {
    const owner = urlMatch ? urlMatch[1] : ownerRepoMatch![1];
    const repo = (urlMatch ? urlMatch[2] : ownerRepoMatch![2]).replace(/\.git$/, '');

    try {
      const single = await getSingleRepository(owner, repo, token);
      const connectedList = (db.prepare('SELECT full_name FROM repositories').all() as any[]).map((r) => r.full_name);

      return res.json({
        total_count: 1,
        items: [
          {
            id: single.id,
            name: single.name,
            fullName: single.full_name,
            owner: single.owner.login,
            ownerAvatar: single.owner.avatar_url,
            description: single.description || 'No description provided.',
            language: single.language || 'Unknown',
            stars: single.stargazers_count,
            isPrivate: single.private,
            defaultBranch: single.default_branch,
            htmlUrl: single.html_url,
            isConnected: connectedList.includes(single.full_name),
          },
        ],
      });
    } catch {
      // Fall through to general search if single lookup fails
    }
  }

  try {
    const data = await searchGitHubRepositories(query, page, 15, token);
    const connectedList = (db.prepare('SELECT full_name FROM repositories').all() as any[]).map((r) => r.full_name);

    const items = data.items.map((r) => ({
      id: r.id,
      name: r.name,
      fullName: r.full_name,
      owner: r.owner.login,
      ownerAvatar: r.owner.avatar_url,
      description: r.description || 'No description provided.',
      language: r.language || 'Unknown',
      stars: r.stargazers_count,
      isPrivate: r.private,
      defaultBranch: r.default_branch,
      htmlUrl: r.html_url,
      isConnected: connectedList.includes(r.full_name),
    }));

    res.json({ total_count: data.total_count, items });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to search GitHub repositories.' });
  }
});

/**
 * Resolve direct GitHub URL
 */
reposRouter.post('/resolve-url', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'GitHub repository URL is required.' });
  }

  const match = url.trim().match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)/);
  if (!match) {
    return res.status(400).json({ error: 'Invalid GitHub repository URL format. Example: https://github.com/owner/repository' });
  }

  const owner = match[1];
  const repo = match[2].replace(/\.git$/, '');
  const user = getCurrentUser(req);
  const token = user?.access_token || process.env.GITHUB_PERSONAL_ACCESS_TOKEN || undefined;

  try {
    const data = await getSingleRepository(owner, repo, token);
    const connectedList = (db.prepare('SELECT full_name FROM repositories').all() as any[]).map((r) => r.full_name);

    res.json({
      repository: {
        id: data.id,
        name: data.name,
        fullName: data.full_name,
        owner: data.owner.login,
        ownerAvatar: data.owner.avatar_url,
        description: data.description || 'No description provided.',
        language: data.language || 'Unknown',
        stars: data.stargazers_count,
        isPrivate: data.private,
        defaultBranch: data.default_branch,
        htmlUrl: data.html_url,
        isConnected: connectedList.includes(data.full_name),
      },
    });
  } catch (err: any) {
    res.status(404).json({ error: err.message || 'Repository not found on GitHub.' });
  }
});

/**
 * Get repository contents / file tree
 */
reposRouter.get('/tree', async (req, res) => {
  const owner = req.query.owner as string;
  const repo = req.query.repo as string;
  const path = (req.query.path as string) || '';
  const ref = (req.query.ref as string) || undefined;

  if (!owner || !repo) {
    return res.status(400).json({ error: 'Owner and repo are required query parameters.' });
  }

  const user = getCurrentUser(req);
  const token = user?.access_token || process.env.GITHUB_PERSONAL_ACCESS_TOKEN || undefined;

  try {
    const contents = await getRepositoryContents(owner, repo, path, ref, token);
    res.json({ contents });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch repository contents.' });
  }
});

/**
 * Get raw file content and optionally trigger AI analysis on it
 */
reposRouter.get('/file-content', async (req, res) => {
  const owner = req.query.owner as string;
  const repo = req.query.repo as string;
  const path = req.query.path as string;
  const ref = (req.query.ref as string) || undefined;

  if (!owner || !repo || !path) {
    return res.status(400).json({ error: 'Owner, repo, and path are required.' });
  }

  const user = getCurrentUser(req);
  const token = user?.access_token || process.env.GITHUB_PERSONAL_ACCESS_TOKEN || undefined;

  try {
    const content = await getRawFileContent(owner, repo, path, ref, token);
    res.json({ content, filename: path.split('/').pop() || path, path });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to load file content.' });
  }
});

/**
 * Analyze a specific repository file using RevAI
 */
reposRouter.post('/analyze-file', async (req, res) => {
  const { owner, repo, path, content, language } = req.body;
  if (!path || !content) {
    return res.status(400).json({ error: 'Path and content are required.' });
  }

  try {
    const filename = path.split('/').pop() || path;
    const diffRepresentation = `--- a/${path}\n+++ b/${path}\n@@ -1,1 +1,${content.split('\n').length} @@\n${content
      .split('\n')
      .map((line: string) => `+${line}`)
      .join('\n')}`;

    const analysis = await analyzeCodeDiff(
      `File Review: ${filename}`,
      `Deep security & code quality review for ${owner}/${repo}/${path}`,
      diffRepresentation,
      language || 'typescript'
    );

    res.json({ success: true, analysis });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to analyze file.' });
  }
});

/**
 * Get all connected repositories
 */
reposRouter.get('/', async (req, res) => {
  const rows = db.prepare('SELECT * FROM repositories ORDER BY created_at DESC').all() as any[];

  const repositories = rows.map((r) => ({
    id: r.id,
    name: r.name,
    fullName: r.full_name,
    description: r.description || '',
    language: r.language || 'TypeScript',
    stars: r.stars,
    forks: 0,
    defaultBranch: r.default_branch,
    connectedAt: r.created_at,
    autoReviewEnabled: Boolean(r.auto_review_enabled),
    webhookStatus: r.webhook_status,
    activePrsCount: r.active_prs_count,
    totalReviewsCount: r.total_reviews_count,
    riskProfile: 'medium',
    isPrivate: Boolean(r.is_private),
  }));

  res.json({ repositories });
});

/**
 * Get accessible repositories from GitHub for connection picker
 */
reposRouter.get('/github-available', async (req, res) => {
  const user = getCurrentUser(req);
  if (!user || !user.access_token) {
    return res.json({
      configured: false,
      repositories: [],
      message: 'Authenticate with GitHub to import real GitHub repositories.',
    });
  }

  try {
    const ghRepos = await getAccessibleRepositories(user.access_token);
    const connectedFullNames = new Set(
      (db.prepare('SELECT full_name FROM repositories').all() as any[]).map((r) => r.full_name)
    );

    const available = ghRepos.map((r) => ({
      id: String(r.id),
      name: r.name,
      fullName: r.full_name,
      owner: r.owner.login,
      description: r.description || '',
      language: r.language || 'Unknown',
      stars: r.stargazers_count,
      isPrivate: r.private,
      defaultBranch: r.default_branch,
      htmlUrl: r.html_url,
      isConnected: connectedFullNames.has(r.full_name),
    }));

    res.json({ configured: true, repositories: available });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to list GitHub repositories.' });
  }
});

/**
 * Connect a repository
 */
reposRouter.post('/connect', async (req, res) => {
  const { name, fullName, description, language, defaultBranch, isPrivate, githubRepoId } = req.body;
  const user = getCurrentUser(req);

  if (!name) {
    return res.status(400).json({ error: 'Repository name is required.' });
  }

  const finalFullName = fullName || `acme-org/${name}`;
  const repoId = `repo-${name.toLowerCase().replace(/[^a-z0-9_-]/g, '-')}`;
  const now = new Date().toISOString();

  try {
    db.prepare(`
      INSERT INTO repositories (
        id, user_id, github_repo_id, owner, name, full_name, description,
        language, default_branch, is_private, auto_review_enabled, webhook_status, stars, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'active', 0, ?)
      ON CONFLICT(full_name) DO UPDATE SET
        description = excluded.description,
        language = excluded.language
    `).run(
      repoId,
      user?.id || null,
      githubRepoId || null,
      finalFullName.split('/')[0] || 'organization',
      name,
      finalFullName,
      description || 'Connected repository',
      language || 'TypeScript',
      defaultBranch || 'main',
      isPrivate ? 1 : 0,
      now
    );

    const repoRecord = db.prepare('SELECT * FROM repositories WHERE full_name = ?').get(finalFullName) as any;

    res.json({
      success: true,
      repository: {
        id: repoRecord.id,
        name: repoRecord.name,
        fullName: repoRecord.full_name,
        description: repoRecord.description,
        language: repoRecord.language,
        stars: repoRecord.stars,
        defaultBranch: repoRecord.default_branch,
        connectedAt: repoRecord.created_at,
        autoReviewEnabled: Boolean(repoRecord.auto_review_enabled),
        webhookStatus: repoRecord.webhook_status,
        activePrsCount: repoRecord.active_prs_count,
        totalReviewsCount: repoRecord.total_reviews_count,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to connect repository.' });
  }
});

/**
 * Toggle auto review
 */
reposRouter.post('/:id/toggle-auto-review', (req, res) => {
  const repo = db.prepare('SELECT * FROM repositories WHERE id = ?').get(req.params.id) as any;
  if (!repo) {
    return res.status(404).json({ error: 'Repository not found' });
  }

  const nextVal = repo.auto_review_enabled ? 0 : 1;
  db.prepare('UPDATE repositories SET auto_review_enabled = ? WHERE id = ?').run(nextVal, req.params.id);

  res.json({ success: true, autoReviewEnabled: Boolean(nextVal) });
});

/**
 * Disconnect a repository
 */
reposRouter.post('/:id/disconnect', (req, res) => {
  db.prepare('DELETE FROM repositories WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'Repository disconnected.' });
});

/**
 * Sync open Pull Requests from GitHub for a connected repository
 */
reposRouter.post('/:id/sync', async (req, res) => {
  const repo = db.prepare('SELECT * FROM repositories WHERE id = ?').get(req.params.id) as any;
  if (!repo) {
    return res.status(404).json({ error: 'Repository not found' });
  }

  const user = getCurrentUser(req);
  if (!user || !user.access_token) {
    return res.status(400).json({ error: 'Please connect a GitHub account to synchronize PRs.' });
  }

  const [owner, repoName] = repo.full_name.split('/');

  try {
    const prsRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/pulls?state=open&per_page=20`, {
      headers: {
        Authorization: `Bearer ${user.access_token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'RevAI-Code-Review-Platform',
      },
    });

    if (!prsRes.ok) {
      throw new Error(`GitHub API returned status ${prsRes.status}`);
    }

    const prs = (await prsRes.json()) as any[];
    let importedCount = 0;

    for (const pr of prs) {
      const subId = `sub-gh-${repo.id}-${pr.number}`;
      const now = new Date().toISOString();

      // Check if submission already exists
      const existing = db.prepare('SELECT * FROM submissions WHERE id = ?').get(subId);
      if (!existing) {
        // Fetch raw diff
        let diff = '';
        try {
          diff = await getPullRequestDiff(owner, repoName, pr.number, user.access_token);
        } catch {
          diff = `// Diff not available for PR #${pr.number}`;
        }

        // Run AI Analysis
        const analysis = await analyzeCodeDiff(pr.title, pr.body || '', diff, repo.language);

        db.prepare(`
          INSERT INTO submissions (
            id, repository_id, pr_number, title, developer_name, developer_avatar,
            developer_role, source_branch, target_branch, commit_sha, status,
            risk_level, risk_score, ai_model, ai_summary, ai_explanation,
            files_changed_count, additions, deletions, github_pr_url,
            review_time_seconds, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          subId,
          repo.id,
          pr.number,
          pr.title,
          pr.user?.login || 'contributor',
          pr.user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          'Software Engineer',
          pr.head?.ref || 'feature',
          pr.base?.ref || 'main',
          pr.head?.sha?.substring(0, 7) || 'HEAD',
          analysis.issues.some((i) => i.severity === 'critical') ? 'changes_requested' : 'ai_completed',
          analysis.riskLevel,
          analysis.riskScore,
          'Qwen2.5-Coder 7B',
          analysis.summary,
          analysis.explanation,
          pr.changed_files || 1,
          pr.additions || 0,
          pr.deletions || 0,
          pr.html_url,
          12,
          now,
          now
        );

        // Insert issues
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
            `iss-gh-${subId}-${idx + 1}`,
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

        // Insert code file
        db.prepare(`
          INSERT INTO code_files (id, submission_id, filename, language, content, patch)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(
          `cf-gh-${subId}`,
          subId,
          analysis.issues[0]?.file || 'patch.diff',
          repo.language.toLowerCase(),
          diff,
          diff
        );

        importedCount++;
      }
    }

    // Update active count on repo
    db.prepare('UPDATE repositories SET active_prs_count = (SELECT COUNT(*) FROM submissions WHERE repository_id = ? AND status != \'approved\') WHERE id = ?')
      .run(repo.id, repo.id);

    res.json({ success: true, importedCount, message: `Synchronized ${importedCount} pull requests from GitHub.` });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to sync PRs from GitHub.' });
  }
});
