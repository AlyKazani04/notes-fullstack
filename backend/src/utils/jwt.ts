import jwt from 'jsonwebtoken';

// TODO: Set proper payload type here
export const generateToken = (payload: Object): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign(payload, secret);
}

export const verifyToken = (token: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const decoded = jwt.verify(token, secret);
  return decoded;
}
