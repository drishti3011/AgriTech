import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'agritech_super_secret_jwt_key_2026_secure';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

export interface JwtPayload {
  id: string;
  email: string;
  role: 'farmer' | 'admin' | 'expert';
  name: string;
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};
