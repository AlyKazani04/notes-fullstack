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

export const insertUser = async (user: UserSelect) => {
  const res = await db.user
    .create({
      data: {
        name: user.name,
        email: user.email,
        passwordHash: user.hashedPassword
      }
    });

  return res;
}
