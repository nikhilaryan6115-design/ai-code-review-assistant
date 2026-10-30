import { Submission, Developer, Repository, NotificationItem, AISettings } from '../types';

export const initialSubmissions: Submission[] = [
  {
    id: 'sub-142',
    prNumber: 142,
    title: 'Implement JWT authentication & refresh token flow',
    developer: {
      id: 'dev-1',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@acme-corp.internal',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      role: 'Backend Engineer'
    },
    repository: {
      id: 'repo-1',
      name: 'authentication-service',
      branch: 'feature/auth-jwt-refresh',
      targetBranch: 'main',
      url: 'https://github.com/acme-org/authentication-service'
    },
    submissionDate: '2026-10-30T16:24:00Z',
    language: 'Python',
    status: 'ai_completed',
    riskLevel: 'high',
    riskScore: 84,
    aiModel: 'Qwen2.5-Coder 7B-Instruct',
    aiSummary: 'The submitted code implements a user authentication feature. However, it contains a potential SQL injection vulnerability and insufficient input validation. Changes are recommended before approval.',
    aiExplanation: 'This pull request introduces the endpoints and business logic for handling user logins, generating signed JSON Web Tokens (JWTs), and issuing renewal refresh tokens. While the cryptographic hashing for token signatures conforms to modern standards, direct SQL query concatenation was detected in the credential lookup handler, exposing the application to authentication bypass via SQL injection. Additionally, request payload validation lacks constraints on string length and format before hitting the database.',
    filesChangedCount: 3,
    additions: 148,
    deletions: 24,
    reviewTimeSeconds: 14,
    issues: [
      {
        id: 'iss-1',
        title: 'SQL Injection Vulnerability in User Lookup',
        severity: 'critical',
        category: 'security',
        file: 'auth/controller.py',
        lineStart: 42,
        lineEnd: 46,
        cwe: 'CWE-89: SQL Injection',
        explanation: 'The query string is dynamically composed using direct f-string string interpolation with untrusted user input `username` without parameter binding or sanitization.',
        whyItIsAProblem: 'An attacker can supply malicious SQL payloads such as `\' OR \'1\'=\'1` to bypass password authentication entirely, access arbitrary user accounts with administrative privileges, or drop/dump database tables.',
        suggestedSolution: 'Replace string formatting with parameterized SQL statements via your ORM / database cursor execution layer.',
        originalSnippet: `    # Query user by username directly from incoming JSON payload
    query = f"SELECT id, password_hash, role FROM users WHERE username = '{username}' AND active = 1"
    cursor.execute(query)
    user = cursor.fetchone()`,
        suggestedFixSnippet: `    # Use parameterized query to prevent SQL injection
    query = "SELECT id, password_hash, role FROM users WHERE username = %s AND active = 1"
    cursor.execute(query, (username,))
    user = cursor.fetchone()`,
        status: 'open'
      },
      {
        id: 'iss-2',
        title: 'Missing Input Validation for Credentials Payload',
        severity: 'medium',
        category: 'quality',
        file: 'auth/controller.py',
        lineStart: 18,
        lineEnd: 24,
        cwe: 'CWE-20: Improper Input Validation',
        explanation: 'The `login_handler` accesses `username` and `password` without verifying whether the strings are empty, exceed maximum allowed lengths, or match expected schema types.',
        whyItIsAProblem: 'Payloads with excessively long strings can lead to denial of service through regex evaluation or memory bloat, and empty inputs cause unhandled KeyError or unexpected database errors.',
        suggestedSolution: 'Use Pydantic schema validation or explicit bounds checks to ensure `username` is 3-64 alphanumeric characters and `password` is non-empty before processing.',
        originalSnippet: `    data = request.get_json() or {}
    username = data.get("username")
    password = data.get("password")`,
        suggestedFixSnippet: `    data = request.get_json() or {}
    username = data.get("username", "").strip()
    password = data.get("password", "")
    
    if not username or len(username) > 64 or not password:
        return jsonify({"error": "Invalid username or password format"}), 400`,
        status: 'open'
      },
      {
        id: 'iss-3',
        title: 'Inefficient Database Query (N+1 Query Pattern)',
        severity: 'low',
        category: 'performance',
        file: 'auth/controller.py',
        lineStart: 67,
        lineEnd: 74,
        cwe: 'CWE-400: Uncontrolled Resource Consumption',
        explanation: 'User roles and permissions are queried in an iterative loop for each granted scope rather than retrieving all associated permissions in a single batched query with a SQL `IN` or `JOIN` statement.',
        whyItIsAProblem: 'Each authentication request triggers multiple sequential database round-trips. Under peak authentication load, this increases latency from 15ms to over 250ms and exhausts database connection pools.',
        suggestedSolution: 'Consolidate the individual queries into a single batch query using `WHERE scope_id IN (...)` or pre-join user permissions.',
        originalSnippet: `    permissions = []
    for scope_id in user_scope_ids:
        cursor.execute(f"SELECT code FROM permissions WHERE id = {scope_id}")
        perm = cursor.fetchone()
        if perm:
            permissions.append(perm['code'])`,
        suggestedFixSnippet: `    if not user_scope_ids:
        return []
    placeholders = ', '.join(['%s'] * len(user_scope_ids))
    cursor.execute(f"SELECT code FROM permissions WHERE id IN ({placeholders})", tuple(user_scope_ids))
    permissions = [row['code'] for row in cursor.fetchall()]`,
        status: 'open'
      }
    ],
    codeFiles: [
      {
        filename: 'auth/controller.py',
        language: 'python',
        problematicLines: [
          { line: 18, severity: 'medium', issueId: 'iss-2', message: 'Missing input validation for credentials' },
          { line: 19, severity: 'medium', issueId: 'iss-2', message: 'Missing input validation for credentials' },
          { line: 42, severity: 'critical', issueId: 'iss-1', message: 'SQL Injection: f-string formatting in SQL query' },
          { line: 43, severity: 'critical', issueId: 'iss-1', message: 'Vulnerable cursor execution' },
          { line: 67, severity: 'low', issueId: 'iss-3', message: 'N+1 Query loop: Sequential round-trips' }
        ],
        content: `import hmac
import hashlib
import jwt
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify
from db import get_db_cursor

auth_bp = Blueprint('auth', __name__)
JWT_SECRET = "production_env_jwt_secret_key_2026"
ACCESS_TOKEN_LIFETIME = 15 # minutes

@auth_bp.route('/api/v1/auth/login', methods=['POST'])
def login():
    """Authenticate user credentials and issue access token."""
    data = request.get_json() or {}
    username = data.get("username")
    password = data.get("password")

    cursor = get_db_cursor()

    # Query user by username directly from incoming JSON payload
    query = f"SELECT id, password_hash, role FROM users WHERE username = '{username}' AND active = 1"
    cursor.execute(query)
    user = cursor.fetchone()

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    # Verify password hash
    if not hmac.compare_digest(hash_password(password), user['password_hash']):
        return jsonify({"error": "Invalid credentials"}), 401

    # Generate JWT payload
    payload = {
        'sub': user['id'],
        'role': user['role'],
        'exp': datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_LIFETIME)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm='HS256')

    # Fetch user permission scopes
    user_scope_ids = user.get('scope_ids', [1, 2, 5])
    permissions = []
    for scope_id in user_scope_ids:
        cursor.execute(f"SELECT code FROM permissions WHERE id = {scope_id}")
        perm = cursor.fetchone()
        if perm:
            permissions.append(perm['code'])

    return jsonify({
        "access_token": token,
        "token_type": "Bearer",
        "expires_in": ACCESS_TOKEN_LIFETIME * 60,
        "permissions": permissions
    }), 200`
      },
      {
        filename: 'auth/models.py',
        language: 'python',
        problematicLines: [],
        content: `from dataclasses import dataclass
from typing import List, Optional
from datetime import datetime

@dataclass
class User:
    id: int
    username: str
    password_hash: str
    role: str
    active: bool
    created_at: datetime
    scope_ids: List[int]

@dataclass
class TokenPayload:
    sub: int
    role: str
    exp: int
    permissions: List[str]`
      },
      {
        filename: 'tests/test_auth.py',
        language: 'python',
        problematicLines: [],
        content: `import pytest
from auth.controller import login

def test_login_success(client, seed_user):
    response = client.post('/api/v1/auth/login', json={
        'username': 'john_doe',
        'password': 'SecurePassword123!'
    })
    assert response.status_code == 200
    assert 'access_token' in response.json`
      }
    ]
  },
  {
    id: 'sub-145',
    prNumber: 145,
    title: 'Migrate Stripe Webhook Handler to Async Channel Pipeline',
    developer: {
      id: 'dev-2',
      name: 'Priya Patel',
      email: 'priya.patel@acme-corp.internal',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      role: 'Staff Infrastructure Engineer'
    },
    repository: {
      id: 'repo-2',
      name: 'payment-gateway',
      branch: 'perf/stripe-async-pipeline',
      targetBranch: 'main',
      url: 'https://github.com/acme-org/payment-gateway'
    },
    submissionDate: '2026-10-30T14:10:00Z',
    language: 'Go',
    status: 'changes_requested',
    riskLevel: 'critical',
    riskScore: 92,
    aiModel: 'Qwen2.5-Coder 7B-Instruct',
    aiSummary: 'Critical security risk identified: Webhook secret token is hardcoded in handler middleware. Additionally, unbuffered Go channels without context cancellation pose a goroutine deadlock hazard.',
    aiExplanation: 'The PR intends to speed up webhook throughput using worker goroutines. However, sensitive merchant signing secrets were committed directly in the source file, and the event dispatcher can block indefinitely if downstream consumer channels saturate.',
    filesChangedCount: 4,
    additions: 210,
    deletions: 45,
    reviewTimeSeconds: 18,
    issues: [
      {
        id: 'iss-145-1',
        title: 'Hardcoded Webhook Secret Token in Source Code',
        severity: 'critical',
        category: 'security',
        file: 'webhook/verifier.go',
        lineStart: 14,
        lineEnd: 15,
        cwe: 'CWE-798: Use of Hard-coded Credentials',
        explanation: 'The signing secret `whsec_live_983f4b01a88b4923e` is embedded as a string constant rather than read from an encrypted vault or environment variable.',
        whyItIsAProblem: 'Anyone with repository read access or access to compiled binaries can extract this secret and spoof arbitrary Stripe payment capture webhooks.',
        suggestedSolution: 'Load `STRIPE_WEBHOOK_SECRET` via `os.Getenv` or AWS Secrets Manager with validation on server boot.',
        originalSnippet: `const webhookSecret = "whsec_live_983f4b01a88b4923e"`,
        suggestedFixSnippet: `var webhookSecret = os.Getenv("STRIPE_WEBHOOK_SECRET")
if webhookSecret == "" {
    log.Fatal("STRIPE_WEBHOOK_SECRET must be configured")
}`,
        status: 'open'
      },
      {
        id: 'iss-145-2',
        title: 'Goroutine Leak on Unbuffered Event Channel',
        severity: 'high',
        category: 'performance',
        file: 'webhook/dispatcher.go',
        lineStart: 38,
        lineEnd: 44,
        cwe: 'CWE-772: Missing Release of Resource after Effective Lifetime',
        explanation: 'Worker routines send to channel without timeout or context cancellation select statement.',
        whyItIsAProblem: 'When traffic spikes, unbuffered channels block sender goroutines, leading to unbounded memory leak and panic.',
        suggestedSolution: 'Implement buffered channels with `select` case against `ctx.Done()`.',
        originalSnippet: `func (d *Dispatcher) Enqueue(event Event) {
    d.eventsChan <- event // Blocks indefinitely if channel full
}`,
        suggestedFixSnippet: `func (d *Dispatcher) Enqueue(ctx context.Context, event Event) error {
    select {
    case d.eventsChan <- event:
        return nil
    case <-ctx.Done():
        return ctx.Err()
    default:
        return ErrQueueOverflow
    }
}`,
        status: 'open'
      }
    ],
    codeFiles: [
      {
        filename: 'webhook/verifier.go',
        language: 'go',
        problematicLines: [
          { line: 14, severity: 'critical', issueId: 'iss-145-1', message: 'Hardcoded secret token detected' }
        ],
        content: `package webhook

import (
    "crypto/hmac"
    "crypto/sha256"
    "encoding/hex"
    "errors"
    "net/http"
)

// Hardcoded webhook secret - critical security vulnerability
const webhookSecret = "whsec_live_983f4b01a88b4923e"

func VerifyHeader(req *http.Request, payload []byte) bool {
    signature := req.Header.Get("Stripe-Signature")
    if signature == "" {
        return false
    }
    mac := hmac.New(sha256.New, []byte(webhookSecret))
    mac.Write(payload)
    expected := hex.EncodeToString(mac.Sum(nil))
    return hmac.Equal([]byte(signature), []byte(expected))
}`
      }
    ],
    managerDecision: {
      decision: 'changes_requested',
      decidedAt: '2026-10-30T15:30:00Z',
      managerName: 'Sarah Jenkins (Engineering Director)',
      feedback: 'Priya, please rotate this webhook secret immediately and pull from HashiCorp Vault. Also check the channel buffering fix provided by Qwen2.5-Coder.',
      commentsCount: 2
    }
  },
  {
    id: 'sub-138',
    prNumber: 138,
    title: 'Add virtualized transactions table with CSV export',
    developer: {
      id: 'dev-3',
      name: 'Alex Chen',
      email: 'alex.chen@acme-corp.internal',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      role: 'Senior Frontend Engineer'
    },
    repository: {
      id: 'repo-3',
      name: 'frontend-dashboard',
      branch: 'feature/virtualized-tx-table',
      targetBranch: 'main',
      url: 'https://github.com/acme-org/frontend-dashboard'
    },
    submissionDate: '2026-10-29T11:15:00Z',
    language: 'TypeScript',
    status: 'approved',
    riskLevel: 'low',
    riskScore: 22,
    aiModel: 'Qwen2.5-Coder 7B-Instruct',
    aiSummary: 'Clean, well-architected frontend implementation. Minor optimization suggestion: memoize multi-column filtering to prevent frame drops on 10k+ rows.',
    aiExplanation: 'The PR implements virtualized windowing using TanStack Virtual. Code hygiene is very high with comprehensive test coverage. A minor performance check highlighted an unmemoized filter calculation inside the render loop.',
    filesChangedCount: 5,
    additions: 340,
    deletions: 112,
    reviewTimeSeconds: 11,
    issues: [
      {
        id: 'iss-138-1',
        title: 'Unmemoized Expensive Filter Calculation in Render Loop',
        severity: 'low',
        category: 'performance',
        file: 'src/components/TransactionsTable.tsx',
        lineStart: 54,
        lineEnd: 58,
        explanation: '`filteredTransactions` re-runs `array.filter().sort()` on every state change instead of using `useMemo`.',
        whyItIsAProblem: 'When user types in the search input or toggles filters, this recalculation causes micro-stutters (>16ms per frame) on large transaction datasets.',
        suggestedSolution: 'Wrap calculation in `useMemo` with dependencies `[transactions, query, statusFilter]`.',
        originalSnippet: `const filteredTransactions = transactions
  .filter(t => t.description.toLowerCase().includes(query.toLowerCase()))
  .sort((a, b) => b.timestamp - a.timestamp);`,
        suggestedFixSnippet: `const filteredTransactions = useMemo(() => {
  return transactions
    .filter(t => t.description.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => b.timestamp - a.timestamp);
}, [transactions, query]);`,
        status: 'addressed'
      }
    ],
    codeFiles: [
      {
        filename: 'src/components/TransactionsTable.tsx',
        language: 'typescript',
        problematicLines: [
          { line: 54, severity: 'low', issueId: 'iss-138-1', message: 'Wrap array filtering in useMemo' }
        ],
        content: `import React, { useState, useMemo } from 'react';
import { Transaction } from '../types';

interface Props {
  transactions: Transaction[];
}

export const TransactionsTable: React.FC<Props> = ({ transactions }) => {
  const [query, setQuery] = useState('');

  // Unmemoized array filtering on every render
  const filteredTransactions = transactions
    .filter(t => t.description.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="table-container">
      <input 
        value={query} 
        onChange={e => setQuery(e.target.value)} 
        placeholder="Search transactions..." 
      />
      <div>Total: {filteredTransactions.length}</div>
    </div>
  );
};`
      }
    ],
    managerDecision: {
      decision: 'approved',
      decidedAt: '2026-10-29T14:40:00Z',
      managerName: 'Sarah Jenkins (Engineering Director)',
      feedback: 'Great work Alex! Tested locally with 15,000 mock rows and scrolling was butter smooth. Approved.',
      commentsCount: 1
    }
  },
  {
    id: 'sub-150',
    prNumber: 150,
    title: 'ETL Pipeline batching and S3 parquet exporter',
    developer: {
      id: 'dev-4',
      name: 'Marcus Vance',
      email: 'marcus.vance@acme-corp.internal',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      role: 'Data Engineer'
    },
    repository: {
      id: 'repo-4',
      name: 'data-pipeline',
      branch: 'etl/s3-batch-parquet',
      targetBranch: 'main',
      url: 'https://github.com/acme-org/data-pipeline'
    },
    submissionDate: '2026-10-28T09:20:00Z',
    language: 'Python',
    status: 'ai_completed',
    riskLevel: 'medium',
    riskScore: 61,
    aiModel: 'Qwen2.5-Coder 7B-Instruct',
    aiSummary: 'File descriptor leak detected during parquet file compression in exception handler. Retry policy lacks exponential backoff.',
    aiExplanation: 'The ETL pipeline worker opens temporary file handles on local disks without guaranteeing cleanup in `finally` blocks when S3 upload fails.',
    filesChangedCount: 3,
    additions: 98,
    deletions: 14,
    reviewTimeSeconds: 15,
    issues: [
      {
        id: 'iss-150-1',
        title: 'Unclosed Local File Descriptor on S3 Upload Exception',
        severity: 'medium',
        category: 'performance',
        file: 'pipeline/exporter.py',
        lineStart: 32,
        lineEnd: 38,
        cwe: 'CWE-775: Missing Release of File Descriptor',
        explanation: '`open(temp_path, "wb")` is used without `with` context manager. If an exception triggers during upload, file descriptor remains open.',
        whyItIsAProblem: 'In continuous ETL streaming, this exhausts the OS file descriptor limit (`EMFILE: Too many open files`) and crashes container pods.',
        suggestedSolution: 'Refactor using `with open(...) as f:` to guarantee closure upon block exit.',
        originalSnippet: `f = open(temp_path, "wb")
df.to_parquet(f)
s3_client.upload_fileobj(f, bucket, s3_key)
f.close()`,
        suggestedFixSnippet: `with open(temp_path, "wb") as f:
    df.to_parquet(f)
    f.seek(0)
    s3_client.upload_fileobj(f, bucket, s3_key)`,
        status: 'open'
      }
    ],
    codeFiles: [
      {
        filename: 'pipeline/exporter.py',
        language: 'python',
        problematicLines: [
          { line: 32, severity: 'medium', issueId: 'iss-150-1', message: 'Use context manager for file handling' }
        ],
        content: `import os
import boto3
import pandas as pd

s3_client = boto3.client('s3')

def export_batch_to_s3(df: pd.DataFrame, bucket: str, s3_key: str):
    temp_path = f"/tmp/{s3_key.replace('/', '_')}"
    
    # Missing context manager leads to file handle leak
    f = open(temp_path, "wb")
    df.to_parquet(f)
    s3_client.upload_fileobj(f, bucket, s3_key)
    f.close()
    
    if os.path.exists(temp_path):
        os.remove(temp_path)`
      }
    ]
  },
  {
    id: 'sub-148',
    prNumber: 148,
    title: 'Zero-copy ring buffer for node telemetry telemetry-daemon',
    developer: {
      id: 'dev-5',
      name: 'Elena Rostova',
      email: 'elena.rostova@acme-corp.internal',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
      role: 'Systems Engineer'
    },
    repository: {
      id: 'repo-5',
      name: 'cloud-infra-orchestrator',
      branch: 'sys/zero-copy-ring',
      targetBranch: 'main',
      url: 'https://github.com/acme-org/cloud-infra-orchestrator'
    },
    submissionDate: '2026-10-27T18:05:00Z',
    language: 'Rust',
    status: 'approved',
    riskLevel: 'safe',
    riskScore: 8,
    aiModel: 'Qwen2.5-Coder 7B-Instruct',
    aiSummary: 'Exemplary memory-safe Rust code. Zero unsafe blocks, robust bounds checks, and benchmarked 4.8x throughput improvement.',
    aiExplanation: 'The PR replaces mutex-guarded queues with a lock-free circular ring buffer. Qwen2.5-Coder verified all concurrency invariants, memory bounds, and atomic orderings.',
    filesChangedCount: 2,
    additions: 176,
    deletions: 89,
    reviewTimeSeconds: 12,
    issues: [],
    codeFiles: [
      {
        filename: 'src/telemetry/ring.rs',
        language: 'rust',
        problematicLines: [],
        content: `use std::sync::atomic::{AtomicUsize, Ordering};

pub struct RingBuffer<T> {
    buffer: Box<[Option<T>]>,
    capacity: usize,
    head: AtomicUsize,
    tail: AtomicUsize,
}

impl<T> RingBuffer<T> {
    pub fn new(capacity: usize) -> Self {
        assert!(capacity.is_power_of_two(), "Capacity must be power of two");
        let mut buf = Vec::with_capacity(capacity);
        for _ in 0..capacity {
            buf.push(None);
        }
        Self {
            buffer: buf.into_boxed_slice(),
            capacity,
            head: AtomicUsize::new(0),
            tail: AtomicUsize::new(0),
        }
    }
}`
      }
    ],
    managerDecision: {
      decision: 'approved',
      decidedAt: '2026-10-28T10:12:00Z',
      managerName: 'Sarah Jenkins (Engineering Director)',
      feedback: 'Outstanding implementation Elena. Benchmark tests passed on production staging node.',
      commentsCount: 1
    }
  },
  {
    id: 'sub-152',
    prNumber: 152,
    title: 'Add Redis Pub/Sub backend for real-time notification delivery',
    developer: {
      id: 'dev-1',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@acme-corp.internal',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      role: 'Backend Engineer'
    },
    repository: {
      id: 'repo-1',
      name: 'authentication-service',
      branch: 'feature/redis-pubsub-notifications',
      targetBranch: 'main',
      url: 'https://github.com/acme-org/authentication-service'
    },
    submissionDate: '2026-10-30T18:15:00Z',
    language: 'Python',
    status: 'ai_reviewing',
    riskLevel: 'medium',
    riskScore: 50,
    aiModel: 'Qwen2.5-Coder 7B-Instruct',
    aiSummary: 'AI analysis in progress: scanning AST syntax trees, security heuristics, and database connection pooling...',
    aiExplanation: 'The submission is currently undergoing parallel deep inspection by Qwen2.5-Coder 7B.',
    filesChangedCount: 2,
    additions: 84,
    deletions: 12,
    reviewTimeSeconds: 6,
    issues: [],
    codeFiles: [
      {
        filename: 'notifications/subscriber.py',
        language: 'python',
        problematicLines: [],
        content: `import redis
import json

r = redis.Redis(host='localhost', port=6379, db=0)

def listen_channel(channel_name: str):
    pubsub = r.pubsub()
    pubsub.subscribe(channel_name)
    for message in pubsub.listen():
        if message['type'] == 'message':
            print("Received:", message['data'])`
      }
    ]
  }
];

export const mockDevelopers: Developer[] = [
  {
    id: 'dev-1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@acme-corp.internal',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    role: 'Backend Engineer',
    assignedRepositories: ['authentication-service', 'notifications-worker'],
    totalSubmissions: 34,
    pendingReviews: 2,
    completedReviews: 32,
    approvalRate: 78.5,
    criticalIssuesPrevented: 14,
    joinDate: '2024-03-15'
  },
  {
    id: 'dev-2',
    name: 'Priya Patel',
    email: 'priya.patel@acme-corp.internal',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    role: 'Staff Infrastructure Engineer',
    assignedRepositories: ['payment-gateway', 'cloud-infra-orchestrator'],
    totalSubmissions: 48,
    pendingReviews: 1,
    completedReviews: 47,
    approvalRate: 91.2,
    criticalIssuesPrevented: 26,
    joinDate: '2023-08-01'
  },
  {
    id: 'dev-3',
    name: 'Alex Chen',
    email: 'alex.chen@acme-corp.internal',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    role: 'Senior Frontend Engineer',
    assignedRepositories: ['frontend-dashboard', 'ui-design-system'],
    totalSubmissions: 52,
    pendingReviews: 0,
    completedReviews: 52,
    approvalRate: 96.0,
    criticalIssuesPrevented: 8,
    joinDate: '2023-11-20'
  },
  {
    id: 'dev-4',
    name: 'Marcus Vance',
    email: 'marcus.vance@acme-corp.internal',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    role: 'Data Engineer',
    assignedRepositories: ['data-pipeline', 'ml-model-server'],
    totalSubmissions: 29,
    pendingReviews: 1,
    completedReviews: 28,
    approvalRate: 82.4,
    criticalIssuesPrevented: 11,
    joinDate: '2024-06-10'
  },
  {
    id: 'dev-5',
    name: 'Elena Rostova',
    email: 'elena.rostova@acme-corp.internal',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    role: 'Systems Engineer',
    assignedRepositories: ['cloud-infra-orchestrator', 'network-mesh'],
    totalSubmissions: 41,
    pendingReviews: 0,
    completedReviews: 41,
    approvalRate: 97.5,
    criticalIssuesPrevented: 19,
    joinDate: '2023-04-05'
  }
];

export const mockRepositories: Repository[] = [
  {
    id: 'repo-1',
    name: 'authentication-service',
    fullName: 'acme-org/authentication-service',
    description: 'High-throughput OAuth2 and OIDC authentication microservice',
    language: 'Python',
    stars: 124,
    forks: 38,
    defaultBranch: 'main',
    connectedAt: '2024-01-15',
    autoReviewEnabled: true,
    webhookStatus: 'active',
    activePrsCount: 3,
    totalReviewsCount: 142,
    riskProfile: 'high'
  },
  {
    id: 'repo-2',
    name: 'payment-gateway',
    fullName: 'acme-org/payment-gateway',
    description: 'PCI-DSS compliant payment processing, Stripe webhooks and ledger engine',
    language: 'Go',
    stars: 289,
    forks: 64,
    defaultBranch: 'main',
    connectedAt: '2023-11-01',
    autoReviewEnabled: true,
    webhookStatus: 'active',
    activePrsCount: 2,
    totalReviewsCount: 218,
    riskProfile: 'high'
  },
  {
    id: 'repo-3',
    name: 'frontend-dashboard',
    fullName: 'acme-org/frontend-dashboard',
    description: 'React, Vite, TypeScript customer and internal operations console',
    language: 'TypeScript',
    stars: 340,
    forks: 72,
    defaultBranch: 'main',
    connectedAt: '2023-10-12',
    autoReviewEnabled: true,
    webhookStatus: 'active',
    activePrsCount: 1,
    totalReviewsCount: 380,
    riskProfile: 'low'
  },
  {
    id: 'repo-4',
    name: 'data-pipeline',
    fullName: 'acme-org/data-pipeline',
    description: 'Distributed streaming ETL jobs with Apache Spark and Parquet storage',
    language: 'Python',
    stars: 94,
    forks: 21,
    defaultBranch: 'main',
    connectedAt: '2024-04-18',
    autoReviewEnabled: true,
    webhookStatus: 'warning',
    activePrsCount: 1,
    totalReviewsCount: 88,
    riskProfile: 'medium'
  },
  {
    id: 'repo-5',
    name: 'cloud-infra-orchestrator',
    fullName: 'acme-org/cloud-infra-orchestrator',
    description: 'Bare-metal telemetry agent and edge Kubernetes mesh coordinator in Rust',
    language: 'Rust',
    stars: 412,
    forks: 85,
    defaultBranch: 'main',
    connectedAt: '2023-09-01',
    autoReviewEnabled: true,
    webhookStatus: 'active',
    activePrsCount: 0,
    totalReviewsCount: 165,
    riskProfile: 'low'
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Critical Vulnerability Detected',
    message: 'SQL Injection detected in PR #142 (auth/controller.py) submitted by Rahul Sharma',
    type: 'critical',
    timestamp: '10 minutes ago',
    read: false,
    submissionId: 'sub-142',
    prNumber: 142
  },
  {
    id: 'notif-2',
    title: 'Manager Review Feedback',
    message: 'Sarah Jenkins requested changes on PR #145 (payment-gateway): "Rotate secret token"',
    type: 'warning',
    timestamp: '45 minutes ago',
    read: false,
    submissionId: 'sub-145',
    prNumber: 145
  },
  {
    id: 'notif-3',
    title: 'AI Code Review Completed',
    message: 'Qwen2.5-Coder 7B completed scanning PR #138. Risk level: Low (0 critical issues).',
    type: 'approval',
    timestamp: '2 hours ago',
    read: true,
    submissionId: 'sub-138',
    prNumber: 138
  },
  {
    id: 'notif-4',
    title: 'Repository Webhook Warning',
    message: 'Webhook response latency in data-pipeline reached 4200ms. Check endpoint health.',
    type: 'system',
    timestamp: '5 hours ago',
    read: true
  }
];

export const activityChartData = [
  { day: 'Mon', submissions: 14, aiScans: 14, criticalIssues: 4, approved: 10 },
  { day: 'Tue', submissions: 22, aiScans: 22, criticalIssues: 6, approved: 18 },
  { day: 'Wed', submissions: 19, aiScans: 19, criticalIssues: 2, approved: 16 },
  { day: 'Thu', submissions: 28, aiScans: 28, criticalIssues: 7, approved: 23 },
  { day: 'Fri', submissions: 32, aiScans: 32, criticalIssues: 8, approved: 26 },
  { day: 'Sat', submissions: 9, aiScans: 9, criticalIssues: 1, approved: 8 },
  { day: 'Sun', submissions: 12, aiScans: 12, criticalIssues: 2, approved: 11 },
];

export const severityBreakdownData = [
  { name: 'Critical', count: 18, color: '#EF4444' },
  { name: 'High', count: 27, color: '#F97316' },
  { name: 'Medium', count: 46, color: '#F59E0B' },
  { name: 'Low', count: 82, color: '#3B82F6' },
];

export const defaultAISettings: AISettings = {
  modelName: 'Qwen2.5-Coder',
  modelIdentifier: 'Qwen/Qwen2.5-Coder-7B-Instruct',
  temperature: 0.2,
  maxTokens: 4096,
  topP: 0.95,
  confidenceThreshold: 85,
  enableSecurityScanning: true,
  enablePerformanceAudit: true,
  enableStyleQualityChecks: true,
  autoReviewDraftPRs: false,
  blockMergeOnCritical: true,
  systemPrompt: `You are Qwen2.5-Coder 7B, an expert static analysis and code review model specialized in detecting security vulnerabilities (CWE, OWASP Top 10), performance regressions, architectural flaws, and maintainability issues. Analyze the provided git patch carefully. Provide actionable explanations and unified diff solutions for every flagged line.`
};
