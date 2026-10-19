import { Router, Response } from 'express';
import { db } from '../db/database.js';
import { Role } from '../types.js';
import { authenticate, requireRole, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/admin/analytics
router.get('/analytics', authenticate, requireRole('ADMIN'), (req: AuthenticatedRequest, res: Response): void => {
  const totalUsers = db.users.length;
  const totalDevelopers = db.users.filter(u => u.role === 'DEVELOPER').length;
  const totalProjects = db.projects.length;
  const publishedProjects = db.projects.filter(p => p.status === 'PUBLISHED').length;
  const pendingProjects = db.projects.filter(p => p.status === 'PENDING').length;
  const draftProjects = db.projects.filter(p => p.status === 'DRAFT').length;

  const totalViews = db.projects.reduce((acc, p) => acc + p.viewCount, 0);
  const totalDownloads = db.projects.reduce((acc, p) => acc + p.downloadCount, 0);
  const totalLikes = db.likes.length + db.projects.reduce((acc, p) => acc + p.likeCount, 0);
  const totalBookmarks = db.bookmarks.length + db.projects.reduce((acc, p) => acc + p.bookmarkCount, 0);

  // Category distribution
  const categoryCounts: Record<string, number> = {};
  for (const p of db.projects) {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  }
  const topCategories = Object.entries(categoryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Technology distribution
  const techCounts: Record<string, number> = {};
  for (const p of db.projects) {
    for (const t of p.technologies) {
      techCounts[t] = (techCounts[t] || 0) + 1;
    }
  }
  const topTechnologies = Object.entries(techCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Monthly growth mock series
  const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
  const projectGrowth = [2, 5, 8, 12, 17, totalProjects];
  const userGrowth = [4, 9, 18, 32, 48, totalUsers * 12];
  const monthlyViews = [3200, 6800, 14200, 28900, 52100, totalViews];
  const monthlyDownloads = [450, 920, 1840, 3950, 7800, totalDownloads];

  const mostViewedProjects = [...db.projects]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5)
    .map(p => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      category: p.category,
      views: p.viewCount,
      likes: p.likeCount,
      developerName: p.developerName
    }));

  const mostDownloadedProjects = [...db.projects]
    .sort((a, b) => b.downloadCount - a.downloadCount)
    .slice(0, 5)
    .map(p => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      category: p.category,
      downloads: p.downloadCount,
      developerName: p.developerName
    }));

  res.json({
    metrics: {
      totalUsers,
      totalDevelopers,
      totalProjects,
      publishedProjects,
      pendingProjects,
      draftProjects,
      totalViews,
      totalDownloads,
      totalLikes,
      totalBookmarks
    },
    topCategories,
    topTechnologies,
    charts: {
      months,
      projectGrowth,
      userGrowth,
      monthlyViews,
      monthlyDownloads
    },
    mostViewedProjects,
    mostDownloadedProjects,
    recentActivity: db.activityLogs.slice(0, 10)
  });
});

// GET /api/admin/users
router.get('/users', authenticate, requireRole('ADMIN'), (req: AuthenticatedRequest, res: Response): void => {
  const usersWithMeta = db.users.map(u => {
    const { passwordHash, ...safe } = u;
    const projectCount = db.projects.filter(p => p.developerId === u.id).length;
    return {
      ...safe,
      projectCount
    };
  });

  res.json({ users: usersWithMeta });
});

// PUT /api/admin/users/:id/role
router.put('/users/:id/role', authenticate, requireRole('ADMIN'), (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const adminUser = req.user!;
  const { role } = req.body;

  const validRoles: Role[] = ['ADMIN', 'DEVELOPER', 'USER'];
  if (!role || !validRoles.includes(role)) {
    res.status(400).json({ error: 'Valid role (ADMIN, DEVELOPER, USER) is required.' });
    return;
  }

  const target = db.users.find(u => u.id === id);
  if (!target) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  // Prevent self-demotion from admin
  if (target.id === adminUser.id && role !== 'ADMIN') {
    res.status(400).json({ error: 'Cannot remove your own admin privileges.' });
    return;
  }

  const prevRole = target.role;
  target.role = role;
  target.updatedAt = new Date().toISOString();

  db.notifications.push({
    id: `notif-${Date.now()}`,
    userId: target.id,
    title: 'Account Role Updated',
    message: `Your account role was changed from ${prevRole} to ${role} by Admin.`,
    type: 'info',
    read: false,
    createdAt: new Date().toISOString()
  });

  db.logActivity(adminUser.id, adminUser.name, 'USER_ROLE_CHANGED', `Changed ${target.name}'s role from ${prevRole} to ${role}`);
  db.save();

  res.json({ message: 'User role updated', user: { id: target.id, name: target.name, role: target.role } });
});

// GET /api/admin/activity-logs
router.get('/activity-logs', authenticate, requireRole('ADMIN'), (req, res): void => {
  res.json({ logs: db.activityLogs.slice(0, 50) });
});

// GET /api/admin/settings
router.get('/settings', (req, res): void => {
  res.json({ settings: db.settings });
});

// PUT /api/admin/settings
router.put('/settings', authenticate, requireRole('ADMIN'), (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user!;
  const updates = req.body;

  Object.assign(db.settings, updates);
  db.logActivity(user.id, user.name, 'SETTINGS_UPDATED', 'Updated platform configuration settings');
  db.save();

  res.json({ message: 'Settings updated successfully', settings: db.settings });
});

export default router;
