import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini AI lazily
  let aiClient: GoogleGenAI | null = null;
  function getGemini(): GoogleGenAI | null {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return aiClient;
  }

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'Liga Online FC 27' });
  });

  // AI Tactical Analysis / Match Commentary Generator
  app.post('/api/ai-commentary', async (req, res) => {
    try {
      const { homeTeam, awayTeam, homeGoals, awayGoals, scorers } = req.body;
      const ai = getGemini();

      if (!ai) {
        return res.json({
          commentary: `¡Gran partido entre ${homeTeam} y ${awayTeam}! Finalizó con marcador de ${homeGoals} - ${awayGoals}. ¡Sigan así en la Liga FC 27!`
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Eres un narrador deportivo entusiasta de EA Sports FC 27. Escribe una crónica corta y emocionante (2 párrafos) en español sobre el partido entre ${homeTeam} (${homeGoals}) y ${awayTeam} (${awayGoals}). Goleadores: ${scorers}. Usa tono épico de EA FC 27.`
      });

      res.json({ commentary: response.text });
    } catch (err: any) {
      console.error('Gemini error:', err);
      res.json({
        commentary: 'Crónica generada automáticamente por los comisarios de la Liga FC 27.'
      });
    }
  });

  // Vite Middleware for Dev vs Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server FC 27 running on http://localhost:${PORT}`);
  });
}

startServer();
