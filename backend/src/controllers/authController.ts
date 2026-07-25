import { Request, Response, NextFunction } from 'express';
import { hashPassword } from '../utils/passwords.ts';
import { prisma as db } from '../db/db.ts';
import { generateToken, UserSession } from '../utils/jwt.ts';

export const register = async (req: Request, res: Response, next: NextFunction) => {
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
    })

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
