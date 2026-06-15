import path from 'path';
import fs from 'fs';
import { chromium } from 'playwright';

export const id = 'linkedin';
export const label = 'LinkedIn';

const SESSION_PATH = path.resolve('data', 'sessions', 'linkedin.json');

/**
 * @typedef {Object} Vacante
 * @property {string} title
 * @property {string} company
 * @property {string} link
 * @property {string} description
 * @property {string} source
 */

export function tieneSesion() {
  return fs.existsSync(SESSION_PATH);
}

/**
 * Busca vacantes en LinkedIn usando una sesión guardada previamente
 * (ver src/scrapers/session/linkedin-login.js).
 *
 * @param {{ puesto: string, ubicacion?: string, remoto?: boolean }} criterios
 * @param {{ headless?: boolean, limite?: number }} [opciones]
 * @returns {Promise<Vacante[]>}
 */
export async function buscar({ puesto, ubicacion = '', remoto = false }, { headless = true, limite = 10 } = {}) {
  if (!puesto) {
    throw new Error('"puesto" es requerido para buscar en LinkedIn.');
  }

  if (!tieneSesion()) {
    throw new Error(
      'No hay sesión guardada de LinkedIn. Ejecuta "npm run session:linkedin" e inicia sesión manualmente.'
    );
  }

  const browser = await chromium.launch({ headless });
  const context = await browser.newContext({ storageState: SESSION_PATH });
  const page = await context.newPage();

  try {
    const url = construirUrlBusqueda({ puesto, ubicacion, remoto });
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Selector de la lista de resultados de la búsqueda de empleos.
    // LinkedIn cambia su HTML con frecuencia: si esto deja de funcionar,
    // hay que inspeccionar la página y actualizar los selectores.
    await page.waitForSelector('ul.jobs-search__results-list li', { timeout: 15000 });

    const vacantesCrudas = await page.$$eval(
      'ul.jobs-search__results-list li',
      (items, limite) =>
        items.slice(0, limite).map((item) => ({
          title: item.querySelector('h3.base-search-card__title')?.textContent?.trim() ?? '',
          company: item.querySelector('h4.base-search-card__subtitle')?.textContent?.trim() ?? '',
          link: item.querySelector('a.base-card__full-link')?.href ?? '',
        })),
      limite
    );

    return vacantesCrudas
      .filter((vacante) => vacante.link)
      .map((vacante) => ({ ...vacante, description: '', source: id }));
  } finally {
    await browser.close();
  }
}

function construirUrlBusqueda({ puesto, ubicacion, remoto }) {
  const params = new URLSearchParams({ keywords: puesto });

  if (ubicacion) params.set('location', ubicacion);
  if (remoto) params.set('f_WT', '2'); // Filtro "Remoto" en LinkedIn

  return `https://www.linkedin.com/jobs/search/?${params.toString()}`;
}