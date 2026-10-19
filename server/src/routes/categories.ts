import { Router, Response } from 'express';
import { db } from '../db/database.js';
import { Category } from '../types.js';
import { authenticate, requireRole, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
}

// GET /api/categories
router.get('/', (req, res): void => {
  const categoriesWithCounts = db.categories.map(c => {
    const count = db.projects.filter(p =>
      p.status === 'PUBLISHED' &&
      (p.category.toLowerCase() === c.name.toLowerCase() || slugify(p.category) === c.slug)
    ).length;
    return {
      ...c,
      projectCount: count
    };
  });

  res.json({ categories: categoriesWithCounts });
});

// POST /api/categories - Admin add category
router.post('/', authenticate, requireRole('ADMIN'), (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user!;
  const { name, description, icon = 'Layers' } = req.body;

  if (!name || !name.trim()) {
    res.status(400).json({ error: 'Category name is required.' });
    return;
  }

  const slug = slugify(name);
  if (db.categories.some(c => c.slug === slug || c.name.toLowerCase() === name.trim().toLowerCase())) {
    res.status(400).json({ error: 'A category with this name already exists.' });
    return;
  }

  const newCat: Category = {
    id: `cat-${Date.now()}`,
    name: name.trim(),
    slug,
    description: description || `Engineering projects focusing on ${name.trim()}.`,
    icon
  };

  db.categories.push(newCat);
  db.logActivity(user.id, user.name, 'CATEGORY_ADDED', `Created category "${newCat.name}"`);
  db.save();

  res.status(201).json({ category: newCat });
});

// PUT /api/categories/:id - Admin update category
router.put('/:id', authenticate, requireRole('ADMIN'), (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const user = req.user!;
  const category = db.categories.find(c => c.id === id);

  if (!category) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }

  const { name, description, icon } = req.body;
  if (name) {
    category.name = name.trim();
    category.slug = slugify(name);
  }
  if (description !== undefined) category.description = description;
  if (icon) category.icon = icon;

  db.logActivity(user.id, user.name, 'CATEGORY_UPDATED', `Updated category "${category.name}"`);
  db.save();

  res.json({ category });
});

// DELETE /api/categories/:id - Admin delete category
router.delete('/:id', authenticate, requireRole('ADMIN'), (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const user = req.user!;
  const index = db.categories.findIndex(c => c.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }

  const removed = db.categories.splice(index, 1)[0];
  db.logActivity(user.id, user.name, 'CATEGORY_DELETED', `Deleted category "${removed.name}"`);
  db.save();

  res.json({ message: 'Category deleted successfully' });
});

export default router;
