import * as linkedin from './linkedin.js';
import * as occ from './occ.js';

export const scrapers = {
  [linkedin.id]: linkedin,
  [occ.id]: occ,
};

/**
 * @param {string} source
 * @returns {typeof linkedin | typeof occ}
 */
export function getScraper(source) {
  const scraper = scrapers[source];

  if (!scraper) {
    const disponibles = Object.keys(scrapers).join(', ');
    throw new Error(`Scraper no soportado: "${source}". Disponibles: ${disponibles}`);
  }

  return scraper;
}