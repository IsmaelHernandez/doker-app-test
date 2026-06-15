import { Router } from 'express';
import { db, getProfile, getJobsWithoutScore, updateJobMatchScore } from '../db/index.js';
import { evaluateMatch } from '../services/matchEvaluator.js';

const router = Router();

const listJobs = db.prepare('SELECT * FROM jobs ORDER BY created_at DESC');

// GET /api/jobs -> vacantes guardadas en la base de datos
router.get('/', (req, res) => {
  res.json({ jobs: listJobs.all() });
});

// POST /api/jobs/evaluate  { todas?: boolean }
// Calcula match_score para las vacantes que aún no lo tienen.
// Si "todas" es true, recalcula también las que ya tenían un score (ej. cambiaste el perfil).
router.post('/evaluate', async (req, res) => {
  const profile = getProfile();

  if (!profile) {
    return res.status(400).json({ error: 'Primero debes guardar un perfil (CV o prompt).' });
  }

  const { todas } = req.body ?? {};
  const pendientes = todas ? listJobs.all() : getJobsWithoutScore();
  let evaluadas = 0;

  for (const job of pendientes) {
    const score = await evaluateMatch(profile.content, job);
    updateJobMatchScore(job.id, score);
    evaluadas += 1;
  }

  res.json({ evaluadas, total: pendientes.length, jobs: listJobs.all() });
});

export default router;