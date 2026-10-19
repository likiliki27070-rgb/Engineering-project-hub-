import { Router, Response } from 'express';
import { db } from '../db/database.js';
import { Technology } from '../types.js';
import { authenticate, requireRole, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
}

// GET /api/technologies
router.get('/', (req, res): void => {
  const techWithCounts = db.technologies.map(t => {
    const count = db.projects.filter(p =>
      p.status === 'PUBLISHED' &&
      p.technologies.some(pt => pt.toLowerCase() === t.name.toLowerCase() || slugify(pt) === t.slug)
    ).length;
    return {
      ...t,
      projectCount: count
    };
  });

  res.json({ technologies: techWithCounts });
});

// POST /api/technologies - Admin add technology
router.post('/', authenticate, requireRole('ADMIN'), (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user!;
  const { name, category = 'General', icon = 'Code' } = req.body;

  if (!name || !name.trim()) {
    res.status(400).json({ error: 'Technology name is required.' });
    return;
  }

  const slug = slugify(name);
  if (db.technologies.some(t => t.slug === slug || t.name.toLowerCase() === name.trim().toLowerCase())) {
    res.status(400).json({ error: 'A technology with this name already exists.' });
    return;
  }

  const newTech: Technology = {
    id: `tech-${Date.now()}`,
    name: name.trim(),
    slug,
    category,
    icon
  };

  db.technologies.push(newTech);
  db.logActivity(user.id, user.name, 'TECH_ADDED', `Created technology "${newTech.name}"`);
  db.save();

  res.status(201).json({ technology: newTech });
});

export default router;
