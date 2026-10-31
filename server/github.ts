import crypto from 'crypto';

export interface GitHubUserProfile {
  id: number;
  login: string;
  name: string;
  email: string | null;
  avatar_url: string;
}

export interface GitHubRepoItem {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  private: boolean;
  description: string | null;
  language: string | null;
  default_branch: string;
  stargazers_count: number;
  open_issues_count: number;
  html_url: string;
}

/**
 * Verify GitHub webhook HMAC SHA256 signature
 */
export function verifyWebhookSignature(
  rawBody: Buffer | string,
  signatureHeader: string | undefined,
  secret: string
): boolean {
  if (!signatureHeader || !secret) {
    return false;
  }

  const parts = signatureHeader.split('=');
  if (parts.length !== 2 || parts[0] !== 'sha256') {
    return false;
  }

  const expectedSignature = parts[1];
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(typeof rawBody === 'string' ? Buffer.from(rawBody, 'utf8') : rawBody);
  const digest = hmac.digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(digest, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

/**
 * Exchange OAuth temporary code for access token
 */
export async function exchangeCodeForToken(code: string): Promise<string> {
  let clientId = (
    process.env.GITHUB_CLIENT_ID ||
    process.env.CLIENT_ID ||
    process.env.GH_CLIENT_ID ||
    ''
  ).trim();
  if (/^0v23/i.test(clientId)) {
    clientId = 'O' + clientId.slice(1);
  }
  const clientSecret = (
    process.env.GITHUB_CLIENT_SECRET ||
    process.env.GITHUB_SECRET ||
    process.env.CLIENT_SECRET ||
    process.env.GH_CLIENT_SECRET ||
    ''
  ).trim();

  if (!clientId || !clientSecret) {
    throw new Error('GitHub OAuth is not configured: GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET missing.');
  }

  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': 'RevAI-Code-Review-Platform',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  });

  const data = (await response.json()) as { access_token?: string; error?: string; error_description?: string };
  if (!response.ok || data.error || !data.access_token) {
    throw new Error(data.error_description || data.error || 'Failed to exchange GitHub authorization code.');
  }

  return data.access_token;
}

/**
 * Fetch authenticated GitHub user profile
 */
export async function getGitHubUser(accessToken: string): Promise<GitHubUserProfile> {
  const userRes = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'RevAI-Code-Review-Platform',
    },
  });

  if (!userRes.ok) {
    throw new Error(`Failed to fetch user profile from GitHub API (${userRes.status}).`);
  }

  const userData = (await userRes.json()) as GitHubUserProfile;

  // If email is private in primary profile, fetch from /user/emails
  if (!userData.email) {
    try {
      const emailRes = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'RevAI-Code-Review-Platform',
        },
      });

      if (emailRes.ok) {
        const emails = (await emailRes.json()) as { email: string; primary: boolean; verified: boolean }[];
        const primary = emails.find((e) => e.primary && e.verified) || emails[0];
        if (primary) {
          userData.email = primary.email;
        }
      }
    } catch {
      // Non-fatal, keep null
    }
  }

  return userData;
}

/**
 * Fetch repositories accessible by the user (or GitHub App)
 */
export async function getAccessibleRepositories(accessToken: string): Promise<GitHubRepoItem[]> {
  const res = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100&affiliation=owner,collaborator,organization_member', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'RevAI-Code-Review-Platform',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch repositories from GitHub (${res.status}).`);
  }

  return (await res.json()) as GitHubRepoItem[];
}

/**
 * Fetch Pull Request Details
 */
export async function getPullRequestDetails(
  owner: string,
  repo: string,
  pullNumber: number,
  token?: string
) {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'RevAI-Code-Review-Platform',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`, {
    headers,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch PR #${pullNumber} from GitHub (${res.status}).`);
  }

  return await res.json();
}

/**
 * Fetch raw unified diff for a pull request
 */
export async function getPullRequestDiff(
  owner: string,
  repo: string,
  pullNumber: number,
  token?: string
): Promise<string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3.diff',
    'User-Agent': 'RevAI-Code-Review-Platform',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`, {
    headers,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch diff for ${owner}/${repo}#${pullNumber} (${res.status}).`);
  }

  return await res.text();
}

/**
 * Publish review summary comment to GitHub Pull Request
 */
export async function postReviewComment(
  owner: string,
  repo: string,
  pullNumber: number,
  body: string,
  token: string
) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${pullNumber}/comments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'User-Agent': 'RevAI-Code-Review-Platform',
    },
    body: JSON.stringify({ body }),
  });

  return res.ok;
}

/**
 * Search public GitHub repositories using the official search API
 */
export async function searchGitHubRepositories(
  query: string,
  page: number = 1,
  perPage: number = 15,
  token?: string
) {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'RevAI-Code-Review-Platform',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(
    `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&sort=stars&order=desc`,
    { headers }
  );

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`GitHub search API error (${res.status}): ${errorBody}`);
  }

  return (await res.json()) as {
    total_count: number;
    incomplete_results: boolean;
    items: GitHubRepoItem[];
  };
}

/**
 * Fetch a single repository by owner and name
 */
export async function getSingleRepository(owner: string, repo: string, token?: string) {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'RevAI-Code-Review-Platform',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
  if (!res.ok) {
    throw new Error(`Repository not found on GitHub (${res.status}).`);
  }

  return (await res.json()) as GitHubRepoItem;
}

/**
 * Get repository directory contents / file tree
 */
export async function getRepositoryContents(
  owner: string,
  repo: string,
  path: string = '',
  ref?: string,
  token?: string
) {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'RevAI-Code-Review-Platform',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = new URL(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`);
  if (ref) {
    url.searchParams.set('ref', ref);
  }

  const res = await fetch(url.toString(), { headers });
  if (!res.ok) {
    throw new Error(`Failed to fetch contents at '${path}' (${res.status}).`);
  }

  return await res.json();
}

/**
 * Fetch raw file content from GitHub repository
 */
export async function getRawFileContent(
  owner: string,
  repo: string,
  path: string,
  ref?: string,
  token?: string
): Promise<string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3.raw',
    'User-Agent': 'RevAI-Code-Review-Platform',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = new URL(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`);
  if (ref) {
    url.searchParams.set('ref', ref);
  }

  const res = await fetch(url.toString(), { headers });
  if (!res.ok) {
    throw new Error(`Failed to fetch file content (${res.status}).`);
  }

  return await res.text();
}

