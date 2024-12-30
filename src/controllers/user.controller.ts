import { NextFunction, Request, Response } from 'express';
import UserService from '@/services/users.service';
import { formatPaginationParams, prepareResponse } from '@/utils';
import { PaginationQuery } from '@/interfaces';

class UserController {
  constructor(private readonly userService: UserService) {}

  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paginationParams = formatPaginationParams(req.query as PaginationQuery);
      const { data, pagination } = await this.userService.getAllUsers(paginationParams);
      return res.json(prepareResponse(200, null, data, pagination));
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = await this.userService.getUserById(id);
      return res.json(prepareResponse(200, null, data));
    } catch (error) {
      next(error);
    }
  };

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body;
      await this.userService.createUser(payload);
      return res.json(prepareResponse(200, null));
    } catch (error) {
      next(error);
    }
  };

  updateUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const payload = req.body;
      await this.userService.updateUserById(id, payload);
      return res.json(prepareResponse(200, null));
    } catch (error) {
      next(error);
    }
  };

  deleteUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.userService.deleteUserById(id);
      return res.json(prepareResponse(200, null));
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
