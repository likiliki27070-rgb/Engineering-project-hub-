import { readDatabase } from '../server/database.js';

export default function handler(req, res) {
  const db = readDatabase();
  res.status(200).json(db.categories || []);
}
