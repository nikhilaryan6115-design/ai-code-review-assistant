import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use /tmp on serverless environments (like Vercel read-only root) or local data/
const dbDir = process.env.VERCEL
  ? path.resolve('/tmp/revai-data')
  : path.resolve(__dirname, '../data');

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'revai.db');
export const db = new Database(dbPath);

// Enable WAL mode for high concurrency
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      github_id TEXT UNIQUE,
      username TEXT NOT NULL,
      email TEXT,
      avatar_url TEXT,
      access_token TEXT,
      role TEXT DEFAULT 'developer',
      created_at TEXT NOT NULL,
      last_login_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS repositories (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      github_repo_id TEXT,
      owner TEXT NOT NULL,
      name TEXT NOT NULL,
      full_name TEXT NOT NULL UNIQUE,
      description TEXT,
      language TEXT,
      default_branch TEXT DEFAULT 'main',
      is_private INTEGER DEFAULT 0,
      auto_review_enabled INTEGER DEFAULT 1,
      webhook_id TEXT,
      webhook_status TEXT DEFAULT 'active',
      stars INTEGER DEFAULT 0,
      active_prs_count INTEGER DEFAULT 0,
      total_reviews_count INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS submissions (
      id TEXT PRIMARY KEY,
      repository_id TEXT NOT NULL,
      pr_number INTEGER NOT NULL,
      title TEXT NOT NULL,
      developer_id TEXT,
      developer_name TEXT NOT NULL,
      developer_email TEXT,
      developer_avatar TEXT,
      developer_role TEXT,
      source_branch TEXT NOT NULL,
      target_branch TEXT NOT NULL,
      commit_sha TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      risk_level TEXT DEFAULT 'medium',
      risk_score INTEGER DEFAULT 50,
      ai_model TEXT DEFAULT 'Qwen2.5-Coder 7B',
      ai_summary TEXT,
      ai_explanation TEXT,
      files_changed_count INTEGER DEFAULT 1,
      additions INTEGER DEFAULT 0,
      deletions INTEGER DEFAULT 0,
      github_pr_url TEXT,
      manager_decision_type TEXT,
      manager_decision_at TEXT,
      manager_name TEXT,
      manager_avatar TEXT,
      manager_feedback TEXT,
      manager_comments_count INTEGER DEFAULT 0,
      review_time_seconds INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY(repository_id) REFERENCES repositories(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS issues (
      id TEXT PRIMARY KEY,
      submission_id TEXT NOT NULL,
      title TEXT NOT NULL,
      severity TEXT NOT NULL,
      category TEXT NOT NULL,
      file TEXT NOT NULL,
      line_start INTEGER NOT NULL,
      line_end INTEGER NOT NULL,
      explanation TEXT NOT NULL,
      why_it_is_a_problem TEXT,
      suggested_solution TEXT NOT NULL,
      original_snippet TEXT NOT NULL,
      suggested_fix_snippet TEXT NOT NULL,
      cwe TEXT,
      status TEXT DEFAULT 'open',
      FOREIGN KEY(submission_id) REFERENCES submissions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS code_files (
      id TEXT PRIMARY KEY,
      submission_id TEXT NOT NULL,
      filename TEXT NOT NULL,
      language TEXT NOT NULL,
      content TEXT NOT NULL,
      suggested_content TEXT,
      patch TEXT,
      FOREIGN KEY(submission_id) REFERENCES submissions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      submission_id TEXT,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      read INTEGER DEFAULT 0,
      link TEXT,
      pr_number INTEGER
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      event TEXT NOT NULL,
      details TEXT,
      created_at TEXT NOT NULL
    );
  `);

  // Seed default data if empty
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count === 0) {
    seedInitialData();
  }
}

function seedInitialData() {
  const now = new Date().toISOString();
  
  // Seed Sarah Jenkins (Manager)
  db.prepare(`
    INSERT INTO users (id, github_id, username, email, avatar_url, role, created_at, last_login_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'usr-sarah',
    'gh-1001',
    'sarahjenkins',
    'sarah.jenkins@acme-corp.internal',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'manager',
    now,
    now
  );

  // Seed Rahul Sharma (Developer)
  db.prepare(`
    INSERT INTO users (id, github_id, username, email, avatar_url, role, created_at, last_login_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'usr-rahul',
    'gh-1002',
    'rahulsharma',
    'rahul.sharma@acme-corp.internal',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'developer',
    now,
    now
  );

  // Seed Repositories
  const repoStmt = db.prepare(`
    INSERT INTO repositories (id, user_id, github_repo_id, owner, name, full_name, description, language, default_branch, is_private, auto_review_enabled, webhook_status, stars, active_prs_count, total_reviews_count, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  repoStmt.run(
    'repo-auth-service',
    'usr-sarah',
    'gh-r-101',
    'acme-org',
    'auth-service',
    'acme-org/auth-service',
    'OAuth2 & JWT token exchange microservice with MFA enforcement and session store.',
    'TypeScript',
    'main',
    0,
    1,
    'active',
    142,
    3,
    28,
    now
  );

  repoStmt.run(
    'repo-payment-gateway',
    'usr-sarah',
    'gh-r-102',
    'acme-org',
    'payment-gateway',
    'acme-org/payment-gateway',
    'Stripe and Adyen payment processing pipeline with idempotent webhook handlers.',
    'Go',
    'main',
    0,
    1,
    'active',
    89,
    1,
    45,
    now
  );

  repoStmt.run(
    'repo-user-api',
    'usr-rahul',
    'gh-r-103',
    'acme-org',
    'user-api',
    'acme-org/user-api',
    'Core customer identity, profile data persistence, and RBAC authorization engine.',
    'Python',
    'main',
    0,
    1,
    'active',
    64,
    2,
    19,
    now
  );

  // Seed Submissions
  const subStmt = db.prepare(`
    INSERT INTO submissions (
      id, repository_id, pr_number, title, developer_id, developer_name, developer_email, developer_avatar, developer_role,
      source_branch, target_branch, commit_sha, status, risk_level, risk_score, ai_model, ai_summary, ai_explanation,
      files_changed_count, additions, deletions, github_pr_url, manager_decision_type, manager_decision_at, manager_name,
      manager_avatar, manager_feedback, manager_comments_count, review_time_seconds, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?
    )
  `);

  subStmt.run(
    'sub-142',
    'repo-auth-service',
    142,
    'feat(auth): Add refresh token rotation with Redis store',
    'usr-rahul',
    'Rahul Sharma',
    'rahul.sharma@acme-corp.internal',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'Backend Engineer',
    'feat/refresh-token-rotation',
    'main',
    '7b9a4c1',
    'changes_requested',
    'critical',
    82,
    'Qwen2.5-Coder 7B',
    'Detected high-severity security vulnerability in token revocation logic: SQL Injection vector in audit log query and race condition in Redis token blacklist expiration.',
    'The implementation replaces static refresh tokens with rotating credentials. However, raw string concatenation in the audit logger bypasses parameterized query guards, exposing the underlying Postgres database to SQLi. Additionally, Redis TTL key deletion lacks Lua transactional locking.',
    3,
    148,
    32,
    'https://github.com/acme-org/auth-service/pull/142',
    'changes_requested',
    now,
    'Sarah Jenkins',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'Block merge until SQL injection in audit logger is sanitized with parameterized placeholders. Review Lua script atomic lock for Redis blacklist.',
    2,
    14,
    now,
    now
  );

  subStmt.run(
    'sub-143',
    'repo-payment-gateway',
    89,
    'fix(billing): Handle Stripe webhook idempotency race conditions',
    'usr-rahul',
    'Elena Rostova',
    'elena.r@acme-corp.internal',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    'Staff Security Engineer',
    'fix/stripe-idempotency',
    'main',
    '4e8d2a9',
    'approved',
    'safe',
    18,
    'Qwen2.5-Coder 7B',
    'Clean patch introducing distributed mutex locking via Redis Redlock. All OWASP Top 10 security assertions passed. Minor test coverage observation.',
    'The pull request resolves duplicate charge events triggered by network retry bursts from Stripe. The implementation utilizes a distributed lock with 5000ms TTL. Verified zero SQL injection, secure error wrapping, and compliant cryptographic validation.',
    2,
    84,
    16,
    'https://github.com/acme-org/payment-gateway/pull/89',
    'approved',
    now,
    'Sarah Jenkins',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'Verified with staging payment emulator. Excellent distributed locking implementation.',
    1,
    11,
    now,
    now
  );

  // Seed Issues for sub-142
  const issueStmt = db.prepare(`
    INSERT INTO issues (
      id, submission_id, title, severity, category, file, line_start, line_end,
      explanation, why_it_is_a_problem, suggested_solution, original_snippet, suggested_fix_snippet, cwe, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  issueStmt.run(
    'iss-01',
    'sub-142',
    'SQL Injection in Audit Log Statement',
    'critical',
    'security',
    'src/services/auth.service.ts',
    42,
    46,
    'Direct interpolation of untrusted `userId` into SQL query string without parameterization.',
    'Attackers supplying crafted authorization headers can escape string boundaries and execute arbitrary SQL queries, leading to full database compromise or credential exfiltration.',
    'Replace template literal concatenation with prepared parameterized queries using database driver parameters ($1, $2).',
    'const logQuery = `INSERT INTO audit_logs (user_id, action) VALUES (\'${userId}\', \'token_refresh\')`;\nawait db.query(logQuery);',
    'const logQuery = "INSERT INTO audit_logs (user_id, action) VALUES ($1, $2)";\nawait db.query(logQuery, [userId, "token_refresh"]);',
    'CWE-89: SQL Injection',
    'open'
  );

  issueStmt.run(
    'iss-02',
    'sub-142',
    'Concurrent Race Condition in Token Blacklist',
    'high',
    'bug',
    'src/services/token.service.ts',
    89,
    94,
    'Non-atomic check-then-set operation on Redis key allows concurrent token reuse during rotation window.',
    'If two parallel requests arrive with the same valid refresh token before key eviction completes, both requests can succeed in minting fresh credentials, violating single-use rotation guarantees.',
    'Use an atomic Redis pipeline or Lua script combining GET, SETNX, and EXPIRE into an atomic transaction.',
    'const isBlacklisted = await redis.get(`bl:${tokenId}`);\nif (!isBlacklisted) {\n  await redis.set(`bl:${tokenId}`, \'1\', \'EX\', 86400);\n}',
    'const result = await redis.set(`bl:${tokenId}`, "1", "NX", "EX", 86400);\nif (!result) {\n  throw new SecurityError("Token reuse detected");\n}',
    'CWE-362: Race Condition',
    'open'
  );

  // Seed Code Files
  db.prepare(`
    INSERT INTO code_files (id, submission_id, filename, language, content, suggested_content, patch)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    'cf-01',
    'sub-142',
    'src/services/auth.service.ts',
    'typescript',
    `import { db } from '../database';
import { redis } from '../cache';
import { signAccessToken } from '../utils/jwt';

export class AuthService {
  async rotateRefreshToken(userId: string, incomingToken: string) {
    // Audit log insertion with vulnerable concatenation
    const logQuery = \`INSERT INTO audit_logs (user_id, action) VALUES ('\${userId}', 'token_refresh')\`;
    await db.query(logQuery);

    const isValid = await this.verifyTokenSignature(incomingToken);
    if (!isValid) throw new Error("Invalid token signature");

    return signAccessToken({ userId });
  }
}`,
    `import { db } from '../database';
import { redis } from '../cache';
import { signAccessToken } from '../utils/jwt';

export class AuthService {
  async rotateRefreshToken(userId: string, incomingToken: string) {
    // Safe parameterized audit log query
    const logQuery = "INSERT INTO audit_logs (user_id, action) VALUES ($1, $2)";
    await db.query(logQuery, [userId, "token_refresh"]);

    const isValid = await this.verifyTokenSignature(incomingToken);
    if (!isValid) throw new Error("Invalid token signature");

    return signAccessToken({ userId });
  }
}`,
    `@@ -6,3 +6,3 @@
-    const logQuery = \`INSERT INTO audit_logs (user_id, action) VALUES ('\${userId}', 'token_refresh')\`;
-    await db.query(logQuery);
+    const logQuery = "INSERT INTO audit_logs (user_id, action) VALUES ($1, $2)";
+    await db.query(logQuery, [userId, "token_refresh"]);`
  );

  // Seed Notifications
  const notifStmt = db.prepare(`
    INSERT INTO notifications (id, user_id, submission_id, title, message, type, timestamp, read, link, pr_number)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  notifStmt.run(
    'notif-1',
    'usr-sarah',
    'sub-142',
    'Critical Security Vulnerability Detected',
    'Qwen2.5-Coder surfaced a CWE-89 SQL Injection vector in PR #142 (auth-service).',
    'critical',
    '10m ago',
    0,
    '/manager/reviews/sub-142',
    142
  );

  notifStmt.run(
    'notif-2',
    'usr-sarah',
    'sub-143',
    'Pull Request Pre-Review Passed',
    'Automated AI inspection completed with 0 critical findings on PR #89 (payment-gateway).',
    'approval',
    '1h ago',
    1,
    '/manager/reviews/sub-143',
    89
  );
}
