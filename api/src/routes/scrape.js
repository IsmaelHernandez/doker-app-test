import { Router } from 'express';
import { getScraper } from '../scrapers/index.js';
import { insertJob, getProfile, updateJobMatchScore } from '../db/index.js';
import { evaluateMatch } from '../services/matchEvaluator.js';

const router = Router();

// POST /api/scrape/:source  { puesto, ubicacion?, remoto?, limite? }
router.post('/:source', async (req, res) => {
  const { source } = req.params;
  const { puesto, ubicacion, remoto, limite } = req.body ?? {};

  if (!puesto) {
    return res.status(400).json({ error: 'El campo "puesto" es requerido.' });
  }

  let scraper;
  try {
    scraper = getScraper(source);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }

  try {
    const vacantes = await scraper.buscar({ puesto, ubicacion, remoto }, { limite });
    res.json({ source, total: vacantes.length, vacantes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/scrape/:source/run  { puesto, ubicacion?, remoto?, limite? }
// Ejecuta el scraper y guarda las vacantes nuevas en la base de datos.
router.post('/:source/run', async (req, res) => {
  const { source } = req.params;
  const { puesto, ubicacion, remoto, limite } = req.body ?? {};

  if (!puesto) {
    return res.status(400).json({ error: 'El campo "puesto" es requerido.' });
  }

  let scraper;
  try {
    scraper = getScraper(source);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }

  try {
    const vacantes = await scraper.buscar({ puesto, ubicacion, remoto }, { limite });

    const nuevas = [];
    for (const vacante of vacantes) {
      const { inserted, id } = insertJob(vacante);
      if (inserted) nuevas.push({ ...vacante, id });
    }

    const profile = getProfile();
    if (profile) {
      for (const job of nuevas) {
        job.match_score = await evaluateMatch(profile.content, job);
        updateJobMatchScore(job.id, job.match_score);
      }
    }

    res.json({ source, total: vacantes.length, nuevas: nuevas.length, vacantes: nuevas });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;