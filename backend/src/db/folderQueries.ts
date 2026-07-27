import { prisma as db } from './db.ts';

export const getAllFolders = async (userId: number) => {
  try {
    const folders = await db.folder
      .findMany({
        where: { userId }
      });

    return folders;
  } catch (e) {
    console.error('Failed to get Folders\n', e);
    throw e;
  }
}

export const getFolderById = async (userId: number, folderId: number) => {
  try {
    const folder = await db.folder
      .findUnique({
        where: { userId, id: folderId }
      });

    return folder;
  } catch (e) {
    console.error('Failed to get Folder\n', e);
    throw e;
  }
}

export const insertFolder = async (userId: number, name: string) => {
  try {
    const folder = await db.folder
      .create({
        data: {
          name,
          userId
        }
      });

    return folder
  } catch (e) {
    console.error('Failed to create Folder\n', e);
    throw e;
  }
}
