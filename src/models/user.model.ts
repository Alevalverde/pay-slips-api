import { Document, Schema } from 'mongoose';
import { UserType } from '@/interfaces/enums';

interface User {
  cuil: string;
  name: string;
  status: boolean;
  userType: UserType[];
  roleUser: string;
  password?: string;
}

interface UserModel extends User, Document {}

const UserSchema: Schema = new Schema<UserModel>(
  {
    cuil: { type: String, required: true },
    name: { type: String, required: true },
    status: { type: Boolean, required: true },
    userType: { type: [String], required: false },
    roleUser: { type: String, required: false },
    password: { type: String, required: false },

  },
  { timestamps: true, versionKey: false }
);

export { User, UserModel, UserSchema };
