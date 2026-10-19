import { Router, Response } from 'express';
import { db } from '../db/database.js';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/notifications
router.get('/', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user!;
  const notifications = db.notifications
    .filter(n => n.userId === user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const unreadCount = notifications.filter(n => !n.read).length;

  res.json({
    notifications,
    unreadCount
  });
});

// PUT /api/notifications/:id/read
router.put('/:id/read', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const user = req.user!;
  const notif = db.notifications.find(n => n.id === id && n.userId === user.id);

  if (!notif) {
    res.status(404).json({ error: 'Notification not found' });
    return;
  }

  notif.read = true;
  db.save();

  res.json({ message: 'Marked as read', notification: notif });
});

// PUT /api/notifications/read-all
router.put('/read-all', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user!;
  for (const n of db.notifications) {
    if (n.userId === user.id) {
      n.read = true;
    }
  }
  db.save();

  res.json({ message: 'All notifications marked as read' });
});

export default router;
