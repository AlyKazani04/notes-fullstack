import { useEffect, useMemo, useState } from "react";
import { Check, FileText, Plus, Search, Trash2 } from "lucide-react";
import type { Note, Folder } from "../../types";
import { NoteSkeleton } from "../common/Skeletons";
import { folderColor } from "../../utils/helpers";
import { timeAgo } from "../../utils/helpers";
import type { CSSProperties } from "react";

interface NoteListProps {
  notes: Note[];
  loading: boolean;
  selectedFolderId: string | null | undefined;
  folders: Folder[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  onNewNote: () => Promise<void> | void;
  onBatchDelete: (ids: string[]) => Promise<void> | void;
  mobileHidden: boolean;
}

export function NoteList({
  notes,
  loading,
  selectedFolderId,
  folders,
  selectedNoteId,
  onSelectNote,
  onNewNote,
  onBatchDelete,
  mobileHidden,
}: NoteListProps) {
  const [query, setQuery] = useState("");
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSelectMode(false);
    setSelected(new Set());
  }, [selectedFolderId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(
      (n: Note) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q),
    );
  }, [notes, query]);

  function toggleSelected(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const headerLabel =
    selectedFolderId === undefined
      ? "All notes"
      : folders.find((f: Folder) => f.id === selectedFolderId)?.name || "Your Notes";

  return (
    <section className={`note-list ${mobileHidden ? "mobile-hidden" : ""}`}>
      <div className="note-list-header">
        <h2>{headerLabel}</h2>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setSelectMode((s) => !s)}
        >
          {selectMode ? "Cancel" : "Select"}
        </button>
      </div>

      <div className="search-row">
        <Search size={14} />
        <input
          placeholder="Search notes"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {selectMode && (
        <div className="batch-bar">
          <span>{selected.size} selected</span>
          <button
            className="btn btn-danger btn-sm"
            disabled={selected.size === 0}
            onClick={() => {
              onBatchDelete([...selected]);
              setSelected(new Set());
              setSelectMode(false);
            }}
          >
            <Trash2 size={13} /> Delete
          </button>
        </div>
      )}

      <button
        className="btn btn-primary btn-block new-note-btn"
        onClick={onNewNote}
      >
        <Plus size={15} /> New note
      </button>

      <div className="note-cards">
        {loading ? (
          <NoteSkeleton />
        ) : filtered.length === 0 ? (
          <div className="empty-state small">
            <FileText size={28} />
            <p>
              {query
                ? "No notes match your search."
                : "No notes here yet — create your first one."}
            </p>
          </div>
        ) : (
          filtered.map((n: Note, i: number) => (
            <div
              key={n.id}
              className={`note-card ${selectedNoteId === n.id ? "active" : ""}`}
              style={
                {
                  "--folder-color": folderColor(n.folderId || ""),
                  animationDelay: `${Math.min(i, 8) * 35}ms`,
                } as CSSProperties
              }
              onClick={() =>
                selectMode ? toggleSelected(n.id) : onSelectNote(n.id)
              }
            >
              {selectMode && (
                <span
                  className={`checkbox ${selected.has(n.id) ? "checked" : ""}`}
                >
                  {selected.has(n.id) && <Check size={11} />}
                </span>
              )}
              <div className="note-card-body">
                <div className="note-card-title">{n.title || "Untitled"}</div>
                <div className="note-card-snippet">
                  {n.content
                    .replace(/[#*\-\n]/g, " ")
                    .trim()
                    .slice(0, 88) || "No content yet."}
                </div>
                <div className="note-card-meta">{timeAgo(n.createdAt)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
