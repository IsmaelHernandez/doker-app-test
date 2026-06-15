import { chromium } from 'playwright';

export const id = 'occ';
export const label = 'OCC Mundial';

/**
 * OCC no requiere sesión iniciada para ver resultados de búsqueda,
 * así que este scraper no depende de un storageState.
 *
 * Selectores verificados en vivo (jun 2026) contra la grilla de
 * resultados de https://www.occ.com.mx/empleos/de-<puesto>/...
 * Cada tarjeta es un <div class="card-job-offer" data-id="...">.
 * El link de detalle se construye a partir de ese data-id:
 * https://www.occ.com.mx/empleo/oferta/<data-id>
 */
const SELECTORES = {
  tarjeta: '.card-job-offer',
  titulo: 'h2',
  empresa: '.line-clamp-title a',
};

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

export async function buscar({ puesto, ubicacion = '', remoto = false }, { headless = true, limite = 10 } = {}) {
  if (!puesto) {
    throw new Error('Se requiere el parámetro "puesto" para buscar en OCC.');
  }

  const browser = await chromium.launch({ headless });

  try {
    const context = await browser.newContext({
      userAgent: USER_AGENT,
      locale: 'es-MX',
      viewport: { width: 1366, height: 900 },
    });
    const page = await context.newPage();

    const url = construirUrlBusqueda({ puesto, ubicacion, remoto });
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    await page.waitForSelector(SELECTORES.tarjeta, { timeout: 15000 });

    const vacantes = await page.$$eval(
      SELECTORES.tarjeta,
      (tarjetas, selectores) =>
        tarjetas.map((tarjeta) => {
          const tituloEl = tarjeta.querySelector(selectores.titulo);
          const empresaEl = tarjeta.querySelector(selectores.empresa);
          const offerId = tarjeta.getAttribute('data-id');

          return {
            title: tituloEl ? tituloEl.textContent.trim() : '',
            company: empresaEl ? empresaEl.textContent.trim() : '',
            link: offerId ? `https://www.occ.com.mx/empleo/oferta/${offerId}` : '',
          };
        }),
      SELECTORES,
    );

    return vacantes
      .filter((vacante) => vacante.link && vacante.title)
      .slice(0, limite)
      .map((vacante) => ({ ...vacante, description: '', source: id }));
  } finally {
    await browser.close();
  }
}

function construirUrlBusqueda({ puesto, ubicacion }) {
  const slugPuesto = slugificar(puesto);
  const base = `https://www.occ.com.mx/empleos/de-${slugPuesto}`;

  if (ubicacion) {
    return `${base}/en-${slugificar(ubicacion)}/`;
  }

  return `${base}/`;
}

function slugificar(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}