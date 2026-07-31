// import { useState, useEffect, useCallback } from "react";
// import type { Note } from "./types/Note.ts";
// import Card from "./components/Card.tsx";
// import NewNotePopup from "./components/NewNotePopup.tsx";


import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  FolderPlus, FileText, Search, Trash2, LogOut, Settings as SettingsIcon,
  Check, X, Loader2, Plus, Eye, PenLine, Pencil,
  AlertCircle, Menu, ArrowLeft, FolderOpen, Inbox,
} from "lucide-react";


/* ------------------------------- Toasts -------------------------------- */
function Toasts({ toasts, onDismiss }) {
  return (
    <div className="toast-stack">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`} onClick={() => onDismiss(t.id)}>
          {t.type === "error" ? <AlertCircle size={15} /> : <Check size={15} />}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

/* --------------------------------- Auth --------------------------------- */
function AuthShell({ api, onAuthed, pushToast }) {
  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [prefillEmail, setPrefillEmail] = useState("");

  return (
    <div className="auth-shell">
      <div className="auth-hero">
        <div className="hero-mark">MARGINALIA</div>
        <div className="hero-cards" aria-hidden="true">
          <div className="hero-tab" />
          <div className="hero-card hc-3" />
          <div className="hero-card hc-2" />
          <div className="hero-card hc-1">
            <div className="hc-line l1" />
            <div className="hc-line l2" />
            <div className="hc-line l3" />
          </div>
        </div>
        <p className="hero-tag">Where your notes get properly filed.</p>
        <p className="hero-sub">Folders, index cards, and a page for everything in between.</p>
      </div>

      <div className="auth-panel">
        <div className="auth-tabs" role="tablist">
          <button className={`auth-tab ${mode === "login" ? "active" : ""}`} onClick={() => setMode("login")}>
            Log in
          </button>
          <button className={`auth-tab ${mode === "register" ? "active" : ""}`} onClick={() => setMode("register")}>
            New account
          </button>
          <div className={`auth-tab-underline ${mode}`} />
        </div>

        {mode === "login" ? (
          <LoginForm api={api} onAuthed={onAuthed} pushToast={pushToast} prefillEmail={prefillEmail} />
        ) : (
          <RegisterForm
            api={api}
            pushToast={pushToast}
            onRegistered={(email) => {
              setPrefillEmail(email);
              setMode("login");
            }}
          />
        )}
      </div>
    </div>
  );
}

function FieldError({ children }) {
  if (!children) return null;
  return <div className="field-error">{children}</div>;
}

function LoginForm({ api, onAuthed, pushToast, prefillEmail }) {
  const [email, setEmail] = useState(prefillEmail || "");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (prefillEmail) pushToast("Account created — log in to continue.", "success");
  }, [prefillEmail]); // eslint-disable-line

  async function submit(e) {
    e.preventDefault();
    const errs = {};
    if (!isValidEmail(email)) errs.email = "Enter a valid email address.";
    if (password.length < 8) errs.password = "Password must be at least 8 characters.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    try {
      const { user } = await api.login({ email, password });
      onAuthed(user);
    } catch (err) {
      pushToast(err.message || "Something went wrong.", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={submit} noValidate>
      <label className="field">
        <span>Email</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@school.edu" autoComplete="email" />
        <FieldError>{errors.email}</FieldError>
      </label>
      <label className="field">
        <span>Password</span>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
        <FieldError>{errors.password}</FieldError>
      </label>
      <button className="btn btn-primary btn-block" disabled={busy}>
        {busy ? <Loader2 className="spin" size={16} /> : "Log in"}
      </button>
      <p className="auth-hint">Try any email + an 8-character password — this runs on mock data.</p>
    </form>
  );
}

function RegisterForm({ api, pushToast, onRegistered }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    const errs = {};
    if (!name.trim()) errs.name = "Tell us what to call you.";
    if (!isValidEmail(email)) errs.email = "Enter a valid email address.";
    if (password.length < 8) errs.password = "Password must be at least 8 characters.";
    if (confirm !== password) errs.confirm = "Passwords don't match.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    try {
      await api.register({ name, email, password });
      onRegistered(email);
    } catch (err) {
      pushToast(err.message || "Something went wrong.", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={submit} noValidate>
      <label className="field">
        <span>Name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Lovelace" autoComplete="name" />
        <FieldError>{errors.name}</FieldError>
      </label>
      <label className="field">
        <span>Email</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@school.edu" autoComplete="email" />
        <FieldError>{errors.email}</FieldError>
      </label>
      <label className="field">
        <span>Password</span>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" autoComplete="new-password" />
        <FieldError>{errors.password}</FieldError>
      </label>
      <label className="field">
        <span>Confirm password</span>
        <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Type it again" autoComplete="new-password" />
        <FieldError>{errors.confirm}</FieldError>
      </label>
      <button className="btn btn-primary btn-block" disabled={busy}>
        {busy ? <Loader2 className="spin" size={16} /> : "Create account"}
      </button>
    </form>
  );
}

/* ------------------------------ Skeletons ------------------------------- */
function FolderSkeleton() {
  return (
    <div className="skeleton-list">
      {[0, 1, 2].map((i) => (
        <div key={i} className="skeleton-row" style={{ animationDelay: `${i * 90}ms` }} />
      ))}
    </div>
  );
}
function NoteSkeleton() {
  return (
    <div className="skeleton-list">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="skeleton-card" style={{ animationDelay: `${i * 80}ms` }} />
      ))}
    </div>
  );
}

/* -------------------------------- Sidebar -------------------------------- */
function Sidebar({ user, folders, foldersLoading, selectedFolderId, onSelectFolder, onCreateFolder, onRenameFolder, onDeleteFolder, onOpenSettings, onLogout, noteCounts, mobileOpen, onCloseMobile }) {
  const [addingFolder, setAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const addInputRef = useRef(null);

  useEffect(() => {
    if (addingFolder) addInputRef.current?.focus();
  }, [addingFolder]);

  function submitNewFolder(e) {
    e.preventDefault();
    if (!newFolderName.trim()) {
      setAddingFolder(false);
      return;
    }
    onCreateFolder(newFolderName.trim());
    setNewFolderName("");
    setAddingFolder(false);
  }

  function submitRename(id) {
    if (renameValue.trim()) onRenameFolder(id, renameValue.trim());
    setRenamingId(null);
  }

  const initials = (user?.username || "?").slice(0, 2).toUpperCase();

  return (
    <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
      <div className="sidebar-scrim" onClick={onCloseMobile} />
      <div className="sidebar-inner">
        <div className="brand-row">
          <span className="brand-mark">MARGINALIA</span>
        </div>

        <button className="profile-widget" onClick={onOpenSettings}>
          <span className="avatar">{initials}</span>
          <span className="profile-text">
            <span className="profile-name">{user?.username}</span>
            <span className="profile-email">{user?.email}</span>
          </span>
          <SettingsIcon size={16} className="profile-gear" />
        </button>

        <nav className="folder-nav">
          <button className={`nav-row all-notes ${selectedFolderId === "all" ? "active" : ""}`} onClick={() => onSelectFolder("all")}>
            <Inbox size={15} />
            <span>All notes</span>
          </button>

          <div className="nav-label">Folders</div>

          {foldersLoading ? (
            <FolderSkeleton />
          ) : folders.length === 0 && !addingFolder ? (
            <div className="empty-inline">No folders yet.</div>
          ) : (
            folders.map((f) => (
              <div key={f.id} className="folder-tab-wrap">
                {renamingId === f.id ? (
                  <form
                    className="rename-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      submitRename(f.id);
                    }}
                  >
                    <input
                      autoFocus
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={() => submitRename(f.id)}
                      onKeyDown={(e) => e.key === "Escape" && setRenamingId(null)}
                    />
                  </form>
                ) : (
                  <button
                    className={`nav-row folder-tab ${selectedFolderId === f.id ? "active" : ""}`}
                    style={{ "--folder-color": folderColor(f.id) }}
                    onClick={() => onSelectFolder(f.id)}
                  >
                    <span className="folder-dot" />
                    <span className="folder-name">{f.name}</span>
                    <span className="folder-count">{noteCounts[f.id] || 0}</span>
                    <span className="folder-actions">
                      <span
                        role="button"
                        tabIndex={0}
                        className="icon-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRenamingId(f.id);
                          setRenameValue(f.name);
                        }}
                      >
                        <Pencil size={12} />
                      </span>
                      <span
                        role="button"
                        tabIndex={0}
                        className={`icon-btn ${confirmDeleteId === f.id ? "danger-confirm" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirmDeleteId === f.id) {
                            onDeleteFolder(f.id);
                            setConfirmDeleteId(null);
                          } else {
                            setConfirmDeleteId(f.id);
                            setTimeout(() => setConfirmDeleteId((cur) => (cur === f.id ? null : cur)), 2800);
                          }
                        }}
                      >
                        <Trash2 size={12} />
                      </span>
                    </span>
                  </button>
                )}
              </div>
            ))
          )}

          {addingFolder ? (
            <form className="new-folder-form" onSubmit={submitNewFolder}>
              <input
                ref={addInputRef}
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onBlur={submitNewFolder}
                onKeyDown={(e) => e.key === "Escape" && setAddingFolder(false)}
                placeholder="Folder name"
              />
            </form>
          ) : (
            <button className="nav-row new-folder-btn" onClick={() => setAddingFolder(true)}>
              <FolderPlus size={15} />
              <span>New folder</span>
            </button>
          )}
        </nav>

        <button className="nav-row logout-row" onClick={onLogout}>
          <LogOut size={15} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}

/* ------------------------------- Note list ------------------------------- */
function NoteList({ notes, loading, selectedFolderId, folders, selectedNoteId, onSelectNote, onNewNote, onBatchDelete, mobileHidden, onOpenSidebar }) {
  const [query, setQuery] = useState("");
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState(new Set());

  useEffect(() => {
    setSelectMode(false);
    setSelected(new Set());
  }, [selectedFolderId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter((n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
  }, [notes, query]);

  function toggleSelected(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const headerLabel = selectedFolderId === "all" ? "All notes" : folders.find((f) => f.id === selectedFolderId)?.name || "Notes";

  return (
    <section className={`note-list ${mobileHidden ? "mobile-hidden" : ""}`}>
      <div className="note-list-header">
        <button className="icon-btn mobile-only" onClick={onOpenSidebar}>
          <Menu size={18} />
        </button>
        <h2>{headerLabel}</h2>
        <button className="btn btn-ghost btn-sm" onClick={() => setSelectMode((s) => !s)}>
          {selectMode ? "Cancel" : "Select"}
        </button>
      </div>

      <div className="search-row">
        <Search size={14} />
        <input placeholder="Search notes" value={query} onChange={(e) => setQuery(e.target.value)} />
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

      <button className="btn btn-primary btn-block new-note-btn" onClick={onNewNote}>
        <Plus size={15} /> New note
      </button>

      <div className="note-cards">
        {loading ? (
          <NoteSkeleton />
        ) : filtered.length === 0 ? (
          <div className="empty-state small">
            <FileText size={28} />
            <p>{query ? "No notes match your search." : "No notes here yet — create your first one."}</p>
          </div>
        ) : (
          filtered.map((n, i) => (
            <div
              key={n.id}
              className={`note-card ${selectedNoteId === n.id ? "active" : ""}`}
              style={{ "--folder-color": folderColor(n.folderId), animationDelay: `${Math.min(i, 8) * 35}ms` }}
              onClick={() => (selectMode ? toggleSelected(n.id) : onSelectNote(n.id))}
            >
              {selectMode && (
                <span className={`checkbox ${selected.has(n.id) ? "checked" : ""}`}>{selected.has(n.id) && <Check size={11} />}</span>
              )}
              <div className="note-card-body">
                <div className="note-card-title">{n.title || "Untitled"}</div>
                <div className="note-card-snippet">{n.content.replace(/[#*\-\n]/g, " ").trim().slice(0, 88) || "No content yet."}</div>
                <div className="note-card-meta">{timeAgo(n.updatedAt)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

/* --------------------------------- Editor --------------------------------- */
function Editor({ note, folders, onChange, onDelete, mobileHidden, onBack }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [folderId, setFolderId] = useState(null);
  const [tab, setTab] = useState("write");
  const [saveState, setSaveState] = useState("saved"); // idle | saving | saved
  const [confirmDelete, setConfirmDelete] = useState(false);
  const saveTimer = useRef(null);

  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
    setFolderId(note?.folderId ?? null);
    setTab("write");
    setSaveState("saved");
    setConfirmDelete(false);
  }, [note?.id]); // eslint-disable-line

  const scheduleSave = useCallback(
    (patch) => {
      setSaveState("saving");
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        await onChange(note.id, patch);
        setSaveState("saved");
      }, 700);
    },
    [note, onChange]
  );

  if (!note) {
    return (
      <section className={`editor empty-editor ${mobileHidden ? "mobile-hidden" : ""}`}>
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
        <button className="icon-btn mobile-only" onClick={onBack}>
          <ArrowLeft size={18} />
        </button>
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
            const val = e.target.value || null;
            setFolderId(val);
            scheduleSave({ folderId: val });
          }}
        >
          <option value="">No folder</option>
          {folders.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      <div className="editor-tabs">
        <button className={tab === "write" ? "active" : ""} onClick={() => setTab("write")}>
          <PenLine size={13} /> Write
        </button>
        <button className={tab === "preview" ? "active" : ""} onClick={() => setTab("preview")}>
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
          <div className="editor-preview" dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
        )}
      </div>

      <div className="editor-footer">
        <span className="save-indicator">
          {saveState === "saving" ? (
            <>
              <Loader2 className="spin" size={12} /> Saving…
            </>
          ) : (
            <>Saved {timeAgo(note.updatedAt)}</>
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
          <Trash2 size={13} /> {confirmDelete ? "Click again to delete" : "Delete note"}
        </button>
      </div>
    </section>
  );
}

/* ------------------------------ Settings modal ------------------------------ */
function SettingsModal({ user, api, onClose, onLoggedOut, pushToast }) {
  const [name, setName] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const dirty = name !== user.username || email !== user.email || newPassword.length > 0;

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await api.updateProfile({
        name: name !== user.username ? name : undefined,
        email: email !== user.email ? email : undefined,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      });
      setSaved(true);
      pushToast("Profile updated", "success");
      setCurrentPassword("");
      setNewPassword("");
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message || "Could not save changes.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Account settings</h3>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form className="modal-body" onSubmit={submit}>
          <div className="modal-section-label">Identity</div>
          <label className="field">
            <span>Name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="field">
            <span>Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>

          <div className="modal-section-label">Security</div>
          <label className="field">
            <span>Current password</span>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Required to change email or password" />
          </label>
          <label className="field">
            <span>New password</span>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Leave blank to keep current password" />
          </label>

          {error && <div className="field-error modal-error">{error}</div>}
          {saved && (
            <div className="save-banner">
              <Check size={14} /> Changes saved
            </div>
          )}

          <button className="btn btn-primary btn-block" disabled={!dirty || busy}>
            {busy ? <Loader2 className="spin" size={16} /> : "Save changes"}
          </button>
        </form>

        <div className="modal-footer">
          <button className="btn btn-danger btn-block" onClick={onLoggedOut}>
            <LogOut size={15} /> Log out
          </button>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- App --------------------------------- */
export default function App() {
  const api = useMemo(() => makeMockApi(), []);
  const [user, setUser] = useState(null);
  const [folders, setFolders] = useState([]);
  const [foldersLoading, setFoldersLoading] = useState(false);
  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState("all");
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileShowEditor, setMobileShowEditor] = useState(false);

  const pushToast = useCallback((message, type = "success") => {
    const id = uid();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const loadFolders = useCallback(async () => {
    setFoldersLoading(true);
    const { folders } = await api.getFolders();
    setFolders(folders);
    setFoldersLoading(false);
  }, [api]);

  const loadNotes = useCallback(
    async (folderId) => {
      setNotesLoading(true);
      const { notes } = await api.getNotes(folderId === "all" ? undefined : folderId);
      setNotes(notes);
      setNotesLoading(false);
    },
    [api]
  );

  async function handleAuthed(u) {
    setUser(u);
    await loadFolders();
    await loadNotes("all");
  }

  useEffect(() => {
    if (user) loadNotes(selectedFolderId);
  }, [selectedFolderId]); // eslint-disable-line

  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n" && user && !settingsOpen) {
        e.preventDefault();
        handleNewNote();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }); // eslint-disable-line

  const noteCounts = useMemo(() => {
    const counts = {};
    notes.forEach((n) => {
      if (n.folderId) counts[n.folderId] = (counts[n.folderId] || 0) + 1;
    });
    return counts;
  }, [notes]);

  async function handleNewNote() {
    const folderId = selectedFolderId === "all" ? null : selectedFolderId;
    const { note } = await api.createNote({ title: "", content: "", folderId });
    setNotes((prev) => [note, ...prev]);
    setSelectedNoteId(note.id);
    setMobileShowEditor(true);
  }

  async function handleNoteChange(id, patch) {
    const { note } = await api.updateNote(id, patch);
    setNotes((prev) => prev.map((n) => (n.id === id ? note : n)));
  }

  async function handleDeleteNote(id) {
    await api.deleteNote(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
    setSelectedNoteId(null);
    setMobileShowEditor(false);
    pushToast("Note deleted", "success");
  }

  async function handleBatchDelete(ids) {
    const { deletedCount } = await api.batchDeleteNotes(ids);
    setNotes((prev) => prev.filter((n) => !ids.includes(n.id)));
    if (ids.includes(selectedNoteId)) setSelectedNoteId(null);
    pushToast(`Deleted ${deletedCount} note${deletedCount === 1 ? "" : "s"}`, "success");
  }

  async function handleCreateFolder(name) {
    const { folder } = await api.createFolder({ name });
    setFolders((prev) => [...prev, folder]);
  }
  async function handleRenameFolder(id, name) {
    const { folder } = await api.renameFolder(id, { name });
    setFolders((prev) => prev.map((f) => (f.id === id ? folder : f)));
  }
  async function handleDeleteFolder(id) {
    await api.deleteFolder(id);
    setFolders((prev) => prev.filter((f) => f.id !== id));
    if (selectedFolderId === id) setSelectedFolderId("all");
    pushToast("Folder deleted", "success");
  }

  async function handleLogout() {
    await api.logout();
    setUser(null);
    setFolders([]);
    setNotes([]);
    setSelectedNoteId(null);
    setSettingsOpen(false);
    pushToast("Logged out", "success");
  }

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || null;

  return (
    <div className="app-root">
      <Toasts toasts={toasts} onDismiss={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />

      {!user ? (
        <AuthShell api={api} onAuthed={handleAuthed} pushToast={pushToast} />
      ) : (
        <div className="dashboard">
          <Sidebar
            user={user}
            folders={folders}
            foldersLoading={foldersLoading}
            selectedFolderId={selectedFolderId}
            onSelectFolder={(id) => {
              setSelectedFolderId(id);
              setSelectedNoteId(null);
              setMobileSidebarOpen(false);
              setMobileShowEditor(false);
            }}
            onCreateFolder={handleCreateFolder}
            onRenameFolder={handleRenameFolder}
            onDeleteFolder={handleDeleteFolder}
            onOpenSettings={() => setSettingsOpen(true)}
            onLogout={handleLogout}
            noteCounts={noteCounts}
            mobileOpen={mobileSidebarOpen}
            onCloseMobile={() => setMobileSidebarOpen(false)}
          />

          <NoteList
            notes={notes}
            loading={notesLoading}
            selectedFolderId={selectedFolderId}
            folders={folders}
            selectedNoteId={selectedNoteId}
            onSelectNote={(id) => {
              setSelectedNoteId(id);
              setMobileShowEditor(true);
            }}
            onNewNote={handleNewNote}
            onBatchDelete={handleBatchDelete}
            mobileHidden={mobileShowEditor}
            onOpenSidebar={() => setMobileSidebarOpen(true)}
          />

          <Editor
            note={selectedNote}
            folders={folders}
            onChange={handleNoteChange}
            onDelete={handleDeleteNote}
            mobileHidden={!mobileShowEditor}
            onBack={() => setMobileShowEditor(false)}
          />
        </div>
      )}

      {settingsOpen && user && (
        <SettingsModal user={user} api={api} onClose={() => setSettingsOpen(false)} onLoggedOut={handleLogout} pushToast={pushToast} />
      )}
    </div>
  );
}
