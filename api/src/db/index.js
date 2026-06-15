import path from 'path';
import fs from 'fs';
import { DatabaseSync } from 'node:sqlite';

const DATA_DIR = path.resolve('data');
const DB_PATH = path.join(DATA_DIR, 'jobs.db');

fs.mkdirSync(DATA_DIR, { recursive: true });

export const db = new DatabaseSync(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    source_type TEXT NOT NULL,
    file_name TEXT,
    content TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    company TEXT,
    link TEXT NOT NULL UNIQUE,
    description TEXT,
    source TEXT NOT NULL,
    match_score REAL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS search_config (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    puesto TEXT,
    ubicacion TEXT,
    remoto INTEGER NOT NULL DEFAULT 0,
    cron_enabled INTEGER NOT NULL DEFAULT 0,
    cron_schedule TEXT
  );
`);

const insertJobStmt = db.prepare(`
  INSERT OR IGNORE INTO jobs (title, company, link, description, source, match_score, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const updateJobMatchScoreStmt = db.prepare('UPDATE jobs SET match_score = ? WHERE id = ?');

const getProfileStmt = db.prepare('SELECT * FROM profile WHERE id = 1');

const jobsWithoutScoreStmt = db.prepare('SELECT * FROM jobs WHERE match_score IS NULL ORDER BY created_at DESC');

/**
 * Inserta una vacante si su "link" no existe todavía.
 * @returns {{ inserted: boolean, id: number|null }} id de la fila si se insertó, null si era un duplicado.
 */
export function insertJob(vacante) {
  const result = insertJobStmt.run(
    vacante.title,
    vacante.company ?? null,
    vacante.link,
    vacante.description ?? null,
    vacante.source,
    vacante.match_score ?? null,
    new Date().toISOString(),
  );

  return { inserted: result.changes > 0, id: result.changes > 0 ? Number(result.lastInsertRowid) : null };
}

/**
 * Actualiza el porcentaje de compatibilidad (0-100) de una vacante.
 */
export function updateJobMatchScore(id, matchScore) {
  updateJobMatchScoreStmt.run(matchScore, id);
}

/**
 * @returns {object | undefined} el perfil del candidato (CV o prompt), si existe.
 */
export function getProfile() {
  return getProfileStmt.get();
}

/**
 * @returns {object[]} vacantes guardadas que aún no tienen match_score calculado.
 */
export function getJobsWithoutScore() {
  return jobsWithoutScoreStmt.all();
}