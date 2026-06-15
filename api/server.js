import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import scrapeRouter from './src/routes/scrape.js';
import profileRouter from './src/routes/profile.js';
import jobsRouter from './src/routes/jobs.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/api/status', (req, res) => {
  res.json({ message: '¡El cerebro del Agente de Empleos está funcionando! 🧠🤖' });
});

// Perfil del candidato (CV en PDF o prompt de texto libre)
app.use('/api/profile', profileRouter);

// Vacantes guardadas que cumplen el umbral de compatibilidad
app.use('/api/jobs', jobsRouter);

// Disparo manual del agente de scraping
app.use('/api/scrape', scrapeRouter);

app.listen(PORT, () => {
  console.log(`Servidor Backend corriendo en http://localhost:${PORT}`);
});
