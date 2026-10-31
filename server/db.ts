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

  // Seed default data if empty or outdated
  const subCount = db.prepare('SELECT COUNT(*) as count FROM submissions').get() as { count: number };
  if (!subCount || subCount.count < 6) {
    seedInitialData();
  }
}

function seedInitialData() {
  const now = new Date().toISOString();

  // Clear existing seeded records to ensure fresh portfolio test cases
  const seededIds = ['sub-142', 'sub-143', 'sub-156', 'sub-204', 'sub-218', 'sub-95'];
  for (const id of seededIds) {
    db.prepare('DELETE FROM submissions WHERE id = ?').run(id);
    db.prepare('DELETE FROM issues WHERE submission_id = ?').run(id);
    db.prepare('DELETE FROM code_files WHERE submission_id = ?').run(id);
  }
  
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

  // Seed Additional Portfolio Showcase Test Cases
  // 1. PR #156: AI Prompt Injection & Cloud SSRF in RAG Pipeline (Python)
  subStmt.run(
    'sub-156',
    'repo-user-api',
    156,
    'feat(ai): Implement multi-modal RAG prompt assembly with user context injection',
    'usr-marcus',
    'Marcus Chen',
    'marcus.chen@acme-corp.internal',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    'Senior ML Engineer',
    'feat/rag-prompt-assembly',
    'main',
    '8f2c1b4',
    'changes_requested',
    'critical',
    91,
    'Qwen2.5-Coder 7B',
    'Surfaced 2 critical security vulnerabilities: CWE-1336 Prompt Injection vector bypassing delimiter boundaries and CWE-918 Server-Side Request Forgery in remote document fetcher.',
    'Direct string concatenation in prompt builder allows untrusted user tokens to break instruction boundaries and hijack model response. Additionally, document fetcher accepts arbitrary URL schemes including internal cloud metadata IP 169.254.169.254.',
    4,
    215,
    48,
    'https://github.com/acme-org/user-api/pull/156',
    'changes_requested',
    now,
    'Sarah Jenkins',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'Block merge immediately. Enforce delimiter tagging for RAG context and apply URL scheme allowlist to prevent cloud metadata SSRF.',
    3,
    18,
    now,
    now
  );

  issueStmt.run(
    'iss-03',
    'sub-156',
    'CWE-1336: Direct Prompt Injection in System Context Delimiter',
    'critical',
    'security',
    'services/rag_service.py',
    54,
    59,
    'Unescaped interpolation of raw user input inside top-level LLM instruction block allows prompt jailbreaking.',
    'Malicious payloads containing system override tags can bypass safety moderation, exfiltrate private training schemas, and trigger unauthorized tool invocations.',
    'Separate system directives from dynamic user context using message role separation or structured XML boundary tags.',
    'prompt = f"System: Analyze user data.\\nContext: {user_input}\\nAnswer:"\nreturn llm.invoke(prompt)',
    'prompt = ChatPromptTemplate.from_messages([\n    ("system", "Analyze user data within isolated context boundary."),\n    ("human", "{user_input}")\n])\nreturn llm.invoke(prompt.format_messages(user_input=user_input))',
    'CWE-1336: Improper Neutralization in Prompt Template',
    'open'
  );

  issueStmt.run(
    'iss-04',
    'sub-156',
    'CWE-918: Server-Side Request Forgery (SSRF) in Remote Doc Loader',
    'high',
    'security',
    'services/rag_service.py',
    112,
    118,
    'Remote document retriever invokes `requests.get(source_url)` without validating private subnet or loopback addresses.',
    'Attackers can target internal AWS metadata service (169.254.169.254) to exfiltrate IAM role credentials or probe internal VPC infrastructure.',
    'Enforce strict allowlists: validate URL scheme (https only), resolve host IP before request, and reject RFC 1918 private subnets.',
    'def fetch_context_doc(source_url: str):\n    resp = requests.get(source_url, timeout=5)\n    return resp.text',
    'def fetch_context_doc(source_url: str):\n    parsed = validate_safe_public_url(source_url)\n    resp = requests.get(parsed, timeout=5, allow_redirects=False)\n    return resp.text',
    'CWE-918: Server-Side Request Forgery',
    'open'
  );

  db.prepare(`
    INSERT INTO code_files (id, submission_id, filename, language, content, suggested_content, patch)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    'cf-02',
    'sub-156',
    'services/rag_service.py',
    'python',
    `import requests
from langchain.prompts import PromptTemplate

class RAGPipeline:
    def build_prompt(self, user_input: str) -> str:
        # Vulnerable string interpolation in prompt assembly
        prompt = f"System: Analyze user data.\\nContext: {user_input}\\nAnswer:"
        return prompt

    def fetch_context_doc(self, source_url: str) -> str:
        # Unvalidated HTTP GET allowing SSRF
        resp = requests.get(source_url, timeout=5)
        return resp.text`,
    `import requests
from urllib.parse import urlparse
from langchain_core.prompts import ChatPromptTemplate

class RAGPipeline:
    def build_prompt(self, user_input: str):
        # Secure message role boundary isolation
        prompt = ChatPromptTemplate.from_messages([
            ("system", "Analyze user data within isolated context boundary."),
            ("human", "{user_input}")
        ])
        return prompt.format_messages(user_input=user_input)

    def fetch_context_doc(self, source_url: str) -> str:
        # Enforce HTTPS-only and block private cloud subnets
        parsed = urlparse(source_url)
        if parsed.scheme != "https" or parsed.hostname in ["169.254.169.254", "localhost", "127.0.0.1"]:
            raise ValueError("Insecure document URL requested")
        resp = requests.get(source_url, timeout=5, allow_redirects=False)
        return resp.text`,
    `@@ -6,3 +6,6 @@
-        prompt = f"System: Analyze user data.\\nContext: {user_input}\\nAnswer:"
-        return prompt
+        prompt = ChatPromptTemplate.from_messages([
+            ("system", "Analyze user data within isolated context boundary."),
+            ("human", "{user_input}")
+        ])
+        return prompt.format_messages(user_input=user_input)`
  );

  // 2. PR #204: Concurrency & Unbounded Goroutine Leak in SSE Streamer (Go)
  subStmt.run(
    'sub-204',
    'repo-payment-gateway',
    204,
    'perf(stream): High-throughput SSE telemetry worker with buffer pooling',
    'usr-priya',
    'Priya Nair',
    'priya.nair@acme-corp.internal',
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    'Infrastructure Engineer',
    'perf/sse-telemetry-pool',
    'main',
    '3a1d9e2',
    'changes_requested',
    'high',
    72,
    'Qwen2.5-Coder 7B',
    'Surfaced 1 high-severity concurrency vulnerability: CWE-400 Unbounded goroutine creation leading to memory exhaustion on client disconnect.',
    'Each streaming connection creates an event pump that does not monitor http.Request.Context().Done(). Client drops leave orphaned goroutines running indefinitely.',
    2,
    94,
    18,
    'https://github.com/acme-org/payment-gateway/pull/204',
    'changes_requested',
    now,
    'Sarah Jenkins',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'Ensure select statement includes case <-ctx.Done() to terminate worker thread when client aborts TCP connection.',
    1,
    9,
    now,
    now
  );

  issueStmt.run(
    'iss-05',
    'sub-204',
    'CWE-400: Unbounded Goroutine Leak under Client Disconnection',
    'high',
    'bug',
    'pkg/telemetry/streamer.go',
    82,
    91,
    'Event pump loop does not listen to request context cancellation, causing persistent worker leaks upon socket close.',
    'High traffic bursts with dropped connections will cause memory usage to grow monotonically, triggering container OOM kills in Kubernetes.',
    'Add context cancellation handler to the event dispatch channel select block.',
    'for event := range eventChan {\n    w.Write(event.Bytes())\n    flusher.Flush()\n}',
    'for {\n    select {\n    case <-r.Context().Done():\n        return\n    case event, ok := <-eventChan:\n        if !ok { return }\n        w.Write(event.Bytes())\n        flusher.Flush()\n    }\n}',
    'CWE-400: Uncontrolled Resource Consumption',
    'open'
  );

  db.prepare(`
    INSERT INTO code_files (id, submission_id, filename, language, content, suggested_content, patch)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    'cf-03',
    'sub-204',
    'pkg/telemetry/streamer.go',
    'go',
    `package telemetry

import "net/http"

func StreamEvents(w http.ResponseWriter, r *http.Request, eventChan <-chan []byte) {
    flusher, _ := w.(http.Flusher)
    // Orphaned goroutine loop: ignores client disconnect
    for event := range eventChan {
        w.Write(event)
        flusher.Flush()
    }
}`,
    `package telemetry

import "net/http"

func StreamEvents(w http.ResponseWriter, r *http.Request, eventChan <-chan []byte) {
    flusher, _ := w.(http.Flusher)
    ctx := r.Context()
    for {
        select {
        case <-ctx.Done():
            return
        case event, ok := <-eventChan:
            if !ok {
                return
            }
            w.Write(event)
            flusher.Flush()
        }
    }
}`,
    `@@ -7,4 +7,10 @@
-    for event := range eventChan {
-        w.Write(event)
-        flusher.Flush()
-    }
+    for {
+        select {
+        case <-r.Context().Done():
+            return
+        case event, ok := <-eventChan:
+            if !ok { return }
+            w.Write(event)
+            flusher.Flush()
+        }
+    }`
  );

  // 3. PR #218: Enterprise WebAuthn MFA - Clean Approved (TypeScript)
  subStmt.run(
    'sub-218',
    'repo-auth-service',
    218,
    'feat(security): Implement hardware MFA WebAuthn/FIDO2 challenge verification',
    'usr-alex',
    'Alex Rivera',
    'alex.rivera@acme-corp.internal',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    'Principal Security Architect',
    'feat/webauthn-mfa',
    'main',
    '6c2b4f9',
    'approved',
    'safe',
    8,
    'Qwen2.5-Coder 7B',
    'High-assurance cryptographic authentication module complying with FIDO2 Level 3 specifications. Zero vulnerabilities detected.',
    'Verified high-entropy challenge generation, anti-replay nonces, constant-time signature verification, and 100% test coverage.',
    5,
    312,
    24,
    'https://github.com/acme-org/auth-service/pull/218',
    'approved',
    now,
    'Sarah Jenkins',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'Comprehensive test suite and clean adherence to RFC 8812 and WebAuthn specifications. Approved for production merge.',
    2,
    16,
    now,
    now
  );

  db.prepare(`
    INSERT INTO code_files (id, submission_id, filename, language, content, suggested_content, patch)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    'cf-04',
    'sub-218',
    'src/services/webauthn.service.ts',
    'typescript',
    `import crypto from 'crypto';

export class WebAuthnService {
  verifyChallenge(storedChallenge: string, receivedChallenge: string): boolean {
    const a = Buffer.from(storedChallenge);
    const b = Buffer.from(receivedChallenge);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  }
}`,
    `import crypto from 'crypto';

export class WebAuthnService {
  verifyChallenge(storedChallenge: string, receivedChallenge: string): boolean {
    const a = Buffer.from(storedChallenge);
    const b = Buffer.from(receivedChallenge);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  }
}`,
    `@@ -1,8 +1,8 @@
+// Verified FIDO2 challenge verification with constant-time cryptographic check
+export class WebAuthnService { ... }`
  );

  // 4. PR #95: Horizontal Privilege Escalation IDOR Patch (Python)
  subStmt.run(
    'sub-95',
    'repo-user-api',
    95,
    'fix(tenant): Enforce organization scoping on workspace member queries',
    'usr-david',
    'David Zhao',
    'david.zhao@acme-corp.internal',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    'Staff Security Engineer',
    'fix/tenant-boundary-idor',
    'main',
    '1e9d4c7',
    'approved',
    'safe',
    24,
    'Qwen2.5-Coder 7B',
    'Remediates critical horizontal privilege escalation (IDOR) in workspace user management. Verified tenancy guard assertions.',
    'The pull request wraps workspace member retrieval in an organization tenancy boundary check, preventing cross-tenant data exfiltration.',
    2,
    42,
    14,
    'https://github.com/acme-org/user-api/pull/95',
    'approved',
    now,
    'Sarah Jenkins',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'Verified with multi-tenant integration test matrix. Excellent security hardening.',
    1,
    8,
    now,
    now
  );

  issueStmt.run(
    'iss-06',
    'sub-95',
    'CWE-639: Insecure Direct Object References in Workspace Membership Query',
    'medium',
    'security',
    'api/resolvers/workspace.py',
    31,
    37,
    'Resolver queries workspace members by raw ID parameter without verifying tenant relationship of caller.',
    'Authenticated users from Organization A can inspect membership rosters of Organization B by guessing or iterating workspace IDs.',
    'Add tenancy scoping filter `organization_id == caller.org_id` to database query.',
    'members = db.query(Member).filter(Member.workspace_id == workspace_id).all()',
    'members = db.query(Member).filter(\n    Member.workspace_id == workspace_id,\n    Member.organization_id == caller.current_org_id\n).all()',
    'CWE-639: Authorization Bypass Through User-Controlled Key',
    'resolved'
  );

  db.prepare(`
    INSERT INTO code_files (id, submission_id, filename, language, content, suggested_content, patch)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    'cf-05',
    'sub-95',
    'api/resolvers/workspace.py',
    'python',
    `def get_workspace_members(workspace_id: str, caller: UserContext):
    # Missing tenant isolation filter
    return db.query(Member).filter(Member.workspace_id == workspace_id).all()`,
    `def get_workspace_members(workspace_id: str, caller: UserContext):
    # Enforce tenant isolation boundary
    return db.query(Member).filter(
        Member.workspace_id == workspace_id,
        Member.organization_id == caller.current_org_id
    ).all()`,
    `@@ -2,2 +2,4 @@
-    return db.query(Member).filter(Member.workspace_id == workspace_id).all()
+    return db.query(Member).filter(
+        Member.workspace_id == workspace_id,
+        Member.organization_id == caller.current_org_id
+    ).all()`
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
