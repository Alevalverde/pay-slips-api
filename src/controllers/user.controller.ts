import mongoose from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import UserService from '@/services/users.service';
import { formatPaginationParams, prepareResponse } from '@/utils';

class UserController {
  constructor(private readonly userService: UserService) {}

  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paginationParams = formatPaginationParams(req.query);

      const { data, pagination } = await this.userService.getAllUsers(paginationParams);

      return res.json(prepareResponse(200, null, data, pagination));
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = new mongoose.Types.ObjectId(id);
      const data = await this.userService.getUserById(userId);
      return res.json(prepareResponse(200, null, data));
    } catch (error) {
      next(error);
    }
  };

  deleteUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      return id;
    } catch (error) {
      next(error);
    }
  };

  updateUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      return id;
    } catch (error) {
      next(error);
    }
  };

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      return id;
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
