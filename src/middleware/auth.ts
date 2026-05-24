import type { NextFunction, Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import type { TRoles } from '../types/types';
import config from '../config/env';
import { pool } from '../db/db';

const auth = (...roles: TRoles[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized access!',
        });
        return;
      }

      // VerifyToken
      const decodedToken = jwt.verify(
        token as string,
        config.secret as string,
      ) as JwtPayload;
      // console.log(decodedToken);

      // FindUserInDatabase
      const userData = await pool.query(
        `
        SELECT * FROM users WHERE id = $1
        `,
        [decodedToken.id],
      );
      // console.log(userData);

      if (userData.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'User not found!',
        });
        return;
      }

      const user = userData.rows[0];

      // UserRoleExistsOrNot
      if (roles.length && !roles.includes(user.role)) {
        res.status(403).json({
          success: false,
          message: 'Forbidden access!',
        });
        return;
      }

      req.user = decodedToken;

      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized access! Token expired or invalid.',
      });
    }
  };
};
export default auth;
