const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

// Example secure endpoint that uses a server-only secret
app.get('/api/config/supabase', (_req, res) => {
  const projectUrl = process.env.SUPABASE_PROJECT_URL;
  if (!projectUrl) {
    console.error('ERROR: SUPABASE_PROJECT_URL missing');
    return res.status(500).json({ error: 'Server config missing' });
  }
  res.json({ url: projectUrl });
});

// Proxy Gemini requests securely (server holds the API key)
app.post('/api/ai/gemini', async (req, res) => {
  try {
    console.log('Received POST to /api/ai/gemini with body:', req.body);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('ERROR: GEMINI_API_KEY missing on server');
      return res.status(500).json({ error: 'GEMINI_API_KEY missing on server' });
    }

    const { contents, systemInstruction } = req.body || {};
    if (!contents) {
      console.error('ERROR: "contents" missing in request body');
      return res.status(400).json({ error: 'contents required' });
    }

    const url =
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=' +
      apiKey;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents, systemInstruction }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API returned error:', data);
      return res.status(response.status).json(data);
    }

    console.log('Gemini API response:', data);
    res.status(200).json(data);
  } catch (err) {
    console.error('Exception in /api/ai/gemini:', err);
    res.status(500).json({ error: 'Gemini proxy error', details: err.message });
  }
});

// In production, serve the React build
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(process.cwd(), 'build');
  app.use(express.static(buildPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});