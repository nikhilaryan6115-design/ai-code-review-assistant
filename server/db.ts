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
  try {
    fs.mkdirSync(dbDir, { recursive: true });
  } catch {
    // Ignore folder creation errors in restricted environments
  }
}

const dbFilePath = path.join(dbDir, 'revai-store.json');

export class PureDatabase {
  tables: Map<string, any[]> = new Map();
  filePath: string | null = null;

  constructor(filePath?: string) {
    this.filePath = filePath || null;
    this.load();
  }

  load() {
    if (this.filePath && fs.existsSync(this.filePath)) {
      try {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const data = JSON.parse(raw);
        for (const [k, v] of Object.entries(data)) {
          this.tables.set(k.toLowerCase(), v as any[]);
        }
      } catch (e) {
        console.warn('[PureDB] Could not load persisted file, starting clean:', e);
      }
    }
  }

  save() {
    if (!this.filePath) return;
    try {
      const obj: Record<string, any[]> = {};
      for (const [k, v] of this.tables.entries()) {
        obj[k] = v;
      }
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(this.filePath, JSON.stringify(obj, null, 2), 'utf-8');
    } catch {
      // Ignore disk write errors in serverless
    }
  }

  getTable(name: string): any[] {
    const clean = name.trim().toLowerCase();
    if (!this.tables.has(clean)) {
      this.tables.set(clean, []);
    }
    return this.tables.get(clean)!;
  }

  pragma(_sql: string) {
    return [];
  }

  exec(sql: string) {
    const statements = sql
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    for (const stmt of statements) {
      this.prepare(stmt).run();
    }
  }

  prepare(sql: string) {
    const rawSql = sql.trim();
    const cleanSql = rawSql.replace(/\s+/g, ' ');

    return {
      get: (...params: any[]) => {
        const all = this.executeSelect(cleanSql, params);
        return all[0] || undefined;
      },
      all: (...params: any[]) => {
        return this.executeSelect(cleanSql, params);
      },
      run: (...params: any[]) => {
        const res = this.executeMutation(cleanSql, params);
        this.save();
        return res;
      },
    };
  }

  private executeSelect(sql: string, params: any[]): any[] {
    const lower = sql.toLowerCase();

    // Handle COUNT(*) queries e.g. SELECT COUNT(*) as count FROM users
    if (lower.startsWith('select count(*)')) {
      const match = sql.match(/from\s+([a-zA-Z0-9_]+)/i);
      if (match) {
        const table = this.getTable(match[1]);
        return [{ count: table.length }];
      }
      return [{ count: 0 }];
    }

    // Handle submissions JOIN repositories
    if (lower.includes('from submissions') && lower.includes('join repositories')) {
      const submissions = this.getTable('submissions');
      const repositories = this.getTable('repositories');

      let combined = submissions.map((sub) => {
        const repo = repositories.find((r) => r.id === sub.repository_id) || {};
        return {
          ...sub,
          repo_name: repo.name || '',
          repo_full_name: repo.full_name || '',
          repo_language: repo.language || '',
          repo_default_branch: repo.default_branch || 'main',
        };
      });

      // Filter by WHERE
      if (lower.includes('where')) {
        let pIndex = 0;
        if (lower.includes('s.id = ?')) {
          const targetId = params[pIndex++];
          combined = combined.filter((s) => s.id === targetId);
        } else {
          // Dynamic submission filters
          if (lower.includes('s.status = ?')) {
            const status = params[pIndex++];
            combined = combined.filter((s) => s.status === status);
          }
          if (lower.includes('s.risk_level = ?')) {
            const risk = params[pIndex++];
            combined = combined.filter((s) => s.risk_level === risk);
          }
          if (lower.includes('s.repository_id = ?')) {
            const repoId = params[pIndex++];
            combined = combined.filter((s) => s.repository_id === repoId);
          }
          if (lower.includes('s.title like ?')) {
            const term = (params[pIndex++] || '').replace(/%/g, '').toLowerCase();
            pIndex++; // skip second like param
            pIndex++; // skip third like param
            combined = combined.filter(
              (s) =>
                (s.title || '').toLowerCase().includes(term) ||
                (s.developer_name || '').toLowerCase().includes(term) ||
                (s.repo_name || '').toLowerCase().includes(term)
            );
          }
        }
      }

      if (lower.includes('order by s.created_at desc')) {
        combined.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
      }

      return combined;
    }

    // Standard SELECT from single table
    const fromMatch = sql.match(/from\s+([a-zA-Z0-9_]+)/i);
    if (!fromMatch) return [];
    const tableName = fromMatch[1];
    let rows = [...this.getTable(tableName)];

    // Check WHERE clause
    const whereMatch = sql.match(/where\s+(.*?)(?:\s+order\s+by|\s+limit|$)/i);
    if (whereMatch) {
      const whereClause = whereMatch[1].trim();
      let pIdx = 0;

      if (/([a-zA-Z0-9_]+)\s*=\s*\?/i.test(whereClause)) {
        const colMatch = whereClause.match(/([a-zA-Z0-9_]+)\s*=\s*\?/i);
        if (colMatch) {
          const col = colMatch[1];
          const val = params[pIdx++];
          rows = rows.filter((r) => String(r[col]) === String(val));
        }
      } else if (/([a-zA-Z0-9_]+)\s*=\s*['"](.*?)['"]/i.test(whereClause)) {
        const colMatch = whereClause.match(/([a-zA-Z0-9_]+)\s*=\s*['"](.*?)['"]/i);
        if (colMatch) {
          const col = colMatch[1];
          const val = colMatch[2];
          rows = rows.filter((r) => String(r[col]) === String(val));
        }
      }
    }

    // ORDER BY
    if (lower.includes('order by')) {
      const orderMatch = sql.match(/order\s+by\s+([a-zA-Z0-9_]+)(?:\s+(asc|desc))?/i);
      if (orderMatch) {
        const col = orderMatch[1];
        const isDesc = (orderMatch[2] || 'asc').toLowerCase() === 'desc';
        rows.sort((a, b) => {
          const valA = a[col] || '';
          const valB = b[col] || '';
          if (valA < valB) return isDesc ? 1 : -1;
          if (valA > valB) return isDesc ? -1 : 1;
          return 0;
        });
      }
    }

    // LIMIT
    const limitMatch = sql.match(/limit\s+(\d+)/i);
    if (limitMatch) {
      rows = rows.slice(0, parseInt(limitMatch[1], 10));
    }

    // Column projection
    if (lower.startsWith('select full_name from')) {
      return rows.map((r) => ({ full_name: r.full_name }));
    }

    return rows;
  }

  private executeMutation(sql: string, params: any[]): { changes: number; lastInsertRowid: number } {
    const lower = sql.toLowerCase();

    // DDL (CREATE TABLE)
    if (lower.startsWith('create table')) {
      const match = sql.match(/create\s+table\s+(?:if\s+not\s+exists\s+)?([a-zA-Z0-9_]+)/i);
      if (match) {
        this.getTable(match[1]);
      }
      return { changes: 0, lastInsertRowid: 0 };
    }

    // INSERT INTO <table> (<cols>) VALUES (?, ?, ...)
    if (lower.startsWith('insert into')) {
      const match = sql.match(/insert\s+into\s+([a-zA-Z0-9_]+)\s*\((.*?)\)\s*values/i);
      if (match) {
        const tableName = match[1];
        const cols = match[2].split(',').map((c) => c.trim().toLowerCase());
        const row: Record<string, any> = {};
        for (let i = 0; i < cols.length; i++) {
          row[cols[i]] = params[i] !== undefined ? params[i] : null;
        }
        const table = this.getTable(tableName);
        table.push(row);
        return { changes: 1, lastInsertRowid: table.length };
      }
    }

    // UPDATE <table> SET <assignments> WHERE <condition>
    if (lower.startsWith('update')) {
      const tableMatch = sql.match(/update\s+([a-zA-Z0-9_]+)\s+set\s+(.*?)(?:\s+where\s+(.*))?$/i);
      if (tableMatch) {
        const tableName = tableMatch[1];
        const setClause = tableMatch[2];
        const whereClause = tableMatch[3];
        const table = this.getTable(tableName);

        let pIdx = 0;
        const assignments: { col: string; val?: any; isRaw?: boolean; rawExpr?: string }[] = [];

        // Parse assignments
        const assignParts = setClause.split(',').map((p) => p.trim());
        for (const part of assignParts) {
          const eqIdx = part.indexOf('=');
          if (eqIdx !== -1) {
            const col = part.slice(0, eqIdx).trim();
            const valExpr = part.slice(eqIdx + 1).trim();
            if (valExpr === '?') {
              assignments.push({ col, val: params[pIdx++] });
            } else if (valExpr.includes('+ 1')) {
              assignments.push({ col, isRaw: true, rawExpr: 'inc' });
            } else if (valExpr.startsWith('(')) {
              // Subquery in UPDATE like active_prs_count
              assignments.push({ col, val: 0 });
            } else {
              // literal e.g. 1 or 'ai_completed'
              assignments.push({ col, val: valExpr.replace(/^['"]|['"]$/g, '') });
            }
          }
        }

        // Parse WHERE
        let targetId: any = null;
        let whereCol = 'id';
        if (whereClause) {
          const colEq = whereClause.match(/([a-zA-Z0-9_]+)\s*=\s*\?/i);
          if (colEq) {
            whereCol = colEq[1];
            targetId = params[pIdx++];
          }
        }

        let changes = 0;
        for (const row of table) {
          if (!targetId || String(row[whereCol]) === String(targetId)) {
            for (const assign of assignments) {
              if (assign.isRaw && assign.rawExpr === 'inc') {
                row[assign.col] = (Number(row[assign.col]) || 0) + 1;
              } else {
                row[assign.col] = assign.val;
              }
            }
            changes++;
          }
        }
        return { changes, lastInsertRowid: 0 };
      }
    }

    // DELETE FROM <table> WHERE <condition>
    if (lower.startsWith('delete from')) {
      const match = sql.match(/delete\s+from\s+([a-zA-Z0-9_]+)(?:\s+where\s+([a-zA-Z0-9_]+)\s*=\s*\?)?/i);
      if (match) {
        const tableName = match[1];
        const table = this.getTable(tableName);
        if (match[2]) {
          const col = match[2];
          const val = params[0];
          const initialLen = table.length;
          const filtered = table.filter((r) => String(r[col]) !== String(val));
          this.tables.set(tableName.toLowerCase(), filtered);
          return { changes: initialLen - filtered.length, lastInsertRowid: 0 };
        } else {
          const changes = table.length;
          this.tables.set(tableName.toLowerCase(), []);
          return { changes, lastInsertRowid: 0 };
        }
      }
    }

    return { changes: 0, lastInsertRowid: 0 };
  }
}

export const db = new PureDatabase(dbFilePath);

// Enable pragmas
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
      created_at TEXT NOT NULL
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
      updated_at TEXT NOT NULL
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
      status TEXT DEFAULT 'open'
    );

    CREATE TABLE IF NOT EXISTS code_files (
      id TEXT PRIMARY KEY,
      submission_id TEXT NOT NULL,
      filename TEXT NOT NULL,
      language TEXT NOT NULL,
      content TEXT NOT NULL,
      suggested_content TEXT,
      patch TEXT
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
  if (!userCount || userCount.count === 0) {
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
