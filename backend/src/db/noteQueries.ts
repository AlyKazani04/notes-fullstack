import { prisma as db } from './db.ts';

export const getNotes = async (userId: number, folderId?: number | null) => {
  const notes = await db.note
    .findMany({
      where: {
        userId,
        ...(folderId !== undefined && { folderId })
      }
    });

  return notes;
}

export const postNote = async (title: string, content: string, userId: number, folderId?: number | null) => {
  const note = await db.note
    .create({
      data: {
        title,
        content,
        userId,
        ...(folderId !== undefined && { folderId })
      },
    });

  return note;
};

export const updateNote = async (noteId: number, userId: number, data: { title?: string, content?: string, folderId?: number | null }) => {
  const note = await db.note
    .update({
      where: { id: noteId, userId },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.folderId !== undefined && { folderId: data.folderId }),
      },
    });

  return note;
};

export const deleteNote = async (noteId: number, userId: number, folderId?: number | null) => {
  const result = await db.note
    .deleteMany({
      where: {
        id: noteId,
        userId,
        ...(folderId !== undefined && { folderId: folderId })
      },
    });

  return result.count > 0;
};

export const deleteManyNotes = async (userId: number, noteIds: number[]) => {
  const result = await db.note
    .deleteMany({
      where: {
        userId,
        id: {
          in: noteIds
        }
      }
    });

  return result.count;
}
