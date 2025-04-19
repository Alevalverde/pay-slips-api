/* eslint-disable no-underscore-dangle */
import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { userRepository } from '@/repositories';
import config from '@/config';
import { logger } from '@/utils';
import { User } from '@/models';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.JWT_SECRET,
};

passport.use(
  new JwtStrategy(options, async (jwt_payload, done) => {
    try {
      const user = await userRepository.getUserById(jwt_payload._id);
      if (user) {
        return done(null, { ...user });
      }
      return done(null, false);
    } catch (error) {
      logger.error(error);
      return done(error, false);
    }
  })
);

export default passport;

const handleAuthError = (info: Record<string, string>) => {
  if (info && info.name === 'TokenExpiredError') {
    return { status: 401, message: 'Token expired' };
  }
  if (info && info.name === 'JsonWebTokenError') {
    return { status: 401, message: 'Unauthorized' };
  }
  return { status: 401, message: 'Unauthorized' };
};

export const authorize = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: Error, user: User, info: Record<string, string>) => {
    if (err) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    if (!user) {
      const errorResponse = handleAuthError(info);
      return res.status(errorResponse.status).json({ message: errorResponse.message });
    }
    req.user = user;
    return next();
  })(req, res, next);
};
