import { useState, useCallback } from "react";
import type { User, Folder, Note } from "../types";
import { folders as foldersApi } from "../api/folders";
import { notes as notesApi } from "../api/notes";

export function useData(
  user: User | null,
  pushToast: (msg: string, type?: string) => void,
) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [foldersLoading, setFoldersLoading] = useState(false);
  const [notesLoading, setNotesLoading] = useState(false);

  const loadFolders = useCallback(async () => {
    if (!user) return;
    setFoldersLoading(true);
    const res = await foldersApi.getAll();
    setFolders(res.folders);
    setFoldersLoading(false);
  }, [user]);

  const loadNotes = useCallback(
    async (folderId?: string) => {
      if (!user) return;
      setNotesLoading(true);
      const res = await notesApi.getAll(folderId);
      setNotes(res.notes);
      setNotesLoading(false);
    },
    [user],
  );

  // create, update, delete, batchDelete, etc.
  // each calls the API, updates local state, and shows a toast.
  const createNote = useCallback(
    async (title: string, content: string, folderId?: string) => {
      if (!user) return;
      const res = await notesApi.create(title, content, folderId);
      setNotes((prev) => [...prev, res.note]);
      pushToast("Note Created", "success");
    },
    [user],
  );

  const updateNote = useCallback(
    async (id: string, title: string, content: string, folderId?: string) => {
        if(!user) return;
        const res = await notesApi.update(id, title, content, folderId);
        setNotes((prev) => prev.map(note => note.id === id ? res.note : note));
        pushToast("Note Updated", "success");
    },
    [user],
  );

  const deleteNote = useCallback(
    async (id: string) => {
        if(!user) return;
        await notesApi.delete(id);
        setNotes((prev) => prev.filter(note => note.id !== id));
        pushToast("Note Deleted", "success");
    },
    [user],
  );

  const batchDelete = useCallback(
    async (ids: string[]) => {
        if(!user) return;
        await notesApi.batchDelete(ids);
        setNotes((prev) => prev.filter(note => !ids.includes(note.id)));
        pushToast("Notes Deleted", "success");
    },
    [user],
  );

  const createFolder = useCallback(
    async (name: string) => {
      if (!user) return;
      const res = await foldersApi.create(name);
      setFolders((prev) => [...prev, res.folder]);
      pushToast("Folder Created", "success");
    },
    [user],
  );

  const renameFolder = useCallback(
    async (id: string, name: string) => {
      if (!user) return;
      const res = await foldersApi.update(name, id);
      setFolders((prev) => prev.map(folder => folder.id === id ? res.folder : folder));
      pushToast("Folder Renamed", "success");
    },
    [user],
  );

    const deleteFolder = useCallback(
        async (id: string) => {
        if (!user) return;
        await foldersApi.delete(id);
        setFolders((prev) => prev.filter(folder => folder.id !== id));
        pushToast("Folder Deleted", "success");
        },
        [user],
    );

  return {
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
  };
}
