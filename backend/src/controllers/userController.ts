import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { getUserByID } from '../db/userQueries';


export const logout = async (req: AuthenticatedRequest, res: Response) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'lax',
    })

    res.status(200).json({
      message: "Server: User Logged Out"
    })
  } catch (error) {
    console.error('Logout Error', error);

    res.status(500).json({
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

    res.status(500).json({
      message: 'Server: Unable to get user profile',
      error: error instanceof Error ? error.message : 'Unknown Error',
    });
  }
}
