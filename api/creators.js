import { readDatabase } from '../server/database.js';

export default function handler(req, res) {
  const db = readDatabase();
  const creators = (db.creators || [])
    .filter(c => c.isVisible !== false)
    .sort((a, b) => (a.order || 99) - (b.order || 99));
  res.status(200).json(creators);
}
