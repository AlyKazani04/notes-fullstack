import { prisma as db } from './db.ts';

export const getUserByID = async (id: number) => {
  const foundUser = await db.user
    .findUnique({
      where: { id },
    });

  return foundUser;
}

export const getUserByEmail = async (email: string) => {
  const foundUser = await db.user
    .findUnique({
      where: { email },
    });

  return foundUser;
}

export type UserSelect = {
  name: string;
  email: string;
  hashedPassword: string;
}

export const insertUser = async (name: string, email: string, hashedPassword: string) => {
  const res = await db.user
    .create({
      data: {
        name: name,
        email: email,
        passwordHash: hashedPassword
      },
    });

  return res;
}

export const updateUser = async (userId: number, data: { name?: string, email?: string, passwordHash?: string }) => {
  const res = await db.user
    .update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      }
    });

  return res;
}
