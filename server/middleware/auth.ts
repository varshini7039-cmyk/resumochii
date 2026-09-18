import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { DB } from '../database/store';
import { IUser } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'resumochi_super_secret_jwt_key_2026';

// Extend Express Request interface to include user
export interface AuthRequest extends Request {
  user?: IUser;
}

export function generateToken(user: { _id: string; email: string; role: string; name: string }): string {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Authentication verification middleware
export async function protect(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  let token: string | undefined;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.',
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
    const user = await DB.findUserById(decoded.id);

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Authentication failed. User account no longer exists.',
      });
      return;
    }

    req.user = user;
    next();
  } catch (err: any) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.',
    });
  }
}

// Admin role check middleware
export function adminOnly(req: AuthRequest, res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({
      success: false,
      message: 'Access forbidden. Administrator privileges required.',
    });
    return;
  }
  next();
}
