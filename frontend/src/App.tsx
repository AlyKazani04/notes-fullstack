import { useState, useEffect, useMemo } from "react";
import { useAuth } from "./hooks/useAuth";
import { useToasts } from "./hooks/useToasts";
import { useData } from "./hooks/useData";
import { Toasts } from "./components/common/Toasts";
import { SettingsModal } from "./components/settings/SettingsModal";
import { Editor } from "./components/editor/Editor";
import { AuthShell } from "./components/auth/AuthShell";
import { Sidebar } from "./components/sidebar/Sidebar";
import { NoteList } from "./components/noteList/NoteList";

export default function App() {
  const { user, login, register, logout } = useAuth();
  const { toasts, pushToast, dismissToast } = useToasts();
  const {
    folders,
    notes,
    foldersLoading,
    notesLoading,
    loadFolders,
    loadNotes,
    createNote,
    updateNote,
    deleteNote,
    batchDelete,
    createFolder,
    renameFolder,
    deleteFolder,
  } = useData(user);

  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(undefined);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileShowEditor, setMobileShowEditor] = useState(false);

  // user logs in
  useEffect(() => {
    if (user) {
      loadFolders();
      loadNotes(undefined);
    }
  }, [user, loadFolders, loadNotes]);

  // reload notes when selected folder changes
  useEffect(() => {
    if (user) {
      const folderId =
        selectedFolderId ? selectedFolderId : undefined;
      loadNotes(folderId);
    }
  }, [selectedFolderId, user, loadNotes]);

  // Keyboard shortcut (Ctrl + n): creates new empty note
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (
        (e.metaKey || e.ctrlKey) &&
        e.key.toLowerCase() === "n" &&
        user &&
        !settingsOpen
      ) {
        e.preventDefault();
        handleNewNote();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [user, settingsOpen]);


  // note counts per folder
  const noteCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    notes.forEach((n) => {
      if (n.folderId) counts[n.folderId] = (counts[n.folderId] || 0) + 1;
    });
    return counts;
  }, []);

  // handlers

  async function handleNewNote() {
    const folderId = selectedFolderId ? selectedFolderId : undefined;
    const newNote = await createNote("New Note", "Note Content", folderId);
    setSelectedNoteId(newNote.id);
    setMobileShowEditor(true);
  }

  async function handleNoteChange(
    id: string,
    title?: string,
    content?: string,
    folderId?: string,
  ) {
    await updateNote(id, title ?? "", content ?? "", folderId);
  }

  async function handleDeleteNote(id: string) {
    await deleteNote(id);
    setSelectedNoteId(null);
    setMobileShowEditor(false);
    pushToast("Note deleted", "success");
  }

  async function handleBatchDelete(ids: string[]) {
    const { deletedCount } = await batchDelete(ids);
    if (ids.includes(selectedNoteId!)) setSelectedNoteId(null);
    pushToast(
      `Deleted ${deletedCount} note${deletedCount === 1 ? "" : "s"}`,
      "success",
    );
  }

  async function handleCreateFolder(name: string) {
    await createFolder(name);
  }
  async function handleRenameFolder(id: string, name: string) {
    await renameFolder(id, name);
  }
  async function handleDeleteFolder(id: string) {
    await deleteFolder(id);
    if (selectedFolderId === id) setSelectedFolderId(undefined);
    pushToast("Folder deleted", "success");
  }

  async function handleLogout() {
    await logout();
    setSelectedNoteId(null);
    setSettingsOpen(false);
    pushToast("Logged out", "success");
  }

  const selectedNote = notes.find((n) => n.id === selectedNoteId) ?? null;

  return (
    <div className="app-root">
      <Toasts
        toasts={toasts}
        onDismiss={dismissToast}
      />

      {!user ? (
        <AuthShell onLogin={login} onRegister={register} pushToast={pushToast} />
      ) : (
        <div className="dashboard">
          <Sidebar
            user={user}
            folders={folders}
            foldersLoading={foldersLoading}
            selectedFolderId={selectedFolderId}
            onSelectFolder={(id: string | undefined) => {
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
            onSelectNote={(id: string) => {
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
        <SettingsModal
          user={user}
          onClose={() => setSettingsOpen(false)}
          onLoggedOut={handleLogout}
          pushToast={pushToast}
        />
      )}
    </div>
  );
}
