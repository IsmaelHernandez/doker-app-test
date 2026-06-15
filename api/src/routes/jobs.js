import { Router } from 'express';
import { db } from '../db/index.js';

const router = Router();

const listJobs = db.prepare('SELECT * FROM jobs ORDER BY created_at DESC');

// GET /api/jobs -> vacantes guardadas en la base de datos
router.get('/', (req, res) => {
  res.json({ jobs: listJobs.all() });
});

export default router;