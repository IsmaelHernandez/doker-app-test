/**
 * Evaluador de compatibilidad entre el perfil del candidato (CV o prompt)
 * y una vacante. Devuelve un porcentaje 0-100.
 *
 * Proveedor configurable vía variables de entorno:
 *   - AI_PROVIDER=anthropic + ANTHROPIC_API_KEY
 *   - AI_PROVIDER=openai + OPENAI_API_KEY
 *   - sin configurar -> usa un cálculo local por coincidencia de palabras clave.
 */

const STOPWORDS = new Set([
  'para', 'con', 'los', 'las', 'una', 'uno', 'del', 'que', 'por', 'sus',
  'este', 'esta', 'esto', 'son', 'como', 'mas', 'más', 'pero', 'sobre',
  'entre', 'desde', 'hasta', 'también', 'también', 'todo', 'toda', 'todos',
  'todas', 'muy', 'donde', 'cuando', 'the', 'and', 'for', 'with', 'from',
  'this', 'that', 'have', 'will', 'your', 'you', 'are', 'our',
]);

function tokenizar(texto = '') {
  return new Set(
    texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .match(/[a-z0-9]{3,}/g)
      ?.filter((palabra) => !STOPWORDS.has(palabra)) ?? [],
  );
}

function evaluarLocal(profileText, job) {
  const perfilPalabras = tokenizar(profileText);
  const vacantePalabras = tokenizar(`${job.title} ${job.description ?? ''}`);

  if (vacantePalabras.size === 0) return 0;

  let coincidencias = 0;
  for (const palabra of vacantePalabras) {
    if (perfilPalabras.has(palabra)) coincidencias += 1;
  }

  return Math.round((coincidencias / vacantePalabras.size) * 100);
}

async function evaluarConAnthropic(profileText, job) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001',
      max_tokens: 16,
      messages: [
        {
          role: 'user',
          content: buildPrompt(profileText, job),
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`Anthropic API error: ${res.status}`);
  }

  const data = await res.json();
  const texto = data.content?.[0]?.text ?? '0';
  return clampScore(texto);
}

async function evaluarConOpenAI(profileText, job) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      max_tokens: 16,
      messages: [
        {
          role: 'user',
          content: buildPrompt(profileText, job),
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI API error: ${res.status}`);
  }

  const data = await res.json();
  const texto = data.choices?.[0]?.message?.content ?? '0';
  return clampScore(texto);
}

function buildPrompt(profileText, job) {
  return `Eres un reclutador experto. Compara el perfil de un candidato con una vacante y responde ÚNICAMENTE con un número entero del 0 al 100 que represente el porcentaje de compatibilidad. No agregues texto adicional, símbolos ni explicación.

PERFIL DEL CANDIDATO:
${profileText.slice(0, 4000)}

VACANTE:
Puesto: ${job.title}
Empresa: ${job.company ?? 'No especificada'}
Descripción: ${(job.description ?? '').slice(0, 2000)}`;
}

function clampScore(texto) {
  const numero = parseInt(String(texto).match(/\d+/)?.[0] ?? '0', 10);
  if (Number.isNaN(numero)) return 0;
  return Math.min(100, Math.max(0, numero));
}

/**
 * @param {string} profileText - contenido del CV o prompt del candidato.
 * @param {{ title: string, company?: string, description?: string }} job
 * @returns {Promise<number>} porcentaje de compatibilidad (0-100).
 */
export async function evaluateMatch(profileText, job) {
  const provider =
    process.env.AI_PROVIDER ||
    (process.env.ANTHROPIC_API_KEY ? 'anthropic' : process.env.OPENAI_API_KEY ? 'openai' : 'local');

  try {
    switch (provider) {
      case 'anthropic':
        return await evaluarConAnthropic(profileText, job);
      case 'openai':
        return await evaluarConOpenAI(profileText, job);
      default:
        return evaluarLocal(profileText, job);
    }
  } catch (err) {
    console.error(`Error evaluando compatibilidad con proveedor "${provider}":`, err.message);
    return evaluarLocal(profileText, job);
  }
}