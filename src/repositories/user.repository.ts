import { Model, Connection, Types } from 'mongoose';
import { UserModel, UserSchema } from '@/models';
import { Pagination, SortDir } from '@/interface';

class UserRepository {
  private model: Model<UserModel>;

  constructor(private readonly connection: Connection) {
    this.model = this.connection.model<UserModel>('UserModel', UserSchema, 'users');
  }

  async getAllUsers(paginationObject: Pagination) {
    const { skip, limit, sort, dir } = paginationObject;
    const [data, total] = await Promise.all([
      this.model
        .find()
        .sort({ [sort as string]: dir as SortDir })
        .skip(skip!)
        .limit(limit as number)
        .lean(),
      this.model.countDocuments(),
    ]);
    return {
      data,
      total,
    };
  }

  /**
   * Finds a user by their CUIL and updates their name if they exist.
   * If the user does not exist, a new user is created with the provided CUIL and name.
   * @param cuil - The CUIL of the user.
   * @param name - The name of the user.
   * @returns A promise that resolves to the updated or newly created user document.
   */
  async getOrUpdateUser(cuil: string, name: string) {
    return this.model
      .findOneAndUpdate({ cuil }, { $setOnInsert: { cuil, name, status: true } }, { new: true, upsert: true })
      .lean();
  }

  async getUserById(userId: Types.ObjectId) {
    return this.model.findOne({ _id: userId }).lean();
  }
}

export default UserRepository;
