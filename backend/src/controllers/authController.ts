import { Request, Response } from 'express';
import { comparePasswords, hashPassword } from '../utils/passwords.ts';
import { prisma as db } from '../db/db.ts';
import { generateToken, UserSession } from '../utils/jwt.ts';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await db.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        error: "User with this email already exists."
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
      },
    });

    const sessionDetails: UserSession = {
      id: user.id,
      username: user.name,
      email: user.email
    };
    const token = generateToken(sessionDetails);

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000           // One Week Expiration
    });

    return res.status(201).json({
      message: 'Server: User Created',
      user: {
        id: user.id,
        username: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration Error', error);
    res.status(500).json({ error: 'Failed to Create User' });
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await db.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        error: 'Invalid Credentials',
      });
    }

    const isValidatedPassword = await comparePasswords(password, user.passwordHash);

    if (!isValidatedPassword) {
      return res.status(401).json({
        error: 'Invalid Credentials',
      });
    }

    const token = generateToken({
      id: user.id,
      username: user.name,
      email: user.email
    });

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000           // One Week Expiration
    });

    return res.status(200).json({
      message: 'Server: Login Success',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    console.error('Login Error', error);
    res.status(500).json({ error: 'Failed to Log in User' });
  }
}
