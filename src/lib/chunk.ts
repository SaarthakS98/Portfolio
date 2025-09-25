export type Chunk = { text: string; heading?: string; ord: number };

export function splitIntoChunks(text: string, maxTokens = 600, overlap = 80): Chunk[] {
  const paras = text.split(/\n{2,}/g).map(p => p.trim()).filter(Boolean);
  const chunks: Chunk[] = [];
  const tok = (s: string) => Math.ceil(s.length / 4);

  let buf: string[] = [];
  let ord = 0;

  for (const p of paras) {
    if (tok([...buf, p].join('\n\n')) > maxTokens && buf.length) {
      chunks.push({ text: buf.join('\n\n'), ord });
      ord += 1;
      // overlap
      const keep: string[] = [];
      let kt = 0;
      for (let i = buf.length - 1; i >= 0 && kt < overlap; i--) {
        keep.unshift(buf[i]);
        kt += tok(buf[i]);
      }
      buf = keep;
    }
    buf.push(p);
  }
  if (buf.length) chunks.push({ text: buf.join('\n\n'), ord });
  return chunks;
}
