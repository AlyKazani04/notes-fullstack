import { Request, Response, NextFunction } from 'express';
import { UserSession, verifyToken } from '../utils/jwt.ts';

export interface AuthenticatedRequest extends Request {
  user?: UserSession;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      message: "Server: Access Denied. No token provided."
    });
  }

  try {
    const session = verifyToken(token);
    req.user = session;

    next();
  } catch (e) {
    if (e instanceof Error && e.message.includes('JWT_SECRET')) {
      return res.status(500).json({
        message: `Server: Configuration Error: ${e.message}`
      })
    }

    return res.status(401).json({
      message: "Server: Invalid or expired token.",
      error: e instanceof Error ? e.message : String(e)
    });
  }
}
