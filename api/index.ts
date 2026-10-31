import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const appModule = await import('../server/index');
    const app = appModule.default;
    return app(req as any, res as any);
  } catch (err: any) {
    console.error('[Vercel Serverless Error]:', err);
    return res.status(500).json({
      error: 'SERVERLESS_FUNCTION_CRASH',
      message: err?.message || String(err),
      stack: err?.stack || null,
    });
  }
}
