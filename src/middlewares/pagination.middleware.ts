import { NextFunction, Request, Response } from 'express';
import { paginate, sortBy } from '@/utils';

export const pagination = (req: Request, res: Response, next: NextFunction) => {
  Object.assign(req.query, { ...paginate(req.query), ...sortBy(req.query) });
  next();
};
