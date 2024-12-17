import { Types } from 'mongoose';
import UserRepository from '@/repositories/user.repository';
import errors from '@/config/errors';
import { Pagination, PaginationInfo } from '@/interface';

class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAllUsers(paginationObject: Pagination) {
    const { page, limit } = paginationObject;

    const { data, total } = await this.userRepository.getAllUsers(paginationObject);

    const pagination: PaginationInfo = {
      count: total,
      page,
      page_size: limit,
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
