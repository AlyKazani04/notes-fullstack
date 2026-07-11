import { prisma } from './db.ts';

export const getNotes = async () => {
  const notes = await prisma.note.findMany();
  return notes;
}

export const postNote = async (newNote) => {
  const res = await prisma.note.create({
    data: {
      title: newNote.title,
      content: newNote.content
    },
  });
  return res;
}
