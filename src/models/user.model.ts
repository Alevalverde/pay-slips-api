import { Document, Schema } from 'mongoose';

interface User {
  name: string;
  cuil: string;
  status: boolean;
  password?: string;
}

interface UserModel extends User, Document {}

const UserSchema: Schema = new Schema<UserModel>(
  {
    name: { type: String, required: true },
    cuil: { type: String, required: true },
    status: { type: Boolean, required: true },
    password: { type: String, required: false },
  },
  { timestamps: true, versionKey: false }
);

export { User, UserModel, UserSchema };
