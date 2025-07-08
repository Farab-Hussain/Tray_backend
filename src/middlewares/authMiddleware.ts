import { DecodedToken } from "../types";
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

// Logging middleware (for use in server.ts)
export const logger = morgan('dev');

// Rate limiting middleware (for use in server.ts)
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Example request validation middleware (replace with zod/joi/express-validator as needed)
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  // Example: check for required email field in body
  if (!req.body.email) {
    return res.status(400).json({ msg: 'Email is required' });
  }
  next();
};

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  console.log("verifyToken triggered");
  console.log("Header:", authHeader);
  console.log("Token:", token);

  if (!token) return res.status(401).json({ msg: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
    (req as any).user = decoded;
    next();
  } catch (err) {
    console.error("JWT Error:", err);
    return res.status(403).json({ msg: 'Forbidden' });
  }
};