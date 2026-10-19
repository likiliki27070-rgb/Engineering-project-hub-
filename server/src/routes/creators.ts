import { Router, Response } from 'express';
import { db } from '../db/database.js';
import { Creator } from '../types.js';
import { authenticate, requireRole, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/creators - Public endpoint for About Us page
router.get('/', (req, res): void => {
  const visibleCreators = db.creators
    .filter(c => c.isVisible)
    .sort((a, b) => a.order - b.order);

  res.json({ creators: visibleCreators });
});

// GET /api/creators/admin/all - Admin view including invisible
router.get('/admin/all', authenticate, requireRole('ADMIN'), (req, res): void => {
  const allCreators = [...db.creators].sort((a, b) => a.order - b.order);
  res.json({ creators: allCreators });
});

// POST /api/creators - Admin add creator
router.post('/', authenticate, requireRole('ADMIN'), (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user!;
  const {
    name,
    role,
    bio,
    avatar,
    skills = [],
    technologies = [],
    contribution,
    githubUrl,
    linkedinUrl,
    portfolioUrl,
    order,
    isVisible = true
  } = req.body;

  if (!name || !role || !bio || !contribution) {
    res.status(400).json({ error: 'Name, role, bio, and contribution are required fields.' });
    return;
  }

  const newCreator: Creator = {
    id: `cr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: name.trim(),
    role: role.trim(),
    bio: bio.trim(),
    avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
    skills: Array.isArray(skills) ? skills : [],
    technologies: Array.isArray(technologies) ? technologies : [],
    contribution: contribution.trim(),
    githubUrl,
    linkedinUrl,
    portfolioUrl,
    order: Number(order) || (db.creators.length + 1),
    isVisible: Boolean(isVisible),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.creators.push(newCreator);
  db.logActivity(user.id, user.name, 'CREATOR_ADDED', `Added creator profile for "${newCreator.name}" (${newCreator.role})`);
  db.save();

  res.status(201).json({
    message: 'Creator profile added successfully',
    creator: newCreator
  });
});

// PUT /api/creators/:id - Admin edit creator
router.put('/:id', authenticate, requireRole('ADMIN'), (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const user = req.user!;
  const creator = db.creators.find(c => c.id === id);

  if (!creator) {
    res.status(404).json({ error: 'Creator not found' });
    return;
  }

  const {
    name,
    role,
    bio,
    avatar,
    skills,
    technologies,
    contribution,
    githubUrl,
    linkedinUrl,
    portfolioUrl,
    order,
    isVisible
  } = req.body;

  if (name) creator.name = name.trim();
  if (role) creator.role = role.trim();
  if (bio) creator.bio = bio.trim();
  if (avatar) creator.avatar = avatar;
  if (skills) creator.skills = Array.isArray(skills) ? skills : [];
  if (technologies) creator.technologies = Array.isArray(technologies) ? technologies : [];
  if (contribution) creator.contribution = contribution.trim();
  if (githubUrl !== undefined) creator.githubUrl = githubUrl;
  if (linkedinUrl !== undefined) creator.linkedinUrl = linkedinUrl;
  if (portfolioUrl !== undefined) creator.portfolioUrl = portfolioUrl;
  if (order !== undefined) creator.order = Number(order);
  if (isVisible !== undefined) creator.isVisible = Boolean(isVisible);

  creator.updatedAt = new Date().toISOString();

  db.logActivity(user.id, user.name, 'CREATOR_UPDATED', `Updated creator profile for "${creator.name}"`);
  db.save();

  res.json({
    message: 'Creator profile updated successfully',
    creator
  });
});

// DELETE /api/creators/:id - Admin remove creator
router.delete('/:id', authenticate, requireRole('ADMIN'), (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const user = req.user!;
  const index = db.creators.findIndex(c => c.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Creator not found' });
    return;
  }

  const removed = db.creators.splice(index, 1)[0];
  db.logActivity(user.id, user.name, 'CREATOR_DELETED', `Removed creator profile for "${removed.name}"`);
  db.save();

  res.json({ message: 'Creator removed successfully' });
});

export default router;
