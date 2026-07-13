import { useState, useEffect } from 'react'
import type { Note } from './types/Note.ts';

const API_URL = import.meta.env.VITE_BASE_URL ?? 'http://localhost:3000';

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${API_URL}/api/notes`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
    })
      .then(res => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then(data => setNotes(data.notes))
      .catch(e => {
        if (e.name !== 'AbortError') {
          setError(e.message);
          console.error(e);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [])

  return (
    <main className="max-w-4xl mx-auto p-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-brand-heading mb-6 text-center">
          My Notes
        </h1>
      </header>

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-6 bg-brand-bg border border-brand-border rounded-2xl animate-pulse"
            >
              <div className="h-5 bg-brand-border rounded w-3/4 mb-3" />
              <div className="h-3 bg-brand-border rounded w-full mb-2" />
              <div className="h-3 bg-brand-border rounded w-5/6" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500 text-center">
          {error}
        </p>
      )}

      {!loading && !error && notes.length === 0 && (
        <p className="text-sm text-brand-text italic text-center">
          No notes found.
        </p>
      )}

      {!loading && !error && notes.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {notes.map(note => (
            <article
              key={note.id}
              className="p-6 bg-brand-bg border border-brand-border rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:border-brand-accent flex flex-col cursor-pointer"
            >
              <h2 className="text-xl font-semibold text-brand-heading line-clamp-2">
                {note.title}
              </h2>
              <p className="mt-3 text-sm text-brand-text line-clamp-3 leading-relaxed">
                {note.content}
              </p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default App
