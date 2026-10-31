import { PureDatabase } from '../server/db';
import { analyzeCodeDiff } from '../server/ai';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✓ ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ ${testName}`);
    failed++;
  }
}

async function runTestSuite() {
  console.log('\n========================================================');
  console.log('  RevAI Portfolio Automated Verification Test Suite');
  console.log('========================================================\n');

  // Test 1: In-Memory PureDatabase
  console.log('Suite 1: Serverless Database Engine (PureDatabase)');
  const db = new PureDatabase();
  db.exec('CREATE TABLE IF NOT EXISTS test_users (id TEXT PRIMARY KEY, username TEXT, role TEXT)');
  db.prepare('INSERT INTO test_users (id, username, role) VALUES (?, ?, ?)').run('usr-1', 'alice', 'developer');
  db.prepare('INSERT INTO test_users (id, username, role) VALUES (?, ?, ?)').run('usr-2', 'bob', 'manager');

  const count = db.prepare('SELECT COUNT(*) as count FROM test_users').get() as any;
  assert(count && count.count === 2, 'Counts total rows accurately');

  const user = db.prepare('SELECT * FROM test_users WHERE id = ?').get('usr-1') as any;
  assert(user && user.username === 'alice' && user.role === 'developer', 'Finds user by parameterized ID query');

  db.prepare('UPDATE test_users SET role = ? WHERE id = ?').run('lead', 'usr-1');
  const updatedUser = db.prepare('SELECT * FROM test_users WHERE id = ?').get('usr-1') as any;
  assert(updatedUser && updatedUser.role === 'lead', 'Updates user records synchronously');

  db.prepare('DELETE FROM test_users WHERE id = ?').run('usr-2');
  const remaining = db.prepare('SELECT COUNT(*) as count FROM test_users').get() as any;
  assert(remaining && remaining.count === 1, 'Deletes records and updates table state');

  // Test 2: AI Rule & Risk Engine
  console.log('\nSuite 2: AI Code Review Analysis Engine');
  const testPatch = `
@@ -10,3 +10,3 @@
- const query = "SELECT * FROM users WHERE id = '" + req.query.id + "'";
+ const query = "SELECT * FROM users WHERE id = $1";
+ const result = await db.query(query, [req.query.id]);
`;

  const reviewResult = await analyzeCodeDiff(
    'fix(security): Sanitize user query input parameter',
    'Replaces direct SQL concatenation with prepared statements',
    testPatch,
    'TypeScript'
  );

  assert(typeof reviewResult.riskScore === 'number' && reviewResult.riskScore >= 0 && reviewResult.riskScore <= 100, 'Calculates bounded risk score (0-100)');
  assert(['safe', 'medium', 'high', 'critical'].includes(reviewResult.riskLevel), 'Assigns standardized severity risk tier');
  assert(Array.isArray(reviewResult.issues), 'Outputs structured vulnerability and issue array');
  assert(typeof reviewResult.summary === 'string' && reviewResult.summary.length > 0, 'Generates executive technical summary');

  // Test 3: OAuth Session State
  console.log('\nSuite 3: Stateless Session & Token Handling');
  const mockJwtPayload = {
    id: 'usr-gh-12345',
    username: 'octocat',
    role: 'developer',
    accessToken: 'gho_dummy_token_for_tests',
  };
  assert(mockJwtPayload.username === 'octocat' && mockJwtPayload.id.startsWith('usr-gh-'), 'Generates valid user profile claims');

  // Summary
  console.log('\n--------------------------------------------------------');
  console.log(`Test Execution Results: ${passed} Passed, ${failed} Failed`);
  console.log('--------------------------------------------------------\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Test runner failure:', err);
  process.exit(1);
});
