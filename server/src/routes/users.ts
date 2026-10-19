import { Router, Response } from 'express';
import { db } from '../db/database.js';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/users/profile/:username - Public profile
router.get('/profile/:username', (req, res): void => {
  const { username } = req.params;
  const user = db.users.find(u => u.username.toLowerCase() === username.toLowerCase());

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const { passwordHash, ...safeUser } = user;
  const publishedProjects = db.projects.filter(p => p.developerId === user.id && p.status === 'PUBLISHED');
  const totalViews = publishedProjects.reduce((acc, p) => acc + p.viewCount, 0);
  const totalLikes = publishedProjects.reduce((acc, p) => acc + p.likeCount, 0);
  const totalDownloads = publishedProjects.reduce((acc, p) => acc + p.downloadCount, 0);

  res.json({
    user: safeUser,
    projects: publishedProjects,
    stats: {
      projectsCount: publishedProjects.length,
      totalViews,
      totalLikes,
      totalDownloads
    }
  });
});

// GET /api/users/developers - Developer spotlight list
router.get('/developers', (req, res): void => {
  const devs = db.users.filter(u => u.role === 'DEVELOPER' || u.role === 'ADMIN');
  const developerProfiles = devs.map(u => {
    const { passwordHash, ...safe } = u;
    const devProjects = db.projects.filter(p => p.developerId === u.id && p.status === 'PUBLISHED');
    return {
      ...safe,
      projectsCount: devProjects.length,
      totalLikes: devProjects.reduce((acc, p) => acc + p.likeCount, 0),
      featuredProject: devProjects[0] || null
    };
  });

  res.json({ developers: developerProfiles });
});

// GET /api/users/me/dashboard - Current user's dashboard items
router.get('/me/dashboard', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user!;

  const userBookmarkIds = db.bookmarks.filter(b => b.userId === user.id).map(b => b.projectId);
  const bookmarkedProjects = db.projects.filter(p => userBookmarkIds.includes(p.id));

  const userLikeIds = db.likes.filter(l => l.userId === user.id).map(l => l.projectId);
  const likedProjects = db.projects.filter(p => userLikeIds.includes(p.id));

  const userComments = db.comments
    .filter(c => c.userId === user.id)
    .map(c => {
      const proj = db.projects.find(p => p.id === c.projectId);
      return {
        ...c,
        projectTitle: proj?.title || 'Project',
        projectSlug: proj?.slug || ''
      };
    });

  const myProjects = db.projects.filter(p => p.developerId === user.id);
  const pendingSubmissions = db.submissions.filter(s => s.developerId === user.id);

  res.json({
    bookmarkedProjects,
    likedProjects,
    comments: userComments,
    myProjects,
    pendingSubmissions
  });
});

export default router;
