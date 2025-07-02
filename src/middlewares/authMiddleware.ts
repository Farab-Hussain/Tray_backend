import { DecodedToken } from "../types";
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

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