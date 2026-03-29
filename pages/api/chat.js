const CACHE = new Map();
const MAX_CACHE = 200;

export const config = { api: { responseLimit: false } };

async function logQuestion(question, country, lang) {
  try {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;
    if (!url || !key) return;
    await fetch(url + "/rest/v1/questions", {
      method: "POST",
      headers: {
        "apikey": key,
        "Authorization": "Bearer " + key,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({ question: question.slice(0, 500), country: country || "tg", lang: lang || "fr" })
    });
  } catch (e) {
    // silent fail - logging should never break the app
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { messages, system, stream, country, lang } = req.body;
  const question = (messages && messages[0] && messages[0].content || "").slice(-500).trim();
  const cacheKey = question.toLowerCase().slice(-300);

  if (!stream && CACHE.has(cacheKey)) {
    return res.status(200).json(CACHE.get(cacheKey));
  }

  // Log question async - non-blocking
  if (question) logQuestion(question, country, lang);

  const apiBody = {
    model: "claude-sonnet-4-20250514",
    max_tokens: 3000,
    system: system,
    messages: messages,
    tools: [{ type: "web_search_20250305", name: "web_search" }],
  };

  const headers = {
    "Content-Type": "application/json",
    "x-api-key": process.env.ANTHROPIC_API_KEY,
    "anthropic-version": "2023-06-01",
  };

  if (stream) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    try {
      const streamBody = Object.assign({}, apiBody, { stream: true });
      const upstream = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(streamBody),
      });
      const reader = upstream.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const chunk = await reader.read();
        if (chunk.done) break;
        res.write(decoder.decode(chunk.value, { stream: true }));
      }
    } catch (err) {
      const errMsg = "data: " + JSON.stringify({ type: "error", message: err.message }) + "\n\n";
      res.write(errMsg);
    } finally {
      res.end();
    }
    return;
  }

  try {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(apiBody),
    });
    const data = await resp.json();
    if (!data.error) {
      CACHE.set(cacheKey, data);
      if (CACHE.size > MAX_CACHE) CACHE.delete(CACHE.keys().next().value);
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
                  }
