import { Response, CookieOptions } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.ts';
import { getUserByEmail, getUserByID, updateUser } from '../db/userQueries.ts';
import bcrypt from 'bcrypt';
import { comparePasswords, hashPassword } from '../utils/passwords.ts';
import env from '../../env.ts';

const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'prod',
  sameSite: env.NODE_ENV === 'prod' ? 'none' : 'lax',
};

export const logout = async (req: AuthenticatedRequest, res: Response) => {
  try {
    res.clearCookie('token', COOKIE_OPTIONS);

    return res.status(200).json({
      message: "Server: User Logged Out"
    })
  } catch (error) {
    console.error('Logout Error', error);

    return res.status(500).json({
      message: 'Server: Logout Failed',
      error: error instanceof Error ? error.message : 'Unknown Error',
    });
  }
}

export const profile = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      message: 'Server: Unauthorized',
    });
  }

  try {
    const user = await getUserByID(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "Server: User not found",

      });
    }

    return res.status(200).json({
      message: "Server: User Profile",
      user: {
        id: user.id,
        username: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Profile Error', error);

    return res.status(500).json({
      message: 'Server: Unable to get user profile',
      error: error instanceof Error ? error.message : 'Unknown Error',
    });
  }
}

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      message: 'Server: Unauthorized',
    });
  }

  try {
    const userId = req.user.id;
    const { name, email, currentPassword, newPassword } = req.body;

    const existingUser = await getUserByID(userId);
    if (!existingUser) {
      return res.status(404).json({
        message: 'Server: User not found'
      });
    }

    if (email && email !== existingUser.email) {
      const emailTaken = await getUserByEmail(email);
      if (emailTaken) {
        return res.status(400).json({
          message: 'Server: Email is already in use'
        });
      }
    }

    const updateData: { name?: string, email?: string, passwordHash?: string } = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          message: 'Server: Current password required'
        });
      }

      const isPasswordValid = await comparePasswords(currentPassword, existingUser.passwordHash);
      if (!isPasswordValid) {
        return res.status(400).json({
          message: 'Server: Incorrect current password'
        });
      }

      updateData.passwordHash = await hashPassword(newPassword);
    }

    const updatedUser = await updateUser(userId, updateData);

    return res.status(200).json({
      message: 'Server: Profile updated successfully',
      user: updatedUser
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
}
