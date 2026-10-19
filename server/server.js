import express from 'express';
import cors from 'cors';
import { readDatabase, writeDatabase, initDatabase } from './database.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Initialize DB on start
initDatabase();

// Health check
app.get('/api/health', (req, res) => {
  const db = readDatabase();
  res.json({
    status: 'online',
    platform: 'LIMO — Engineering Project Hub',
    timestamp: new Date().toISOString(),
    metrics: {
      projects: (db.projects || []).length,
      creators: (db.creators || []).length,
      categories: (db.categories || []).length,
      users: (db.users || []).length
    }
  });
});

// Helper to log activity
function logActivity(user, action, details) {
  const db = readDatabase();
  const newLog = {
    id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    user: user || 'System',
    action,
    details,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };
  db.activityLogs = [newLog, ...(db.activityLogs || [])].slice(0, 100);
  writeDatabase(db);
}

// -------------------------------------------------------------
// AUTH ENDPOINTS
// -------------------------------------------------------------
app.post('/api/auth/login', (req, res) => {
  const { email, password, userId } = req.body;
  const db = readDatabase();

  let user = null;
  if (userId) {
    user = db.users.find(u => u.id === userId);
  } else if (email) {
    user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials. User not found.' });
  }

  logActivity(user.name, 'User Logged In', `Session authenticated for role: ${user.role}`);

  // Return user without password
  const { password: _, ...safeUser } = user;
  res.json({
    token: `jwt-mock-token-${user.id}-${Date.now()}`,
    user: safeUser
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, username, email, password, role, engineeringDomain, skills, bio } = req.body;
  const db = readDatabase();

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() || (username && u.username === username));
  if (existing) {
    return res.status(400).json({ error: 'A user with that email or username already exists.' });
  }

  const assignedRole = role === 'DEVELOPER' ? 'DEVELOPER' : 'USER';
  const newUser = {
    id: `usr-${Date.now()}`,
    name,
    username: username || email.split('@')[0],
    email,
    role: assignedRole,
    avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80`,
    bio: bio || `Passionate ${assignedRole === 'DEVELOPER' ? 'engineer & project builder' : 'engineering student'} exploring LIMO Hub.`,
    engineeringDomain: engineeringDomain || 'Computer Science Engineering',
    skills: skills || ['Engineering Design', 'Problem Solving'],
    joinedDate: new Date().toISOString().split('T')[0],
    bookmarks: [],
    likes: []
  };

  db.users.push(newUser);

  // Notify admin of new registration
  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    recipientId: 'usr-admin',
    type: 'NEW_REGISTRATION',
    title: `New ${assignedRole} Registered`,
    message: `${name} has joined LIMO as a ${assignedRole}.`,
    link: '/admin?tab=users',
    isRead: false,
    timestamp: new Date().toISOString()
  });

  writeDatabase(db);
  logActivity(name, 'Registered Account', `New ${assignedRole} profile created`);

  res.status(201).json({
    token: `jwt-mock-token-${newUser.id}-${Date.now()}`,
    user: newUser
  });
});

app.post('/api/auth/logout', (req, res) => {
  const { userId } = req.body;
  const db = readDatabase();
  const user = db.users.find(u => u.id === userId);
  if (user) {
    logActivity(user.name, 'User Logged Out', 'Session ended securely');
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  const db = readDatabase();
  const user = db.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'No account found with that email address.' });
  }
  res.json({
    success: true,
    message: `Password reset verification link has been dispatched to ${email}.`
  });
});

app.post('/api/auth/reset-password', (req, res) => {
  const { email, newPassword } = req.body;
  res.json({ success: true, message: 'Password has been successfully updated.' });
});

// -------------------------------------------------------------
// CREATOR MANAGEMENT ENDPOINTS (For Meet the Creators & Admin)
// -------------------------------------------------------------
app.get('/api/creators', (req, res) => {
  const db = readDatabase();
  const creators = (db.creators || [])
    .filter(c => c.isVisible !== false)
    .sort((a, b) => (a.order || 99) - (b.order || 99));
  res.json(creators);
});

app.get('/api/creators/all', (req, res) => {
  const db = readDatabase();
  const creators = (db.creators || []).sort((a, b) => (a.order || 99) - (b.order || 99));
  res.json(creators);
});

app.post('/api/creators', (req, res) => {
  const db = readDatabase();
  const { name, role, shortBio, avatar, skills, technologies, contribution, github, linkedin, twitter, order, isVisible } = req.body;

  if (!name || !role) {
    return res.status(400).json({ error: 'Creator name and role are required.' });
  }

  const newCreator = {
    id: `creator-${Date.now()}`,
    name,
    role,
    shortBio: shortBio || '',
    avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
    technologies: Array.isArray(technologies) ? technologies : (technologies ? technologies.split(',').map(s => s.trim()) : []),
    contribution: contribution || '',
    github: github || '',
    linkedin: linkedin || '',
    twitter: twitter || '',
    order: Number(order) || (db.creators ? db.creators.length + 1 : 1),
    isVisible: isVisible !== false
  };

  db.creators = [...(db.creators || []), newCreator];
  writeDatabase(db);
  logActivity('Admin', 'Added Creator', `Added creator profile: ${name} (${role})`);

  res.status(201).json(newCreator);
});

app.put('/api/creators/:id', (req, res) => {
  const db = readDatabase();
  const index = (db.creators || []).findIndex(c => c.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Creator not found.' });
  }

  const updated = {
    ...db.creators[index],
    ...req.body,
    skills: Array.isArray(req.body.skills) ? req.body.skills : (typeof req.body.skills === 'string' ? req.body.skills.split(',').map(s => s.trim()) : db.creators[index].skills),
    technologies: Array.isArray(req.body.technologies) ? req.body.technologies : (typeof req.body.technologies === 'string' ? req.body.technologies.split(',').map(s => s.trim()) : db.creators[index].technologies)
  };

  db.creators[index] = updated;
  writeDatabase(db);
  logActivity('Admin', 'Updated Creator', `Updated creator: ${updated.name}`);

  res.json(updated);
});

app.delete('/api/creators/:id', (req, res) => {
  const db = readDatabase();
  const creator = (db.creators || []).find(c => c.id === req.params.id);
  db.creators = (db.creators || []).filter(c => c.id !== req.params.id);
  writeDatabase(db);

  logActivity('Admin', 'Deleted Creator', `Removed creator: ${creator ? creator.name : req.params.id}`);
  res.json({ success: true, message: 'Creator removed successfully.' });
});

// -------------------------------------------------------------
// PROJECT ENDPOINTS
// -------------------------------------------------------------
app.get('/api/projects', (req, res) => {
  const db = readDatabase();
  let projects = [...db.projects];
  const { search, category, technology, difficulty, sort, status, featured, developerId } = req.query;

  // Filter by status (default only Published unless specified)
  if (status) {
    projects = projects.filter(p => p.status.toLowerCase() === status.toLowerCase());
  } else if (!developerId && !req.query.allStatus) {
    projects = projects.filter(p => p.status === 'Published');
  }

  // Filter by developer
  if (developerId) {
    projects = projects.filter(p => p.developer && p.developer.id === developerId);
  }

  // Featured
  if (featured === 'true') {
    projects = projects.filter(p => p.isFeatured);
  }

  // Category filter
  if (category && category !== 'All') {
    projects = projects.filter(p => 
      p.category.toLowerCase() === category.toLowerCase() || 
      p.engineeringDomain.toLowerCase() === category.toLowerCase()
    );
  }

  // Technology filter
  if (technology && technology !== 'All') {
    projects = projects.filter(p => 
      p.technologies && p.technologies.some(t => t.toLowerCase() === technology.toLowerCase())
    );
  }

  // Difficulty filter
  if (difficulty && difficulty !== 'All') {
    projects = projects.filter(p => p.difficulty.toLowerCase() === difficulty.toLowerCase());
  }

  // Search query across title, description, tags, developer name
  if (search) {
    const q = search.toLowerCase();
    projects = projects.filter(p => 
      p.title.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(q))) ||
      (p.technologies && p.technologies.some(t => t.toLowerCase().includes(q))) ||
      (p.developer && p.developer.name.toLowerCase().includes(q))
    );
  }

  // Sorting
  if (sort === 'most-viewed') {
    projects.sort((a, b) => (b.views || 0) - (a.views || 0));
  } else if (sort === 'most-liked') {
    projects.sort((a, b) => (b.likes || 0) - (a.likes || 0));
  } else if (sort === 'most-bookmarked') {
    projects.sort((a, b) => (b.bookmarks || 0) - (a.bookmarks || 0));
  } else if (sort === 'a-z') {
    projects.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    // Default 'latest'
    projects.sort((a, b) => new Date(b.createdDate || 0) - new Date(a.createdDate || 0));
  }

  res.json(projects);
});

app.get('/api/projects/:idOrSlug', (req, res) => {
  const db = readDatabase();
  const idOrSlug = req.params.idOrSlug;
  const projectIndex = db.projects.findIndex(p => p.id === idOrSlug || p.slug === idOrSlug);

  if (projectIndex === -1) {
    return res.status(404).json({ error: 'Project not found.' });
  }

  // Increment view counter
  db.projects[projectIndex].views = (db.projects[projectIndex].views || 0) + 1;
  writeDatabase(db);

  const project = db.projects[projectIndex];
  const comments = (db.comments || []).filter(c => c.projectId === project.id);

  res.json({
    ...project,
    comments
  });
});

app.post('/api/projects', (req, res) => {
  const db = readDatabase();
  const projectData = req.body;

  if (!projectData.title || !projectData.category) {
    return res.status(400).json({ error: 'Title and category are required.' });
  }

  const slug = (projectData.title || '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') + `-${Date.now().toString().slice(-4)}`;

  const newProject = {
    id: `proj-${Date.now()}`,
    slug,
    title: projectData.title,
    shortDescription: projectData.shortDescription || '',
    fullDescription: projectData.fullDescription || '',
    category: projectData.category,
    engineeringDomain: projectData.engineeringDomain || projectData.category,
    difficulty: projectData.difficulty || 'Intermediate',
    technologies: Array.isArray(projectData.technologies) ? projectData.technologies : [],
    programmingLanguages: Array.isArray(projectData.programmingLanguages) ? projectData.programmingLanguages : ['Python'],
    projectType: projectData.projectType || 'Engineering Solution',
    developer: projectData.developer || {
      id: 'usr-dev-1',
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
    },
    teamMembers: projectData.teamMembers || [projectData.developer?.name || 'Lead Engineer'],
    status: projectData.status || (projectData.isDraft ? 'Draft' : 'Pending'),
    isFeatured: false,
    featuredOrder: 99,
    version: projectData.version || 'v1.0.0',
    githubUrl: projectData.githubUrl || '',
    demoUrl: projectData.demoUrl || '',
    demoVideoUrl: projectData.demoVideoUrl || '',
    images: projectData.images && projectData.images.length ? projectData.images : [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80'
    ],
    features: projectData.features || [],
    requirements: projectData.requirements || [],
    installation: projectData.installation || '',
    usage: projectData.usage || '',
    documentation: projectData.documentation || '',
    downloadResources: projectData.downloadResources || [
      { name: 'Source Code Package', size: '12.4 MB', type: 'ZIP Archive', filename: `${slug}-v1.0.0.zip` }
    ],
    tags: projectData.tags || [],
    createdDate: new Date().toISOString().split('T')[0],
    updatedDate: new Date().toISOString().split('T')[0],
    views: 0,
    likes: 0,
    bookmarks: 0,
    downloads: 0
  };

  db.projects.unshift(newProject);

  // Notify admin if project is submitted for review
  if (newProject.status === 'Pending') {
    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      recipientId: 'usr-admin',
      type: 'PROJECT_SUBMITTED',
      title: 'New Project Awaiting Approval',
      message: `${newProject.developer.name} submitted "${newProject.title}" for review.`,
      link: '/admin?tab=submissions',
      isRead: false,
      timestamp: new Date().toISOString()
    });
  }

  writeDatabase(db);
  logActivity(newProject.developer.name, 'Created Project', `Submitted project: ${newProject.title} (${newProject.status})`);

  res.status(201).json(newProject);
});

app.put('/api/projects/:id', (req, res) => {
  const db = readDatabase();
  const index = db.projects.findIndex(p => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Project not found.' });
  }

  const updated = {
    ...db.projects[index],
    ...req.body,
    updatedDate: new Date().toISOString().split('T')[0]
  };

  db.projects[index] = updated;
  writeDatabase(db);
  logActivity(req.body.editorName || 'User', 'Updated Project', `Updated details for ${updated.title}`);

  res.json(updated);
});

app.delete('/api/projects/:id', (req, res) => {
  const db = readDatabase();
  const project = db.projects.find(p => p.id === req.params.id);
  db.projects = db.projects.filter(p => p.id !== req.params.id);
  writeDatabase(db);

  logActivity('Admin', 'Deleted Project', `Removed project: ${project ? project.title : req.params.id}`);
  res.json({ success: true, message: 'Project removed successfully.' });
});

// Like / Bookmark / Download
app.post('/api/projects/:id/like', (req, res) => {
  const db = readDatabase();
  const { userId } = req.body;
  const project = db.projects.find(p => p.id === req.params.id);
  const user = db.users.find(u => u.id === userId);

  if (!project) return res.status(404).json({ error: 'Project not found' });

  if (user) {
    const isLiked = user.likes.includes(project.id);
    if (isLiked) {
      user.likes = user.likes.filter(id => id !== project.id);
      project.likes = Math.max(0, (project.likes || 0) - 1);
    } else {
      user.likes.push(project.id);
      project.likes = (project.likes || 0) + 1;
    }
  } else {
    project.likes = (project.likes || 0) + 1;
  }

  writeDatabase(db);
  res.json({ likes: project.likes, userLikes: user ? user.likes : [] });
});

app.post('/api/projects/:id/bookmark', (req, res) => {
  const db = readDatabase();
  const { userId } = req.body;
  const project = db.projects.find(p => p.id === req.params.id);
  const user = db.users.find(u => u.id === userId);

  if (!project) return res.status(404).json({ error: 'Project not found' });

  if (user) {
    const isBookmarked = user.bookmarks.includes(project.id);
    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter(id => id !== project.id);
      project.bookmarks = Math.max(0, (project.bookmarks || 0) - 1);
    } else {
      user.bookmarks.push(project.id);
      project.bookmarks = (project.bookmarks || 0) + 1;
    }
  } else {
    project.bookmarks = (project.bookmarks || 0) + 1;
  }

  writeDatabase(db);
  res.json({ bookmarks: project.bookmarks, userBookmarks: user ? user.bookmarks : [] });
});

app.post('/api/projects/:id/download', (req, res) => {
  const db = readDatabase();
  const project = db.projects.find(p => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  project.downloads = (project.downloads || 0) + 1;
  writeDatabase(db);

  res.json({
    success: true,
    downloads: project.downloads,
    message: 'Download registered successfully'
  });
});

app.post('/api/projects/:id/comments', (req, res) => {
  const db = readDatabase();
  const { userId, userName, userAvatar, userRole, content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Comment content is required.' });
  }

  const newComment = {
    id: `com-${Date.now()}`,
    projectId: req.params.id,
    userId: userId || 'usr-student',
    userName: userName || 'Student Engineer',
    userAvatar: userAvatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    userRole: userRole || 'USER',
    content,
    createdDate: new Date().toISOString().split('T')[0],
    likes: 0
  };

  db.comments = db.comments || [];
  db.comments.push(newComment);
  writeDatabase(db);

  logActivity(userName || 'User', 'Added Comment', `Commented on project #${req.params.id}`);
  res.status(201).json(newComment);
});

// Admin Moderation (Approve, Reject, Feature)
app.post('/api/projects/:id/moderate', (req, res) => {
  const db = readDatabase();
  const { action, rejectionReason } = req.body;
  const project = db.projects.find(p => p.id === req.params.id);

  if (!project) return res.status(404).json({ error: 'Project not found' });

  if (action === 'APPROVE') {
    project.status = 'Published';
    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      recipientId: project.developer.id,
      type: 'PROJECT_APPROVED',
      title: 'Project Approved & Published',
      message: `Your project "${project.title}" has been reviewed and published!`,
      link: `/projects/${project.slug || project.id}`,
      isRead: false,
      timestamp: new Date().toISOString()
    });
    logActivity('Admin', 'Approved Project', `Approved project: ${project.title}`);
  } else if (action === 'REJECT') {
    project.status = 'Draft';
    project.rejectionReason = rejectionReason || 'Revisions requested by Admin.';
    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      recipientId: project.developer.id,
      type: 'PROJECT_REJECTED',
      title: 'Revisions Requested for Project',
      message: `Admin review for "${project.title}": ${project.rejectionReason}`,
      link: `/developer`,
      isRead: false,
      timestamp: new Date().toISOString()
    });
    logActivity('Admin', 'Rejected Project', `Rejected project: ${project.title}. Reason: ${project.rejectionReason}`);
  } else if (action === 'TOGGLE_FEATURED') {
    project.isFeatured = !project.isFeatured;
    logActivity('Admin', 'Toggled Featured', `${project.isFeatured ? 'Featured' : 'Unfeatured'} ${project.title}`);
  }

  writeDatabase(db);
  res.json({ success: true, project });
});

// -------------------------------------------------------------
// USER & PROFILE ENDPOINTS
// -------------------------------------------------------------
app.get('/api/users', (req, res) => {
  const db = readDatabase();
  const safeUsers = db.users.map(({ password: _, ...u }) => u);
  res.json(safeUsers);
});

app.get('/api/users/:id', (req, res) => {
  const db = readDatabase();
  const user = db.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const { password: _, ...safeUser } = user;
  const userProjects = db.projects.filter(p => p.developer && p.developer.id === user.id);
  const bookmarkedProjects = db.projects.filter(p => (user.bookmarks || []).includes(p.id));
  const likedProjects = db.projects.filter(p => (user.likes || []).includes(p.id));

  res.json({
    ...safeUser,
    projects: userProjects,
    bookmarkedProjects,
    likedProjects
  });
});

app.put('/api/users/:id', (req, res) => {
  const db = readDatabase();
  const index = db.users.findIndex(u => u.id === req.params.id);

  if (index === -1) return res.status(404).json({ error: 'User not found' });

  const updated = {
    ...db.users[index],
    name: req.body.name ?? db.users[index].name,
    username: req.body.username ?? db.users[index].username,
    avatar: req.body.avatar ?? db.users[index].avatar,
    bio: req.body.bio ?? db.users[index].bio,
    engineeringDomain: req.body.engineeringDomain ?? db.users[index].engineeringDomain,
    skills: Array.isArray(req.body.skills) ? req.body.skills : (typeof req.body.skills === 'string' ? req.body.skills.split(',').map(s => s.trim()) : db.users[index].skills),
    githubUrl: req.body.githubUrl ?? db.users[index].githubUrl,
    linkedinUrl: req.body.linkedinUrl ?? db.users[index].linkedinUrl,
    theme: req.body.theme ?? db.users[index].theme
  };

  db.users[index] = updated;
  writeDatabase(db);
  logActivity(updated.name, 'Updated Profile', 'User updated account details & preferences');

  const { password: _, ...safeUser } = updated;
  res.json(safeUser);
});

// -------------------------------------------------------------
// CATEGORIES & TECH
// -------------------------------------------------------------
app.get('/api/categories', (req, res) => {
  const db = readDatabase();
  res.json(db.categories || []);
});

app.post('/api/categories', (req, res) => {
  const db = readDatabase();
  const { name, icon, description } = req.body;
  if (!name) return res.status(400).json({ error: 'Category name is required' });

  const slug = name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
  const newCat = {
    id: `cat-${Date.now()}`,
    name,
    slug,
    icon: icon || 'Code',
    count: 0,
    description: description || ''
  };

  db.categories.push(newCat);
  writeDatabase(db);
  res.status(201).json(newCat);
});

app.delete('/api/categories/:id', (req, res) => {
  const db = readDatabase();
  db.categories = db.categories.filter(c => c.id !== req.params.id);
  writeDatabase(db);
  res.json({ success: true });
});

app.get('/api/technologies', (req, res) => {
  const db = readDatabase();
  res.json(db.technologies || []);
});

// -------------------------------------------------------------
// ANALYTICS & PLATFORM STATS
// -------------------------------------------------------------
app.get('/api/analytics', (req, res) => {
  const db = readDatabase();
  const totalProjects = db.projects.length;
  const publishedProjects = db.projects.filter(p => p.status === 'Published').length;
  const pendingProjects = db.projects.filter(p => p.status === 'Pending').length;
  const totalUsers = db.users.length;
  const totalDevelopers = db.users.filter(u => u.role === 'DEVELOPER' || u.role === 'ADMIN').length;
  const totalViews = db.projects.reduce((acc, p) => acc + (p.views || 0), 0);
  const totalLikes = db.projects.reduce((acc, p) => acc + (p.likes || 0), 0);
  const totalDownloads = db.projects.reduce((acc, p) => acc + (p.downloads || 0), 0);
  const totalBookmarks = db.projects.reduce((acc, p) => acc + (p.bookmarks || 0), 0);

  // Categories distribution
  const categoryStats = db.categories.map(cat => ({
    name: cat.name,
    count: db.projects.filter(p => p.category === cat.name || p.engineeringDomain === cat.name).length
  })).sort((a, b) => b.count - a.count).slice(0, 8);

  // Top technologies
  const techMap = {};
  db.projects.forEach(p => {
    (p.technologies || []).forEach(t => {
      techMap[t] = (techMap[t] || 0) + 1;
    });
  });
  const technologyStats = Object.entries(techMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  res.json({
    metrics: {
      totalProjects,
      publishedProjects,
      pendingProjects,
      totalUsers,
      totalDevelopers,
      totalViews,
      totalLikes,
      totalDownloads,
      totalBookmarks
    },
    categoryStats,
    technologyStats,
    viewsOverTime: [
      { month: 'May', views: 1200 },
      { month: 'Jun', views: 2400 },
      { month: 'Jul', views: 3900 },
      { month: 'Aug', views: 6200 },
      { month: 'Sep', views: 8800 },
      { month: 'Oct', views: totalViews }
    ],
    growthOverTime: [
      { month: 'May', users: 4, projects: 2 },
      { month: 'Jun', users: 9, projects: 3 },
      { month: 'Jul', users: 16, projects: 5 },
      { month: 'Aug', users: 24, projects: 6 },
      { month: 'Sep', users: 35, projects: 7 },
      { month: 'Oct', users: 48, projects: totalProjects }
    ]
  });
});

// Notifications
app.get('/api/notifications', (req, res) => {
  const db = readDatabase();
  const { userId } = req.query;
  let notifs = db.notifications || [];
  if (userId) {
    notifs = notifs.filter(n => !n.recipientId || n.recipientId === userId || n.recipientId === 'usr-admin');
  }
  res.json(notifs);
});

app.put('/api/notifications/:id/read', (req, res) => {
  const db = readDatabase();
  const notif = (db.notifications || []).find(n => n.id === req.params.id);
  if (notif) notif.isRead = true;
  writeDatabase(db);
  res.json({ success: true });
});

// Activity logs
app.get('/api/activity-logs', (req, res) => {
  const db = readDatabase();
  res.json(db.activityLogs || []);
});

// Settings
app.get('/api/settings', (req, res) => {
  const db = readDatabase();
  res.json(db.siteSettings || {});
});

app.put('/api/settings', (req, res) => {
  const db = readDatabase();
  db.siteSettings = { ...db.siteSettings, ...req.body };
  writeDatabase(db);
  logActivity('Admin', 'Updated Site Settings', 'Global platform parameters modified');
  res.json(db.siteSettings);
});

export default app;

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[LIMO Backend] Server listening on http://localhost:${PORT}`);
  });
}

