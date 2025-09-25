'use client';
import { useState } from 'react';

export default function Admin() {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [status, setStatus] = useState('');

  async function ingest() {
    setStatus('Uploading…');
    const res = await fetch('/api/ingest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, text })
    });
    const data = await res.json();
    setStatus(res.ok ? `Ingested chunks: ${data.chunks}` : `Error: ${data.error}`);
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-3">
      <h1 className="text-2xl font-semibold">Ingest content</h1>
      <input
        className="w-full border rounded px-3 py-2"
        placeholder="Title (e.g., Resume / Projects)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full h-64 border rounded px-3 py-2"
        placeholder="Paste Markdown or text…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={ingest} className="px-4 py-2 rounded bg-black text-white">Ingest</button>
      <div>{status}</div>
    </main>
  );
}
