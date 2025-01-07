import { Types } from 'mongoose';
import UserRepository from '@/repositories/user.repository';
import errors from '@/config/errors';
import { Pagination, PaginationInfo } from '@/interfaces';
import { User } from '@/models';
import { encryptPassword } from '@/utils';

class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAllUsers(paginationParams: Pagination) {
    const { page, limit } = paginationParams;

    const { data, total } = await this.userRepository.getAllUsers(paginationParams);

    const pagination: PaginationInfo = {
      count: total,
      page: Number(page),
      page_size: Number(limit),
    };
    return { data, pagination };
  }

  async getUserById(id: string) {
    const userId = new Types.ObjectId(id);
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw errors.user.not_found;
    }
    return user;
  }

  async createUser(payload: User) {
    const { cuil } = payload;
    const user = await this.userRepository.getUserByCuil(cuil);
    if (user) {
      throw errors.user.duplicate;
    }
    await this.userRepository.createUser(payload);
  }

  async updateUserById(id: string, payload: User) {
    const { cuil, password } = payload;
    const userId = new Types.ObjectId(id);

    let user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw errors.user.not_found;
    }

    if (cuil) {
      user = await this.userRepository.getUserByCuil(cuil);
      if (user && user._id.toString() !== id) {
        throw errors.user.duplicate;
      }
    }

    if (password) {
      payload.password = await encryptPassword(password);
    }
    await this.userRepository.updateUserById(userId, payload);
  }

  async deleteUserById(id: string) {
    const userId = new Types.ObjectId(id);
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw errors.user.not_found;
    }
    await this.userRepository.deleteUserById(userId);
  }
}

export default UserService;
