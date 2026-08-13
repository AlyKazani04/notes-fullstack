import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.ts';
import { deleteManyNotes, deleteNote, getNotes, postNote, updateNote } from '../db/noteQueries.ts';

export const getUserNotes = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      message: 'Server: Unauthorized'
    });
  }

  try {
    const userId = req.user.id;
    const folderIdParam = req.query.folderId;

    let folderId: number | null | undefined = undefined;

    if (folderIdParam === 'null') {
      folderId = null;
    } else if (typeof folderIdParam === 'string') {
      const parsed = parseInt(folderIdParam, 10);
      if (!isNaN(parsed)) {
        folderId = parsed;
      }
    }
    // If folderIdParam is omitted entirely, folderId stays undefined, fetching all user notes.

    const notes = await getNotes(userId, folderId);

    if (!notes) {
      return res.status(404).json({
        message: "Server: Notes not found or unauthorized"
      });
    }

    return res.status(200).json({
      message: "Server: Notes Found",
      notes
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
}

export const postUserNote = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      message: 'Server: Unauthorized'
    });
  }

  const { title, content, folderId } = req.body;
  let folderIdTested = folderId;

  try {
    const userId = req.user.id;

    if (folderId === 'null') {
      folderIdTested = null;
    } else if (typeof folderId === 'string') {
      const parsed = parseInt(folderId, 10);
      if (!isNaN(parsed)) {
        folderIdTested = parsed;
      }
    }
    // If folderIdParam is omitted entirely, folderId stays undefined, fetching all user notes.

    const note = await postNote(title, content, userId, folderIdTested);

    if (!note) {
      return res.status(404).json({
        message: 'Server: Note not found or unauthorized'
      });
    }

    return res.status(201).json({
      message: "Server: Note Created",
      note
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
}

export const updateUserNote = async (req: AuthenticatedRequest<{ id: string }>, res: Response) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      message: 'Server: Unauthorized'
    });
  }


  try {
    const userId = req.user.id;
    const noteId = Number(req.params.id);
    const { title, content, folderId } = req.body;

    const note = await updateNote(noteId, userId, { title, content, folderId });

    return res.status(200).json({
      message: "Server: Note Updated",
      note
    });
  } catch (e: any) {
    if (e.code === 'P2025') {
      return res.status(404).json({
        message: "Server: Note not found or unauthorized"
      });
    }

    console.error(e);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
}

export const deleteUserNote = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      message: 'Server: Unauthorized'
    });
  }

  try {
    const userId = req.user.id;
    const noteId = Number(req.params.id);

    const deleted = await deleteNote(noteId, userId);

    if (!deleted) {
      return res.status(404).json({
        message: 'Server: Note not found or unauthorized'
      });
    }

    return res.status(200).json({
      message: "Server: Note deleted"
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
}

export const deleteManyUserNotes = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      message: 'Server: Unauthorized'
    });
  }

  try {
    const userId = req.user.id;
    const { noteIds } = req.body;

    const deleted = await deleteManyNotes(userId, noteIds);

    if (deleted === 0) {
      return res.status(404).json({
        message: 'Server: No matching notes found or unauthorized'
      });
    }

    return res.status(200).json({
      message: "Server: Notes deleted",
      deletedCount: deleted
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
}
