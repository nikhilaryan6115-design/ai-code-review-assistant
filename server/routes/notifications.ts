import { Router } from 'express';
import { db } from '../db';

export const notificationsRouter = Router();

notificationsRouter.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM notifications ORDER BY timestamp DESC LIMIT 50').all() as any[];
  const notifications = rows.map((n) => ({
    id: n.id,
    title: n.title,
    message: n.message,
    type: n.type,
    timestamp: n.timestamp,
    read: Boolean(n.read),
    link: n.link,
    submissionId: n.submission_id,
    prNumber: n.pr_number,
  }));

  res.json({ notifications });
});

notificationsRouter.post('/read-all', (req, res) => {
  db.prepare('UPDATE notifications SET read = 1').run();
  res.json({ success: true });
});

notificationsRouter.post('/:id/read', (req, res) => {
  db.prepare('UPDATE notifications SET read = 1 WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});
