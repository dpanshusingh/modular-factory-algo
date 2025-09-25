import { Request, Response, NextFunction } from 'express';
import { verifyIdToken } from '../utils/firebase';
import { CustomError } from '../types/customErrorInterface';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    name?: string;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    

    if (!token) {
      const error: CustomError = new Error('Access token required');
      error.status = 401;
      throw error;
    }

    const decodedToken = await verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
    };

    next();
  } catch (error) {
    const authError: CustomError = new Error('Invalid or expired token');
    authError.status = 401;
    next(authError);
  }
};

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // This would typically check the user's role from the database
  // For now, we'll implement a basic check
  // In a real application, you'd fetch the user's role from your database
  next();
};
