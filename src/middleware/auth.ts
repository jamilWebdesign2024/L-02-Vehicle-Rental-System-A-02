import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express'
import config from '../config';



//?auth middleware

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers['authorization'];

      if (!authHeader) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      // Extract token from "Bearer <token>"
      const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : authHeader;

      const decoded = jwt.verify(token, config.jwtSecret as string);
      (req as any).user = decoded as jwt.JwtPayload;

      if (roles.length && !roles.includes((decoded as any).role)) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
  };
}

export default auth;