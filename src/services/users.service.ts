import { Types } from 'mongoose';
import UserRepository from '@/repositories/user.repository';
import errors from '@/config/errors';
import { Pagination, PaginationInfo } from '@/interface';
import { User } from '@/models';

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

  async getUserById(userId: Types.ObjectId) {
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
    const userId = new Types.ObjectId(id);
    const { cuil } = payload;
    let user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw errors.user.not_found;
    }
    user = await this.userRepository.getUserByCuil(cuil);
    if (user && user._id.toString() !== id) {
      throw errors.user.duplicate;
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
