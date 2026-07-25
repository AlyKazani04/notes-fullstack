import jwt from 'jsonwebtoken';
import { env } from '../../env.ts';

// TODO: Set proper payload type here
export const generateToken = (payload: Object): string => {
  const secret = env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign(payload, secret);
}

export const verifyToken = (token: string) => {
  const secret = env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const decoded = jwt.verify(token, secret);
  return decoded;
}
