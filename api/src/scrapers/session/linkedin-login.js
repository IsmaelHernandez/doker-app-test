import path from 'path';
import fs from 'fs';
import { chromium } from 'playwright';

const SESSION_DIR = path.resolve('data', 'sessions');
const SESSION_PATH = path.join(SESSION_DIR, 'linkedin.json');

async function main() {
  fs.mkdirSync(SESSION_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://www.linkedin.com/login');

  console.log('\nSe abrió una ventana de Chromium.');
  console.log('1. Inicia sesión manualmente en LinkedIn (tu usuario/contraseña, 2FA, etc.).');
  console.log('2. Cuando veas tu feed de LinkedIn, vuelve a esta terminal y presiona ENTER.\n');

  await esperarEnter();

  await context.storageState({ path: SESSION_PATH });
  console.log(`\nSesión guardada en ${SESSION_PATH}`);

  await browser.close();
}

function esperarEnter() {
  return new Promise((resolve) => {
    process.stdin.resume();
    process.stdin.once('data', () => {
      process.stdin.pause();
      resolve();
    });
  });
}

main();