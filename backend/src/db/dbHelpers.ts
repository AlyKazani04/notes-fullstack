import { prisma } from './db.ts';

export interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
};

export type CreateNoteInput = Omit<Note, 'id' | 'createdAt'>;

export const getNotes = async () => {
  try {
    const notes: Note[] = await prisma.note
      .findMany();

    return notes;
  } catch (e) {
    console.error('Failed to get Notes\n', e);
    throw e;
  }
}

export const getNoteByID = async (id: number) => {
  try {
    const foundNote: Note | null = await prisma.note
      .findUnique({
        where: { id },
      });

    return foundNote;
  } catch (e) {
    console.error('Failed to Find Note\n', e);
    throw e;
  }
}

export const postNote = async (newNote: CreateNoteInput) => {
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
    console.error('Failed to post Note\n', e);
    throw e;
  }
}

export const updateNoteByID = async (id: number, changes: Partial<CreateNoteInput>) => {
  try {
    const res = await prisma.note
      .update({
        where: { id },
        data: {
          title: changes.title,
          content: changes.content
        }
      });

    return res;
  } catch (e) {
    console.error('Failed to update note.\n', e);
    throw e;
  }
}

export const removeNoteByID = async (id: number) => {
  try {
    const res: Note = await prisma.note
      .delete({
        where: { id },
      });

    return res;
  } catch (e) {
    console.error('Failed to delete note.\n', e);
    throw e;
  }
}
