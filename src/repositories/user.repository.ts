import { Model, Connection } from 'mongoose';
import { UserModel, UserSchema } from '@/models';

class UserRepository {
  private model: Model<UserModel>;

  constructor(private readonly connection: Connection) {
    this.model = this.connection.model<UserModel>('UserModel', UserSchema, 'users');
  }

  async getOrUpdateUser(cuil: string, name: string) {
    return this.model
      .findOneAndUpdate(
        { cuil }, // Search by cuil
        { $setOnInsert: { cuil, name } }, // Insert if not found
        { new: true, upsert: true } //
      )
      .lean();
  }
}

export default UserRepository;
