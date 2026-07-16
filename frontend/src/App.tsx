import { useState, useEffect } from "react";
import type { Note } from "./types/Note.ts";
import Card from "./components/Card.tsx";
import NewNotePopup from "./components/NewNotePopup.tsx";

const API_URL = import.meta.env.VITE_BASE_URL ?? "http://localhost:3000";



function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNewNoteOpen, setIsNewNoteOpen] = useState(false);

  const saveNote = (note: { title: string; content: string }) => {
    fetch(`${API_URL}/api/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);

        return res.json();
      })
      .then((jsonResponse) => {
        const newNote: Note = jsonResponse.body.result;
        setNotes((prevNotes) => [...prevNotes, newNote]);
      })
      .catch((e) => {
          console.error("Failed to save note:", e);
        });
  };

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${API_URL}/api/notes`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then((data) => setNotes(data.notes))
      .catch((e) => {
        if (e.name !== "AbortError") {
          setError(e.message);
          console.error(e);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [notes]);

  return (
    <main className="max-w-0.8 mx-auto p-6">
      <header className="font-bold text-4xl text-white my-5 flex items-center jusify-center relative">
        <h1 className="text-5xl text-center mx-auto px-2 my-5">My Notes</h1>
        <button
          className="absolute text-black 
          bg-white hover:bg-gray-300 right-4 px-2
          border-mist-700 rounded transition"
          onClick={() => setIsNewNoteOpen(true)}
        >
          +
        </button>
      </header>

      {isNewNoteOpen && (
        <NewNotePopup
          isOpen={isNewNoteOpen}
          onClose={() => setIsNewNoteOpen(false)}
          onSave={saveNote}
        />
      )}

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

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      {!loading && !error && notes.length === 0 && (
        <p className="text-sm text-brand-text italic text-center">
          No notes found.
        </p>
      )}

      {!loading && !error && notes.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 max-w-5xl mx-auto">
          {notes.map((note) => (
            <Card key={note.id} note={note} />
          ))}
        </div>
      )}
    </main>
  );
}

export default App;
