import OpenAI from 'openai';

let _client: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  if (_client) return _client;
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    // Don't throw at import time; only when route is actually called.
    throw new Error('Server misconfigured: OPENAI_API_KEY is missing');
  }
  _client = new OpenAI({ apiKey: key });
  return _client;
}
