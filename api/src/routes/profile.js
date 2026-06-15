import { Router } from 'express';
import multer from 'multer';
import { PDFParse } from 'pdf-parse';
import { db } from '../db/index.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('El archivo debe ser un PDF.'));
    }
    cb(null, true);
  },
});

const upsertProfile = db.prepare(`
  INSERT INTO profile (id, source_type, file_name, content, updated_at)
  VALUES (1, ?, ?, ?, ?)
  ON CONFLICT (id) DO UPDATE SET
    source_type = excluded.source_type,
    file_name = excluded.file_name,
    content = excluded.content,
    updated_at = excluded.updated_at
`);

const getProfile = db.prepare('SELECT * FROM profile WHERE id = 1');

// GET /api/profile -> perfil actual (CV o prompt) del candidato
router.get('/', (req, res) => {
  const profile = getProfile.get();
  res.json({ profile: profile ?? null });
});

// POST /api/profile/cv -> subir y procesar un CV en PDF
router.post('/cv', upload.single('cv'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Se requiere el archivo "cv" en formato PDF.' });
  }

  try {
    const parser = new PDFParse({ data: req.file.buffer });
    const { text } = await parser.getText();
    await parser.destroy();

    if (!text || !text.trim()) {
      return res.status(422).json({ error: 'No se pudo extraer texto del PDF.' });
    }

    upsertProfile.run('cv', req.file.originalname, text.trim(), new Date().toISOString());

    res.json({ profile: getProfile.get() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/profile/prompt -> describir el perfil/puesto buscado en texto libre
router.post('/prompt', (req, res) => {
  const { text } = req.body ?? {};

  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'El campo "text" es requerido.' });
  }

  upsertProfile.run('prompt', null, text.trim(), new Date().toISOString());

  res.json({ profile: getProfile.get() });
});

export default router;