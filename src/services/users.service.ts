import { Types } from 'mongoose';
import UserRepository from '@/repositories/user.repository';
import errors from '@/config/errors';
import { Pagination, PaginationInfo } from '@/interface';

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
}

export default UserService;
