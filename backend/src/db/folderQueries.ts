import { prisma as db } from './db.ts';

export const getAllFolders = async (userId: number) => {
  const folders = await db.folder
    .findMany({
      where: { userId }
    });

  return folders;
}

export const getFolderById = async (userId: number, folderId: number) => {
  const folder = await db.folder
    .findUnique({
      where: { userId, id: folderId }
    });

  return folder;
}

export const insertFolder = async (userId: number, name: string) => {
  const folder = await db.folder
    .create({
      data: {
        name,
        userId
      }
    });

  return folder
}

export const updateFolder = async (userId: number, folderId: number, name: string) => {
  const folder = await db.folder
    .update({
      where: { id: folderId, userId },
      data: {
        name
      }
    });

  return folder;
}

export const deleteFolder = async (userId: number, folderId: number) => {
  const result = await db.folder.deleteMany({
    where: {
      id: folderId,
      userId
    },
  });

  return result.count > 0;
};
