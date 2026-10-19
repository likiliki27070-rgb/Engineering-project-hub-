import { Router, Response } from 'express';
import { db } from '../db/database.js';
import { Project, ProjectStatus, DifficultyLevel } from '../types.js';
import { authenticate, optionalAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// GET /api/projects
router.get('/', optionalAuth, (req: AuthenticatedRequest, res: Response): void => {
  const {
    search,
    category,
    technology,
    difficulty,
    domain,
    developer,
    sort = 'latest',
    status,
    featured,
    page = '1',
    limit = '12'
  } = req.query as Record<string, string>;

  let result = [...db.projects];

  // If not admin, only show PUBLISHED projects unless requested by owner or admin
  const isAdmin = req.user?.role === 'ADMIN';
  const isDev = req.user?.role === 'DEVELOPER';

  if (!isAdmin) {
    if (developer && req.user && req.user.id === developer) {
      // Developer viewing own projects can see their drafts/pending
      result = result.filter(p => p.developerId === req.user!.id);
    } else {
      result = result.filter(p => p.status === 'PUBLISHED');
    }
  } else if (status) {
    result = result.filter(p => p.status === status);
  }

  // Filter by category
  if (category && category !== 'All') {
    result = result.filter(p =>
      p.category.toLowerCase() === category.toLowerCase() ||
      slugify(p.category) === slugify(category)
    );
  }

  // Filter by technology
  if (technology && technology !== 'All') {
    result = result.filter(p =>
      p.technologies.some(t => t.toLowerCase() === technology.toLowerCase())
    );
  }

  // Filter by difficulty
  if (difficulty && difficulty !== 'All') {
    result = result.filter(p => p.difficulty.toLowerCase() === difficulty.toLowerCase());
  }

  // Filter by domain
  if (domain && domain !== 'All') {
    result = result.filter(p => p.engineeringDomain.toLowerCase() === domain.toLowerCase());
  }

  // Filter by featured
  if (featured === 'true') {
    result = result.filter(p => p.isFeatured);
  }

  // Search filter
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    result = result.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.fullDescription.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.engineeringDomain.toLowerCase().includes(q) ||
      p.developerName.toLowerCase().includes(q) ||
      p.technologies.some(t => t.toLowerCase().includes(q)) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  // Sorting
  switch (sort) {
    case 'views':
      result.sort((a, b) => b.viewCount - a.viewCount);
      break;
    case 'likes':
      result.sort((a, b) => b.likeCount - a.likeCount);
      break;
    case 'bookmarks':
      result.sort((a, b) => b.bookmarkCount - a.bookmarkCount);
      break;
    case 'az':
      result.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'latest':
    default:
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
  }

  // Pagination
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 12;
  const total = result.length;
  const totalPages = Math.ceil(total / limitNum);
  const startIndex = (pageNum - 1) * limitNum;
  const paginatedProjects = result.slice(startIndex, startIndex + limitNum);

  // Attach user interaction states (isLiked, isBookmarked)
  const userLikesSet = new Set(
    req.user ? db.likes.filter(l => l.userId === req.user!.id).map(l => l.projectId) : []
  );
  const userBookmarksSet = new Set(
    req.user ? db.bookmarks.filter(b => b.userId === req.user!.id).map(b => b.projectId) : []
  );

  const projectsWithFlags = paginatedProjects.map(p => ({
    ...p,
    isLiked: userLikesSet.has(p.id),
    isBookmarked: userBookmarksSet.has(p.id)
  }));

  res.json({
    projects: projectsWithFlags,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages
    }
  });
});

// GET /api/projects/:idOrSlug
router.get('/:idOrSlug', optionalAuth, (req: AuthenticatedRequest, res: Response): void => {
  const { idOrSlug } = req.params;
  const project = db.projects.find(p => p.id === idOrSlug || p.slug === idOrSlug);

  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  // Increment view count
  project.viewCount += 1;
  db.save();

  const isLiked = req.user ? db.likes.some(l => l.projectId === project.id && l.userId === req.user!.id) : false;
  const isBookmarked = req.user ? db.bookmarks.some(b => b.projectId === project.id && b.userId === req.user!.id) : false;

  const developer = db.users.find(u => u.id === project.developerId);

  res.json({
    project: {
      ...project,
      isLiked,
      isBookmarked,
      developer: developer ? {
        id: developer.id,
        name: developer.name,
        username: developer.username,
        avatar: developer.avatar,
        bio: developer.bio,
        skills: developer.skills,
        engineeringDomain: developer.engineeringDomain,
        githubUrl: developer.githubUrl,
        linkedinUrl: developer.linkedinUrl
      } : null
    }
  });
});

// POST /api/projects
router.post('/', authenticate, requireRole('ADMIN', 'DEVELOPER'), (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user!;
  const {
    title,
    shortDescription,
    fullDescription,
    category,
    engineeringDomain,
    difficulty = 'Intermediate',
    technologies = [],
    programmingLanguages = [],
    teamMembers = [],
    status = 'PENDING',
    version = 'v1.0.0',
    githubUrl,
    demoUrl,
    documentationUrl,
    markdownDoc,
    images = [],
    demoVideoUrl,
    downloadFiles = [],
    requirements = [],
    installation = [],
    usage = [],
    features = [],
    futureImprovements = [],
    tags = [],
    isFeatured = false
  } = req.body;

  if (!title || !shortDescription || !category) {
    res.status(400).json({ error: 'Title, short description, and category are required.' });
    return;
  }

  let finalStatus: ProjectStatus = 'DRAFT';
  if (user.role === 'ADMIN') {
    finalStatus = status || 'PUBLISHED';
  } else {
    // If developer requests publish or pending, put in review queue
    finalStatus = status === 'DRAFT' ? 'DRAFT' : 'PENDING';
  }

  const projectId = `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  let slug = slugify(title);
  if (db.projects.some(p => p.slug === slug)) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const defaultImage = images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80'
  ];

  const newProject: Project = {
    id: projectId,
    title: title.trim(),
    slug,
    shortDescription: shortDescription.trim(),
    fullDescription: fullDescription || shortDescription,
    category,
    engineeringDomain: engineeringDomain || category,
    difficulty: difficulty as DifficultyLevel,
    technologies: Array.isArray(technologies) ? technologies : [],
    programmingLanguages: Array.isArray(programmingLanguages) ? programmingLanguages : [],
    developerId: user.id,
    developerName: user.name,
    developerAvatar: user.avatar,
    teamMembers: Array.isArray(teamMembers) ? teamMembers : [],
    status: finalStatus,
    version: version || 'v1.0.0',
    githubUrl,
    demoUrl,
    documentationUrl,
    markdownDoc: markdownDoc || `# ${title}\n\n${fullDescription || shortDescription}`,
    images: defaultImage,
    demoVideoUrl,
    downloadFiles: Array.isArray(downloadFiles) ? downloadFiles : [],
    requirements: Array.isArray(requirements) ? requirements : [],
    installation: Array.isArray(installation) ? installation : [],
    usage: Array.isArray(usage) ? usage : [],
    features: Array.isArray(features) ? features : [],
    futureImprovements: Array.isArray(futureImprovements) ? futureImprovements : [],
    tags: Array.isArray(tags) ? tags : [category],
    isFeatured: user.role === 'ADMIN' ? Boolean(isFeatured) : false,
    viewCount: 0,
    likeCount: 0,
    bookmarkCount: 0,
    downloadCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.projects.unshift(newProject);

  // If pending, add submission for admin review
  if (finalStatus === 'PENDING') {
    db.submissions.unshift({
      id: `sub-${Date.now()}`,
      projectId: newProject.id,
      developerId: user.id,
      developerName: user.name,
      status: 'PENDING',
      submittedAt: new Date().toISOString()
    });

    // Notify admins
    const admins = db.users.filter(u => u.role === 'ADMIN');
    for (const admin of admins) {
      db.notifications.push({
        id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        userId: admin.id,
        title: 'New Project Submission',
        message: `${user.name} submitted "${newProject.title}" for review.`,
        type: 'submission',
        link: `/admin/submissions`,
        read: false,
        createdAt: new Date().toISOString()
      });
    }
  }

  db.logActivity(user.id, user.name, 'PROJECT_CREATED', `Created project "${newProject.title}" (${finalStatus})`);
  db.save();

  res.status(201).json({
    message: finalStatus === 'PENDING' ? 'Project submitted for Admin approval' : 'Project created successfully',
    project: newProject
  });
});

// PUT /api/projects/:id
router.put('/:id', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const user = req.user!;
  const project = db.projects.find(p => p.id === id);

  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  const isAdmin = user.role === 'ADMIN';
  const isOwner = project.developerId === user.id;

  if (!isAdmin && !isOwner) {
    res.status(403).json({ error: 'You do not have permission to edit this project.' });
    return;
  }

  const allowedUpdates = req.body;

  if (allowedUpdates.title && allowedUpdates.title !== project.title) {
    project.title = allowedUpdates.title.trim();
    project.slug = slugify(project.title);
  }
  if (allowedUpdates.shortDescription) project.shortDescription = allowedUpdates.shortDescription;
  if (allowedUpdates.fullDescription) project.fullDescription = allowedUpdates.fullDescription;
  if (allowedUpdates.category) project.category = allowedUpdates.category;
  if (allowedUpdates.engineeringDomain) project.engineeringDomain = allowedUpdates.engineeringDomain;
  if (allowedUpdates.difficulty) project.difficulty = allowedUpdates.difficulty;
  if (allowedUpdates.technologies) project.technologies = allowedUpdates.technologies;
  if (allowedUpdates.programmingLanguages) project.programmingLanguages = allowedUpdates.programmingLanguages;
  if (allowedUpdates.version) project.version = allowedUpdates.version;
  if (allowedUpdates.githubUrl !== undefined) project.githubUrl = allowedUpdates.githubUrl;
  if (allowedUpdates.demoUrl !== undefined) project.demoUrl = allowedUpdates.demoUrl;
  if (allowedUpdates.documentationUrl !== undefined) project.documentationUrl = allowedUpdates.documentationUrl;
  if (allowedUpdates.markdownDoc !== undefined) project.markdownDoc = allowedUpdates.markdownDoc;
  if (allowedUpdates.images) project.images = allowedUpdates.images;
  if (allowedUpdates.demoVideoUrl !== undefined) project.demoVideoUrl = allowedUpdates.demoVideoUrl;
  if (allowedUpdates.downloadFiles) project.downloadFiles = allowedUpdates.downloadFiles;
  if (allowedUpdates.requirements) project.requirements = allowedUpdates.requirements;
  if (allowedUpdates.installation) project.installation = allowedUpdates.installation;
  if (allowedUpdates.usage) project.usage = allowedUpdates.usage;
  if (allowedUpdates.features) project.features = allowedUpdates.features;
  if (allowedUpdates.futureImprovements) project.futureImprovements = allowedUpdates.futureImprovements;
  if (allowedUpdates.tags) project.tags = allowedUpdates.tags;

  if (isAdmin) {
    if (allowedUpdates.status) project.status = allowedUpdates.status;
    if (allowedUpdates.isFeatured !== undefined) project.isFeatured = Boolean(allowedUpdates.isFeatured);
    if (allowedUpdates.featuredOrder !== undefined) project.featuredOrder = Number(allowedUpdates.featuredOrder);
  } else if (allowedUpdates.submitForReview) {
    project.status = 'PENDING';
    db.submissions.unshift({
      id: `sub-${Date.now()}`,
      projectId: project.id,
      developerId: user.id,
      developerName: user.name,
      status: 'PENDING',
      submittedAt: new Date().toISOString()
    });
  }

  project.updatedAt = new Date().toISOString();
  db.logActivity(user.id, user.name, 'PROJECT_UPDATED', `Updated project "${project.title}"`);
  db.save();

  res.json({
    message: 'Project updated successfully',
    project
  });
});

// DELETE /api/projects/:id
router.delete('/:id', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const user = req.user!;
  const index = db.projects.findIndex(p => p.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  const project = db.projects[index];
  const isAdmin = user.role === 'ADMIN';
  const isOwner = project.developerId === user.id;

  if (!isAdmin && !isOwner) {
    res.status(403).json({ error: 'You do not have permission to delete this project.' });
    return;
  }

  db.projects.splice(index, 1);
  db.logActivity(user.id, user.name, 'PROJECT_DELETED', `Deleted project "${project.title}"`);
  db.save();

  res.json({ message: 'Project removed successfully' });
});

// POST /api/projects/:id/like
router.post('/:id/like', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const id = req.params.id as string;
  const user = req.user!;
  const project = db.projects.find(p => p.id === id);

  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  const existingIndex = db.likes.findIndex(l => l.projectId === id && l.userId === user.id);
  let isLiked = false;

  if (existingIndex > -1) {
    db.likes.splice(existingIndex, 1);
    project.likeCount = Math.max(0, project.likeCount - 1);
    isLiked = false;
  } else {
    db.likes.push({
      id: `like-${Date.now()}`,
      projectId: id,
      userId: user.id,
      createdAt: new Date().toISOString()
    });
    project.likeCount += 1;
    isLiked = true;

    // Notify project developer
    if (project.developerId !== user.id) {
      db.notifications.push({
        id: `notif-${Date.now()}`,
        userId: project.developerId,
        title: 'Project Liked',
        message: `${user.name} liked your project "${project.title}".`,
        type: 'info',
        link: `/projects/${project.slug}`,
        read: false,
        createdAt: new Date().toISOString()
      });
    }
  }

  db.save();
  res.json({ isLiked, likeCount: project.likeCount });
});

// POST /api/projects/:id/bookmark
router.post('/:id/bookmark', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const id = req.params.id as string;
  const user = req.user!;
  const project = db.projects.find(p => p.id === id);

  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  const existingIndex = db.bookmarks.findIndex(b => b.projectId === id && b.userId === user.id);
  let isBookmarked = false;

  if (existingIndex > -1) {
    db.bookmarks.splice(existingIndex, 1);
    project.bookmarkCount = Math.max(0, project.bookmarkCount - 1);
    isBookmarked = false;
  } else {
    db.bookmarks.push({
      id: `bm-${Date.now()}`,
      projectId: id,
      userId: user.id,
      createdAt: new Date().toISOString()
    });
    project.bookmarkCount += 1;
    isBookmarked = true;
  }

  db.save();
  res.json({ isBookmarked, bookmarkCount: project.bookmarkCount });
});

// POST /api/projects/:id/download
router.post('/:id/download', (req, res): void => {
  const { id } = req.params;
  const project = db.projects.find(p => p.id === id);

  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  project.downloadCount += 1;
  db.save();

  res.json({
    message: 'Download registered',
    downloadCount: project.downloadCount,
    files: project.downloadFiles
  });
});

// GET /api/projects/:id/comments
router.get('/:id/comments', (req, res): void => {
  const { id } = req.params;
  const comments = db.comments
    .filter(c => c.projectId === id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json({ comments });
});

// POST /api/projects/:id/comments
router.post('/:id/comments', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const id = req.params.id as string;
  const user = req.user!;
  const { content } = req.body;

  if (!content || !content.trim()) {
    res.status(400).json({ error: 'Comment content cannot be empty.' });
    return;
  }

  const project = db.projects.find(p => p.id === id);
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  const newComment = {
    id: `cm-${Date.now()}`,
    projectId: id,
    userId: user.id,
    userName: user.name,
    userAvatar: user.avatar,
    userRole: user.role,
    content: content.trim(),
    createdAt: new Date().toISOString()
  };

  db.comments.push(newComment);

  // Notify developer
  if (project.developerId !== user.id) {
    db.notifications.push({
      id: `notif-${Date.now()}`,
      userId: project.developerId,
      title: 'New Discussion Comment',
      message: `${user.name} commented on "${project.title}".`,
      type: 'comment',
      link: `/projects/${project.slug}`,
      read: false,
      createdAt: new Date().toISOString()
    });
  }

  db.save();
  res.status(201).json({ comment: newComment });
});

// DELETE /api/projects/:id/comments/:commentId
router.delete('/:id/comments/:commentId', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const { commentId } = req.params;
  const user = req.user!;

  const index = db.comments.findIndex(c => c.id === commentId);
  if (index === -1) {
    res.status(404).json({ error: 'Comment not found' });
    return;
  }

  const comment = db.comments[index];
  const isAdmin = user.role === 'ADMIN';
  const isAuthor = comment.userId === user.id;

  if (!isAdmin && !isAuthor) {
    res.status(403).json({ error: 'You do not have permission to delete this comment.' });
    return;
  }

  db.comments.splice(index, 1);
  db.save();

  res.json({ message: 'Comment removed successfully' });
});

export default router;
