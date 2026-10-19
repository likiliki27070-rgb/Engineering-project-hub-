import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db/database.js';
import { User, Role } from '../types.js';
import { generateToken, authenticate, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

function sanitizeUser(user: User) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

// POST /api/auth/register
router.post('/register', (req, res): void => {
  const { name, username, email, password, role = 'USER', engineeringDomain, skills = [] } = req.body;

  if (!name || !username || !email || !password) {
    res.status(400).json({ error: 'Name, username, email, and password are required.' });
    return;
  }

  const existingEmail = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingEmail) {
    res.status(400).json({ error: 'An account with this email address already exists.' });
    return;
  }

  const existingUsername = db.users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (existingUsername) {
    res.status(400).json({ error: 'This username is already taken. Please choose another.' });
    return;
  }

  const allowedRoles: Role[] = ['USER', 'DEVELOPER'];
  const finalRole: Role = allowedRoles.includes(role) ? role : 'USER';

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);

  const newUser: User = {
    id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: name.trim(),
    username: username.trim().toLowerCase(),
    email: email.trim().toLowerCase(),
    passwordHash,
    role: finalRole,
    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
    engineeringDomain: engineeringDomain || 'General Engineering',
    skills: Array.isArray(skills) ? skills : [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.users.push(newUser);

  // Send welcome notification
  db.notifications.push({
    id: `notif-${Date.now()}`,
    userId: newUser.id,
    title: 'Welcome to LIMO Hub!',
    message: `Account created successfully with ${finalRole} role. Discover and explore engineering projects.`,
    type: 'info',
    read: false,
    createdAt: new Date().toISOString()
  });

  db.logActivity(newUser.id, newUser.name, 'USER_REGISTERED', `Registered new account as ${finalRole}`);
  db.save();

  const token = generateToken(newUser);
  res.status(201).json({
    message: 'Registration successful',
    token,
    user: sanitizeUser(newUser)
  });
});

// POST /api/auth/login
router.post('/login', (req, res): void => {
  const { identifier, password } = req.body; // identifier can be email or username

  if (!identifier || !password) {
    res.status(400).json({ error: 'Identifier (email or username) and password are required.' });
    return;
  }

  const cleanId = identifier.trim().toLowerCase();
  const user = db.users.find(u => u.email.toLowerCase() === cleanId || u.username.toLowerCase() === cleanId);

  if (!user) {
    res.status(401).json({ error: 'Invalid email/username or password.' });
    return;
  }

  const isMatch = bcrypt.compareSync(password, user.passwordHash);
  if (!isMatch) {
    res.status(401).json({ error: 'Invalid email/username or password.' });
    return;
  }

  db.logActivity(user.id, user.name, 'USER_LOGIN', `Logged into LIMO platform.`);
  db.save();

  const token = generateToken(user);
  res.json({
    message: 'Login successful',
    token,
    user: sanitizeUser(user)
  });
});

// GET /api/auth/me
router.get('/me', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  const bookmarksCount = db.bookmarks.filter(b => b.userId === req.user!.id).length;
  const likesCount = db.likes.filter(l => l.userId === req.user!.id).length;
  const projectsCount = db.projects.filter(p => p.developerId === req.user!.id).length;

  res.json({
    user: sanitizeUser(req.user),
    stats: {
      bookmarksCount,
      likesCount,
      projectsCount
    }
  });
});

// PUT /api/auth/profile
router.put('/profile', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  const { name, bio, engineeringDomain, skills, avatar, githubUrl, linkedinUrl, websiteUrl } = req.body;

  const user = db.users.find(u => u.id === req.user!.id);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  if (name && name.trim()) user.name = name.trim();
  if (bio !== undefined) user.bio = bio;
  if (engineeringDomain !== undefined) user.engineeringDomain = engineeringDomain;
  if (Array.isArray(skills)) user.skills = skills;
  if (avatar) user.avatar = avatar;
  if (githubUrl !== undefined) user.githubUrl = githubUrl;
  if (linkedinUrl !== undefined) user.linkedinUrl = linkedinUrl;
  if (websiteUrl !== undefined) user.websiteUrl = websiteUrl;

  user.updatedAt = new Date().toISOString();

  // If user is a creator or developer, also update their references
  const creator = db.creators.find(c => c.name.toLowerCase() === user.name.toLowerCase() || c.id === user.id);
  if (creator) {
    creator.bio = user.bio || creator.bio;
    creator.avatar = user.avatar;
    creator.skills = user.skills;
    creator.githubUrl = user.githubUrl;
    creator.linkedinUrl = user.linkedinUrl;
  }

  db.logActivity(user.id, user.name, 'PROFILE_UPDATED', 'Updated personal profile settings');
  db.save();

  res.json({
    message: 'Profile updated successfully',
    user: sanitizeUser(user)
  });
});

// POST /api/auth/forgot-password
router.post('/forgot-password', (req, res): void => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Email is required.' });
    return;
  }

  const user = db.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  // Always return friendly response to prevent email enumeration
  res.json({
    message: 'If an account with that email exists, password reset instructions have been dispatched.'
  });
});

export default router;
