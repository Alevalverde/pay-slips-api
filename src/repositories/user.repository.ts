import { Model, Connection, Types } from 'mongoose';
import { User, UserModel, UserSchema } from '@/models';
import { Pagination, SortDir } from '@/interfaces';

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

  async getOrUpdateUser(cuil: string, name: string) {
    return this.model
      .findOneAndUpdate(
        { cuil },
        { $setOnInsert: { cuil, name, status: true, type: ['prueba'], password: null } },
        { new: true, upsert: true }
      )
      .lean();
  }

  async getUserById(userId: Types.ObjectId) {
    return this.model.findOne({ _id: userId }).lean();
  }

  async getUserByCuil(cuil: string) {
    const user = await this.model.findOne({ cuil }).lean();
    return user;
  }

  async createUser(payload: User) {
    return this.model.create(payload);
  }

  async updateUserById(id: Types.ObjectId, payload: User) {
    return this.model.findOneAndUpdate({ _id: id }, { $set: payload }).lean();
  }

  async deleteUserById(id: Types.ObjectId) {
    return this.model.deleteOne({ _id: id });
  }
}

export default UserRepository;
