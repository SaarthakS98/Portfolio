'use client';
import { useState } from 'react';

type Role = 'user' | 'assistant';
type ChatMessage = { role: Role; content: string };

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');

  async function send() {
    // ensure literals stay literals
    const userMsg: ChatMessage = { role: 'user', content: input };
    const next: ChatMessage[] = [...messages, userMsg];

    setMessages(next);
    setInput('');

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: next }),
    });
    const data: { answer?: string } = await res.json();

    // use functional update + literal assertion
    setMessages(prev => [
      ...prev,
      { role: 'assistant', content: data.answer ?? '' } as ChatMessage,
    ]);
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Ask about me</h1>
      <div className="space-y-3 mb-4">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : ''}>
            <div className={`inline-block rounded px-3 py-2 ${m.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              {m.content}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
          placeholder="Ask anything…"
        />
        <button onClick={send} className="px-4 py-2 rounded bg-black text-white">Send</button>
      </div>
    </main>
  );
}
