import { useState, useEffect, useRef, useCallback } from "react";
import { PenLine, Eye, Trash2, Loader2, FolderOpen } from "lucide-react";
import { timeAgo } from '../../utils/helpers';
import { renderMarkdown } from "../../utils/markdown";
import type { Note, Folder } from "../../types";

interface EditorProps {
  note: Note | null;
  folders: Folder[];
  onChange: (id: string, title?: string, content?: string, folderId?: string | null) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  mobileHidden: boolean;
}

export function Editor({ note, folders, onChange, onDelete, mobileHidden }: EditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [folderId, setFolderId] = useState<string | null>("");
  const [tab, setTab] = useState("write");
  const [saveState, setSaveState] = useState("saved");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
    setFolderId(note?.folderId ? note?.folderId.toString() : null);
    setTab("write");
    setSaveState("saved");
    setConfirmDelete(false);
  }, [note?.id]);

  const noteId = note?.id;

  const scheduleSave = useCallback(
    (patch: { title?: string; content?: string; folderId?: string }) => {
      if (!noteId) return;
      setSaveState("saving");
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        await onChange(noteId, patch.title ?? title, patch.content ?? content, patch.folderId ?? folderId);
        setSaveState("saved");
      }, 700);
    },
    [noteId, onChange, title, content, folderId],
  );

  if (!note) {
    return (
      <section
        className={`editor empty-editor ${mobileHidden ? "mobile-hidden" : ""}`}
      >
        <div className="empty-state">
          <FolderOpen size={36} />
          <p>Select a note to start reading, or create a new one.</p>
        </div>
      </section>
    );
  }

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <section className={`editor ${mobileHidden ? "mobile-hidden" : ""}`}>
      <div className="editor-topbar">
        <input
          className="editor-title"
          value={title}
          placeholder="Untitled"
          onChange={(e) => {
            setTitle(e.target.value);
            scheduleSave({ title: e.target.value });
          }}
        />
        <select
          className="folder-select"
          value={folderId || ""}
          onChange={(e) => {
            const val = e.target.value || "";
            setFolderId(val);
            scheduleSave({ folderId: val });
          }}
        >
          <option>No folder</option>
          {folders.map((f: Folder) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      <div className="editor-tabs">
        <button
          className={tab === "write" ? "active" : ""}
          onClick={() => setTab("write")}
        >
          <PenLine size={13} /> Write
        </button>
        <button
          className={tab === "preview" ? "active" : ""}
          onClick={() => setTab("preview")}
        >
          <Eye size={13} /> Preview
        </button>
      </div>

      <div className="editor-body">
        {tab === "write" ? (
          <textarea
            className="editor-textarea"
            value={content}
            placeholder="Start writing…"
            onChange={(e) => {
              setContent(e.target.value);
              scheduleSave({ content: e.target.value });
            }}
          />
        ) : (
          <div
            className="editor-preview"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
          />
        )}
      </div>

      <div className="editor-footer">
        <span className="save-indicator">
          {saveState === "saving" ? (
            <>
              <Loader2 className="spin" size={12} /> Saving…
            </>
          ) : (
            <>Saved {timeAgo(note.createdAt)}</>
          )}
        </span>
        <span className="word-count">{wordCount} words</span>
        <button
          className={`btn btn-ghost btn-sm danger-text ${confirmDelete ? "danger-confirm" : ""}`}
          onClick={() => {
            if (confirmDelete) {
              onDelete(note.id);
            } else {
              setConfirmDelete(true);
              setTimeout(() => setConfirmDelete(false), 2800);
            }
          }}
        >
          <Trash2 size={13} />{" "}
          {confirmDelete ? "Click again to delete" : "Delete note"}
        </button>
      </div>
    </section>
  );
}