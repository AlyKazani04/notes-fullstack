import { prisma as db } from './db.ts';

export const getUserByID = async (id: number) => {
  try {
    const foundUser = await db.user
      .findUnique({
        where: { id },
      });

    return foundUser;
  } catch (e) {
    console.error('Failed to Find User\n', e);
    throw e;
  }
}

export const getUserByEmail = async (email: string) => {
  try {
    const foundUser = await db.user
      .findUnique({
        where: { email },
      });

    return foundUser;
  } catch (e) {
    console.error('Failed to Find User\n', e);
    throw e;
  }
}

export type UserSelect = {
  name: string;
  email: string;
  hashedPassword: string;
}

export const insertUser = async (user: UserSelect) => {
  try {
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
  catch (e) {
    console.error('Failed to Create User\n', e);
    throw e;
  }
}
