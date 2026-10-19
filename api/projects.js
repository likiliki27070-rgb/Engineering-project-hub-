import { readDatabase } from '../server/database.js';

export default function handler(req, res) {
  const db = readDatabase();
  let projects = [...(db.projects || [])];
  const { search, category, technology, difficulty, sort, status, featured, developerId } = req.query || {};

  if (status) {
    projects = projects.filter(p => p.status?.toLowerCase() === status.toLowerCase());
  } else if (!developerId && !req.query?.allStatus) {
    projects = projects.filter(p => p.status === 'Published');
  }

  if (developerId) {
    projects = projects.filter(p => p.developer && p.developer.id === developerId);
  }

  if (featured === 'true') {
    projects = projects.filter(p => p.isFeatured);
  }

  if (category && category !== 'All') {
    projects = projects.filter(p => 
      p.category?.toLowerCase() === category.toLowerCase() || 
      p.engineeringDomain?.toLowerCase() === category.toLowerCase()
    );
  }

  if (technology && technology !== 'All') {
    projects = projects.filter(p => 
      p.technologies && p.technologies.some(t => t.toLowerCase() === technology.toLowerCase())
    );
  }

  if (difficulty && difficulty !== 'All') {
    projects = projects.filter(p => p.difficulty?.toLowerCase() === difficulty.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    projects = projects.filter(p => 
      p.title?.toLowerCase().includes(q) ||
      p.shortDescription?.toLowerCase().includes(q) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(q))) ||
      (p.technologies && p.technologies.some(t => t.toLowerCase().includes(q))) ||
      (p.developer && p.developer.name?.toLowerCase().includes(q))
    );
  }

  if (sort === 'most-viewed') {
    projects.sort((a, b) => (b.views || 0) - (a.views || 0));
  } else if (sort === 'most-liked') {
    projects.sort((a, b) => (b.likes || 0) - (a.likes || 0));
  } else if (sort === 'most-bookmarked') {
    projects.sort((a, b) => (b.bookmarks || 0) - (a.bookmarks || 0));
  } else if (sort === 'a-z') {
    projects.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    projects.sort((a, b) => new Date(b.createdDate || 0) - new Date(a.createdDate || 0));
  }

  res.status(200).json(projects);
}
