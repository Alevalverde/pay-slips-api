import { Document, Schema } from 'mongoose';

interface User {
  name: string;
  cuil: string;
  status: boolean;
}

interface UserModel extends User, Document {}

const UserSchema: Schema = new Schema<UserModel>(
  {
    name: { type: String, required: true },
    cuil: { type: String, required: true },
    status: { type: Boolean, required: true },
  },
  { timestamps: true, versionKey: false }
);

export { User, UserModel, UserSchema };
