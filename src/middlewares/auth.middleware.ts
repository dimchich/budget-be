import { NextFunction, Response } from 'express';
import { getRepository } from 'typeorm';
import jwt from 'jsonwebtoken';
import HttpException from '../exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '../interfaces/auth.interface';
import { UserEntity } from '../entity/users.entity';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const cookies = req.cookies;

    if (cookies && cookies.Authorization) {
      const secret = process.env.JWT_SECRET;
      const verificationResponse = (await jwt.verify(cookies.Authorization, secret)) as DataStoredInToken;
      const userId = verificationResponse.id;

      const userRepository = getRepository(UserEntity);
      const findUser = await userRepository.findOne(userId, { select: ['id', 'name', 'email'] });

      if (findUser) {
        req.user = findUser;
      }
    }
    next();
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

const notLoggedIn = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  if (req.user) next(new HttpException(403, 'Forbidden'));
  next();
};

const isLoggedIn = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  if (!req.user) next(new HttpException(403, 'Forbidden'));
  next();
};

export { authMiddleware, notLoggedIn, isLoggedIn };
