import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Initialize Gemini safely
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Sales pitch / Proposal generation API
app.post('/api/pitch', async (req, res) => {
  try {
    if (!ai) {
      return res.status(400).json({ 
        error: 'Gemini API key is missing or invalid. Please configure your GEMINI_API_KEY in the Secrets panel.' 
      });
    }

    const { projectName, clientNiche, keyPoints, tone } = req.body;
    
    const prompt = `You are an elite, persuasive freelance sales engineer and business strategist. 
Write a highly customized, ultra-premium, professional cold proposal email to a potential client who operates in the "${clientNiche}" niche.
Use my highly successful project "${projectName}" as a stunning case study of what I can engineer for their business.

Include these specific user focus points if provided: "${keyPoints || 'None specified'}".
Tone parameters: "${tone || 'Professional, authoritative & highly persuasive'}".

Return the response strictly as a JSON object with these exact fields:
{
  "subjectLine": "A compelling, high-open-rate subject line tailored to the ${clientNiche} niche",
  "salutation": "A warm, high-end greeting",
  "intro": "An empathetic hook highlighting current market challenges and opportunities specific to the ${clientNiche} niche",
  "caseStudy": "A detailed, impressive breakdown of how the ${projectName} project was engineered. Reference its metrics (performance score, UX speed, customer flow) and connect it directly to how a custom build will solve their niche challenges",
  "cta": "A low-friction, high-value invitation for a complimentary technical/UX strategy call",
  "signoff": "A polished signature template with placeholder fields"
}

Ensure the response contains only the JSON structure, with no markdown code fences or backticks.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('No content returned from Gemini API');
    }

    const parsed = JSON.parse(text.trim());
    res.json(parsed);
  } catch (error: any) {
    console.error('Gemini Pitch Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate proposal pitch.' });
  }
});

// Serve frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  // In development, use Vite dev server as middleware
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`[Server] Portfolio backend online at http://localhost:${PORT}`);
});
