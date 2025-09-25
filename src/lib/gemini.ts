import { GoogleGenerativeAI, type GenerativeModel } from '@google/generative-ai';

let _client: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI {
  if (_client) return _client;
  const key = process.env.GOOGLE_API_KEY;
  if (!key) throw new Error('Server misconfigured: GOOGLE_API_KEY is missing');
  _client = new GoogleGenerativeAI(key);
  return _client;
}

export function getGeminiModel(modelName: string, systemInstruction?: string): GenerativeModel {
  const client = getGeminiClient();
  return client.getGenerativeModel(
    systemInstruction ? { model: modelName, systemInstruction } : { model: modelName }
  );
}

export async function embedText(input: string): Promise<number[]> {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({ model: 'text-embedding-004' });
  const res = await model.embedContent(input);
  return res.embedding.values as number[];
}
