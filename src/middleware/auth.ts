import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      // const token = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: 'No token provided',
        });
      }

      const token = authHeader.split(' ')[1];

      // if (!token) {
      //   return res.status(500);
      // }

      const decoded = jwt.verify(
        token as string,
        config.JWT_SECRET as string
      ) as JwtPayload;

      req.user = decoded;

      // role check
      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Admin only',
        });
      }

      // const decoded = jwt.verify(
      //   token,
      //   config.JWT_SECRET as string
      // ) as JwtPayload;
      // console.log({ decoded });
      // req.user = decoded;
      // if (roles.length && !roles.includes(decoded.role as string)) {
      //   return res.status(500).json({
      //     success: false,
      //     message: 'Unauthorized!',
      //   });
      // }

      next();
    } catch (err: any) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }
  };
};

export default auth;
