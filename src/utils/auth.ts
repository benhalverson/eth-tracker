import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


// JWT authentication middleware
export const jwtCheck = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid authorization header" });
  }

  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', { algorithms: ['HS256'] });
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired JWT token" });
  }
};