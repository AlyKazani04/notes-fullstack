import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import { env } from '../../env.ts';

export interface UserSession {
  id: number;
  email: string;
}

interface TokenStructure extends JwtPayload {
  user: UserSession;
}

export const generateToken = (sessionData: UserSession): string => {
  const secret: string = env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign({ user: sessionData }, secret, {
    algorithm: 'HS256',
    expiresIn: (env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'],
  });
}

export const verifyToken = (token: string) => {
  const secret = env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const decoded = jwt.verify(token, secret) as TokenStructure;

  if (!decoded || typeof decoded === 'string' || !decoded.user) {
    throw new Error('Invalid Payload Structure');
  }

  return decoded.user;
}
