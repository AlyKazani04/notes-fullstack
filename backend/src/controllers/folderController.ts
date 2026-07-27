import { Response } from 'express';
import { AuthenticatedRequest } from "../middleware/auth";
import { deleteFolder, getAllFolders, getFolderById, insertFolder, updateFolder } from '../db/folderQueries';

// AuthenticatedRequest is given generic params in '../middleware/auth.ts'
export const folderById = async (req: AuthenticatedRequest<{ id: string }>, res: Response) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      message: 'Server: Unauthorized',
    });
  }

  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({
      message: 'Server: ID must be a valid number',
    });
  }

  try {
    const userId = req.user.id;

    const folder = await getFolderById(userId, id);
    if (folder) {
      res.status(200).json({
        message: "Server: Folder Found",
        folder
      });
    } else {
      res.status(404).json({
        message: 'Server: Folder not found',
      });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: 'Server: Internal Server Error',
    });
  }
}

export const userFolders = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      message: 'Server: Unauthorized',
    });
  }

  try {
    const userId = req.user.id;

    const folders = await getAllFolders(userId);

    return res.status(200).json({
      message: "Server: Folders found",
      folders
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: 'Server: Internal Server Error',
    });
  }
}

export const createFolder = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      message: 'Server: Unauthorized',
    });
  }

  const { name } = req.body;
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({
      message: 'Server: Name must be a valid string'
    });
  }

  try {
    const userId = req.user.id;

    const folder = await insertFolder(userId, name.trim());
    if (folder) {
      res.status(201).json({
        message: "Server: Folder Created",
      });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: 'Server: Internal Server Error',
    });
  }
}

export const patchFolder = async (req: AuthenticatedRequest<{ id: string }>, res: Response) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      message: 'Server: Unauthorized',
    });
  }

  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({
      message: 'Server: ID must be a valid number',
    });
  }

  const { name } = req.body;
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({
      message: 'Server: Name must be a valid string',
    });
  }

  try {
    const userId = req.user.id;

    const folder = await updateFolder(userId, id, name.trim());
    if (!folder) {
      return res.status(404).json({
        message: 'Server: Folder not found or unauthorized'
      });
    }

    return res.status(200).json({
      message: "Server: Folder Updated",
      folder
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: 'Server: Internal Server Error',
    });
  }
}

export const removeFolder = async (req: AuthenticatedRequest<{ id: string }>, res: Response) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      message: 'Server: Unauthorized',
    });
  }

  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({
      message: 'Server: ID must be a valid number',
    });
  }

  try {
    const userId = req.user.id;

    const deleted = await deleteFolder(userId, id);
    if (!deleted) {
      return res.status(404).json({
        message: 'Server: Folder not found or unauthorized'
      });
    }

    res.status(200).json({
      message: "Server: Folder Deleted",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: 'Server: Internal Server Error',
    });
  }
}
