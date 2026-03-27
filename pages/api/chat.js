// In-memory cache (resets on cold start, ~15min on Vercel free tier)
const CACHE = new Map();
const MAX_CACHE = 200;

export const config = { api: { responseLimit: false } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { messages, system, stream } = req.body;

  // Cache key: question text only
  const question = (messages?.[0]?.content || '').slice(-300).trim().toLowerCase();

  // Cache hit (non-streaming only)
  if (!stream && CACHE.has(question)) {
    return res.status(200).json(CACHE.get(question));
  }

  const apiBody = {
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1400,
    system,
    messages,
    tools: [{ type: 'web_search_20250305', name: 'web_search' }],
  };

  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': process.env.ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01',
  };

  // --- STREAMING MODE ---
  if (stream) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    try {
      const upstream = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers,
        body: JSON.stringify({ ...apiBody, stream: true }),
      });
      const reader = upstream.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(decoder.decode(value, { stream: true }));
      }
    } catch (err) {
      res.write('data: {"type":"error","message":"' + err.message + '"}\n\n');
    } finally {
      res.end();
    }
    return;
  }

  // --- NON-STREAMING MODE (cached) ---
  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers,
      body: JSON.stringify(apiBody),
    });
    const data = await resp.json();
    if (!data.error) {
      CACHE.set(question, data);
      if (CACHE.size > MAX_CACHE) CACHE.delete(CACHE.keys().next().value);
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
}
