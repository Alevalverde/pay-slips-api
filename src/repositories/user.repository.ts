import { Model, Connection, Types, ClientSession } from 'mongoose';
import { User, UserModel, UserSchema } from '@/models';
import { Pagination, SortDir } from '@/interfaces';
import { Role, UserType } from '@/interfaces/enums';

class UserRepository {
  private model: Model<UserModel>;

  constructor(private readonly connection: Connection) {
    this.model = this.connection.model<UserModel>('UserModel', UserSchema, 'users');
  }

  async getAllUsers(params: Pagination & { name?: string }) {
    const { skip, limit, sort, dir, name } = params;
    const filter: any = {};
    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    const [data, total] = await Promise.all([
      this.model
        .find(filter)
        .sort({ [sort as string]: dir as SortDir })
        .skip(skip!)
        .limit(limit as number)
        .lean(),
      this.model.countDocuments(filter),
    ]);

    return {
      data,
      total,
    };
  }

  async getOrUpdateUser(cuil: string, name: string, session: ClientSession, isPayslip: boolean) {
    const userTypeToAdd = isPayslip ? UserType.EMPLOYEE : UserType.PAYMENT_HOLDER;

    const existingUser = await this.model
      .findOneAndUpdate(
        { cuil },
        {
          $set: {
            name,
            status: true,
            roleUser: Role.USER,
            password: cuil?.replace(/-/g, ''),
          },
          $addToSet: {
            userType: userTypeToAdd, // Agrega el nuevo userType si no existe
          },
        },
        { new: true, session }
      )
      .lean();
    if (!existingUser) {
      return this.model.create(
        [
          {
            cuil,
            name,
            status: true,
            userType: isPayslip ? [UserType.EMPLOYEE] : [UserType.PAYMENT_HOLDER],
            roleUser: Role.USER,
            password: cuil?.replace(/-/g, ''),
          },
        ],
        { session }
      );
    }
    return existingUser;
  }

  async getUserById(userId: Types.ObjectId) {
    return this.model.findOne({ _id: userId }).lean();
  }

  async getUserByName(name: string) {
    const regex = new RegExp(name, 'i');
    return this.model.find({ name: { $regex: regex } }).lean();
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
