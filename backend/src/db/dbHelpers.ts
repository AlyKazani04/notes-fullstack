import { prisma } from './db.ts';

export interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
};

export const getNotes = async () => {
  try {
    const notes = await prisma.note
      .findMany();
    return notes;
  } catch (e) {
    console.error('Failed to get Notes', e);
  }
}

export const postNote = async (newNote: Note) => {
  try {
    const res = await prisma.note
      .create({
        data: {
          title: newNote.title,
          content: newNote.content
        },
      });
    return res;
  } catch (e) {
    console.error('Failed to post Note', e);
  }
}

export const updateNote = async (changes: Note) => {
  try {
    const res = await prisma.note
      .update({
        where: { id: changes.id },
        data: {
          title: changes.title,
          content: changes.content
        }
      });
    return res;
  } catch (e) {
    console.error('Failed to update note.', e);
  }
}

export const removeNote = async (noteToDelete: Note) => {
  try {
    await prisma.note
      .delete({
        where: { id: noteToDelete.id },
      });
  } catch (e) {
    console.error('Failed to delete note.', e);
  }
}
