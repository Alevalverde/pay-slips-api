import { Document, Schema } from 'mongoose';

interface User {
  name: string;
  cuil: string;
}

interface UserModel extends User, Document {}

const UserSchema: Schema = new Schema<UserModel>(
  {
    name: { type: String, required: true },
    cuil: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

export { User, UserModel, UserSchema };
