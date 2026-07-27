import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.ts';
import { getNotes, postNote } from '../db/noteQueries';

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

  const { title, content } = req.body;
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({
      message: 'Server: Title must be a valid string'
    });
  }

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return res.status(400).json({
      message: 'Server: Content must be a valid string'
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

    const note = await postNote(title, content, userId, folderId);

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

// TODO: Add Other Note Controllers
