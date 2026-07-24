import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.ts';

export const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      message: "Server: Access Denied. No token provided."
    });
  }

  try {
    const decoded = verifyToken(token);
    // TODO: Research this Request type mismatch
    req.userId = decoded.userId;

    next();
  } catch (e) {
    return res.status(401).json({
      message: "Server: Invalid or expired token."
    })
  }
}
