import { useState, useCallback, useMemo } from "react";
import type { User, Folder, Note, DeleteResponse } from "../types";
import { folders as foldersApi } from "../api/folders";
import { notes as notesApi } from "../api/notes";

export function useData(
  _user: User | null,
) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [foldersLoading, setFoldersLoading] = useState(false);
  const [notesLoading, setNotesLoading] = useState(false);

  const loadFolders = useCallback(async () => {
    setFoldersLoading(true);
    const res = await foldersApi.getAll();
    setFolders(res.folders);
    setFoldersLoading(false);
  }, []);

  const loadNotes = useCallback(async (folderId?: string) => {
    setNotesLoading(true);
    const res = await notesApi.getAll(folderId);
    setNotes(res.notes);
    if (folderId === undefined) {
      setAllNotes(res.notes);
    }
    setNotesLoading(false);
  }, []);

  const noteCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allNotes.forEach((note) => {
      if (note.folderId) {
        counts[note.folderId] = (counts[note.folderId] || 0) + 1;
      }
    });
    return counts;
  }, [allNotes]);

  // create, update, delete, batchDelete, etc.
  // each calls the API, updates local state, and shows a toast.
  const createNote = useCallback(
    async (
      title: string,
      content: string,
      folderId?: string | null,
      currentFolderId?: string,
    ): Promise<Note> => {
      const res = await notesApi.create(title, content, folderId);
      setAllNotes((prev) => [res.note, ...prev]);
      setNotes((prev) => [res.note, ...prev]);
      await loadNotes(currentFolderId);
      return res.note;
    },
    [loadNotes],
  );

  const updateNote = useCallback(
    async (
      id: string,
      title: string,
      content: string,
      folderId?: string | null,
      currentFolderId?: string,
    ): Promise<Note> => {
      const res = await notesApi.update(id, title, content, folderId);
      setAllNotes((prev) =>
        prev.map((note) => (note.id === id ? res.note : note)),
      );
      setNotes((prev) =>
        prev.map((note) => (note.id === id ? res.note : note)),
      );
      await loadNotes(currentFolderId);
      return res.note;
    },
    [loadNotes],
  );

  const deleteNote = useCallback(
    async (id: string, currentFolderId?: string): Promise<void> => {
      await notesApi.delete(id);
      setAllNotes((prev) => prev.filter((note) => note.id !== id));
      setNotes((prev) => prev.filter((note) => note.id !== id));
      await loadNotes(currentFolderId);
    },
    [loadNotes],
  );

  const batchDelete = useCallback(
    async (ids: string[], currentFolderId?: string): Promise<{ deletedCount: number }> => {
      const res: DeleteResponse = await notesApi.batchDelete(ids);
      setAllNotes((prev) => prev.filter((note) => !ids.includes(note.id)));
      setNotes((prev) => prev.filter((note) => !ids.includes(note.id)));
      await loadNotes(currentFolderId);
      return { deletedCount: res.deletedCount ?? 0 };
    },
    [loadNotes],
  );

  const createFolder = useCallback(
    async (name: string): Promise<Folder> => {
      const res = await foldersApi.create(name);
      setFolders((prev) => [...prev, res.folder]);
      return res.folder;
    },
    [],
  );

  const renameFolder = useCallback(
    async (id: string, name: string): Promise<Folder> => {
      const res = await foldersApi.update(name, id);
      setFolders((prev) =>
        prev.map((folder) => (folder.id === id ? res.folder : folder)),
      );
      return res.folder;
    },
    [],
  );

  const deleteFolder = useCallback(
    async (id: string): Promise<void> => {
      await foldersApi.delete(id);
      setFolders((prev) => prev.filter((folder) => folder.id !== id));
    },
    [],
  );

  return {
    folders,
    notes,
    noteCounts,
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
