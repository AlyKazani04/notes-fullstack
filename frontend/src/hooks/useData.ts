import { useState, useCallback } from "react";
import type { User, Folder, Note, DeleteResponse } from "../types";
import { folders as foldersApi } from "../api/folders";
import { notes as notesApi } from "../api/notes";

import type { Toast } from "./useToasts";

export function useData(
  user: User | null,
  pushToast: (msg: string, type?: Toast["type"]) => void,
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
  }, []);

  const loadNotes = useCallback(async (folderId?: string) => {
    setNotesLoading(true);
    const res = await notesApi.getAll(folderId);
    setNotes(res.notes);
    setNotesLoading(false);
  }, []);

  // create, update, delete, batchDelete, etc.
  // each calls the API, updates local state, and shows a toast.
  const createNote = useCallback(
    async (
      title: string,
      content: string,
      folderId?: string,
    ): Promise<Note> => {
      const res = await notesApi.create(title, content, folderId);
      setNotes((prev) => [res.note, ...prev]);
      pushToast("Note Created", "success");
      return res.note;
    },
    [pushToast],
  );

  const updateNote = useCallback(
    async (
      id: string,
      title: string,
      content: string,
      folderId?: string,
    ): Promise<Note> => {
      const res = await notesApi.update(id, title, content, folderId);
      setNotes((prev) =>
        prev.map((note) => (note.id === id ? res.note : note)),
      );
      pushToast("Note Updated", "success");
      return res.note;
    },
    [pushToast],
  );

  const deleteNote = useCallback(
    async (id: string): Promise<void> => {
      await notesApi.delete(id);
      setNotes((prev) => prev.filter((note) => note.id !== id));
      pushToast("Note Deleted", "success");
    },
    [pushToast],
  );

  const batchDelete = useCallback(
    async (ids: string[]): Promise<{ deletedCount: number }> => {
      const res: DeleteResponse = await notesApi.batchDelete(ids);
      setNotes((prev) => prev.filter((note) => !ids.includes(note.id)));
      pushToast("Notes Deleted", "success");
      return { deletedCount: res.deletedCount ?? 0 };
    },
    [pushToast],
  );

  const createFolder = useCallback(
    async (name: string): Promise<Folder> => {
      const res = await foldersApi.create(name);
      setFolders((prev) => [...prev, res.folder]);
      pushToast("Folder Created", "success");
      return res.folder;
    },
    [pushToast],
  );

  const renameFolder = useCallback(
    async (id: string, name: string): Promise<Folder> => {
      const res = await foldersApi.update(name, id);
      setFolders((prev) =>
        prev.map((folder) => (folder.id === id ? res.folder : folder)),
      );
      pushToast("Folder Renamed", "success");
      return res.folder;
    },
    [pushToast],
  );

  const deleteFolder = useCallback(
    async (id: string): Promise<void> => {
      await foldersApi.delete(id);
      setFolders((prev) => prev.filter((folder) => folder.id !== id));
      pushToast("Folder Deleted", "success");
    },
    [pushToast],
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
