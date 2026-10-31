import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { exchangeCodeForToken, getGitHubUser } from '../github';

export const authRouter = Router();

const JWT_SECRET = process.env.SESSION_SECRET || 'revai_dev_secret_key_change_in_production_32';

/**
 * Start GitHub OAuth authorization
 */
authRouter.get('/github', (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  if (!clientId) {
    return res.redirect(`${clientUrl}/login?error=github_client_id_missing`);
  }

  const redirectUri = `${clientUrl}/api/auth/github/callback`;
  const scope = 'read:user,user:email,repo';
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scope)}`;

  res.redirect(githubAuthUrl);
});

/**
 * Handle GitHub OAuth code callback
 */
authRouter.get('/github/callback', async (req, res) => {
  const code = req.query.code as string;
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  if (!code) {
    return res.redirect(`${clientUrl}/login?error=no_code_provided`);
  }

  try {
    const accessToken = await exchangeCodeForToken(code);
    const profile = await getGitHubUser(accessToken);

    const now = new Date().toISOString();
    const userId = `usr-gh-${profile.id}`;

    // Check if user already exists
    const existing = db.prepare('SELECT * FROM users WHERE github_id = ?').get(String(profile.id)) as any;

    if (existing) {
      db.prepare(`
        UPDATE users 
        SET username = ?, email = ?, avatar_url = ?, access_token = ?, last_login_at = ?
        WHERE id = ?
      `).run(
        profile.login,
        profile.email || existing.email,
        profile.avatar_url,
        accessToken,
        now,
        existing.id
      );
    } else {
      db.prepare(`
        INSERT INTO users (id, github_id, username, email, avatar_url, access_token, role, created_at, last_login_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        userId,
        String(profile.id),
        profile.login,
        profile.email || `${profile.login}@users.noreply.github.com`,
        profile.avatar_url,
        accessToken,
        'developer', // Default role
        now,
        now
      );
    }

    const currentRecord = db.prepare('SELECT * FROM users WHERE github_id = ?').get(String(profile.id)) as any;

    // Issue JWT session
    const token = jwt.sign(
      {
        id: currentRecord.id,
        username: currentRecord.username,
        role: currentRecord.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('revai_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`${clientUrl}/?auth_success=true`);
  } catch (err: any) {
    console.error('GitHub OAuth callback failed:', err.message);
    res.redirect(`${clientUrl}/login?error=${encodeURIComponent(err.message)}`);
  }
});

/**
 * Get current session profile
 */
authRouter.get('/me', (req, res) => {
  const token = req.cookies?.revai_session || req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated', authenticated: false });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(payload.id) as any;

    if (!user) {
      res.clearCookie('revai_session');
      return res.status(401).json({ error: 'User no longer exists', authenticated: false });
    }

    res.json({
      authenticated: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.username,
        email: user.email,
        avatar: user.avatar_url,
        role: user.role,
        isGitHubConnected: Boolean(user.access_token),
      },
    });
  } catch {
    res.clearCookie('revai_session');
    res.status(401).json({ error: 'Invalid or expired session', authenticated: false });
  }
});

/**
 * Quick role toggle
 */
authRouter.post('/switch-role', (req, res) => {
  const { role } = req.body;
  if (!['manager', 'developer'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  // Find user for this role or update current user
  const token = req.cookies?.revai_session || req.headers.authorization?.replace('Bearer ', '');
  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET) as { id: string };
      db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, payload.id);
    } catch {
      // Fallback
    }
  }

  const targetUser = db.prepare('SELECT * FROM users WHERE role = ? LIMIT 1').get(role) as any;
  if (targetUser) {
    const newToken = jwt.sign(
      { id: targetUser.id, username: targetUser.username, role: targetUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.cookie('revai_session', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      user: {
        id: targetUser.id,
        username: targetUser.username,
        name: targetUser.username === 'sarahjenkins' ? 'Sarah Jenkins' : targetUser.username === 'rahulsharma' ? 'Rahul Sharma' : targetUser.username,
        email: targetUser.email,
        avatar: targetUser.avatar_url,
        role: targetUser.role,
        isGitHubConnected: Boolean(targetUser.access_token),
      },
    });
  }

  res.json({ success: true, role });
});

/**
 * Demo login switcher for local testing
 */
authRouter.post('/demo-login', (req, res) => {
  const { persona } = req.body; // 'manager' | 'developer'
  const role = persona === 'developer' ? 'developer' : 'manager';
  const targetUser = db.prepare('SELECT * FROM users WHERE role = ? LIMIT 1').get(role) as any;

  if (!targetUser) {
    return res.status(404).json({ error: 'Demo user not found' });
  }

  const token = jwt.sign(
    { id: targetUser.id, username: targetUser.username, role: targetUser.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.cookie('revai_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    user: {
      id: targetUser.id,
      username: targetUser.username,
      name: targetUser.username === 'sarahjenkins' ? 'Sarah Jenkins' : 'Rahul Sharma',
      email: targetUser.email,
      avatar: targetUser.avatar_url,
      role: targetUser.role,
      isGitHubConnected: Boolean(targetUser.access_token),
    },
  });
});

/**
 * Logout
 */
authRouter.post('/logout', (req, res) => {
  res.clearCookie('revai_session', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
  res.json({ success: true, message: 'Logged out successfully' });
});
