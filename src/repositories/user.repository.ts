import { Model, Connection } from 'mongoose';
import { UserModel, UserSchema } from '@/models';

class UserRepository {
  private model: Model<UserModel>;

  constructor(private readonly connection: Connection) {
    this.model = this.connection.model<UserModel>('UserModel', UserSchema, 'users');
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
      .findOneAndUpdate(
        { cuil }, 
        { $setOnInsert: { cuil, name } }, 
        { new: true, upsert: true } 
      )
      .lean();
  }
}

export default UserRepository;
