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

  const id = parseInt(req.params.id, 10);

  try {
    const userId = req.user.id;

    const folder = await getFolderById(userId, id);
    if (!folder) {
      return res.status(404).json({
        message: 'Server: Folder not found',
      });
    }

    return res.status(200).json({
      message: "Server: Folder Found",
      folder
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
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
    return res.status(500).json({
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

  try {
    const userId = req.user.id;

    const folder = await insertFolder(userId, name);
    return res.status(201).json({
      message: "Server: Folder Created",
      folder
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
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

  const id = parseInt(req.params.id, 10);
  const { name } = req.body;

  try {
    const userId = req.user.id;

    const folder = await updateFolder(userId, id, name);
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
    return res.status(500).json({
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

  const id = parseInt(req.params.id, 10);

  try {
    const userId = req.user.id;

    const deleted = await deleteFolder(userId, id);
    if (!deleted) {
      return res.status(404).json({
        message: 'Server: Folder not found or unauthorized'
      });
    }

    return res.status(200).json({
      message: "Server: Folder Deleted",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: 'Server: Internal Server Error',
    });
  }
}
