import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserRepository from '@/repositories/user.repository';
import { User } from '@/models';
import config from '@/config';
import { errors } from '@/config/errors/errors-categories';

class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async login(cuil: string, plainTextPassword: string) {
    const validatedUser = (await this.validateUser(cuil, plainTextPassword)) as User & { _id: string };

    const token = jwt.sign({ _id: validatedUser._id }, config.JWT_SECRET);

    const userData = {
      _id: validatedUser._id,
      cuil: validatedUser.cuil,
      email: validatedUser.email,
      name: validatedUser.name,
      roleUser: validatedUser.roleUser,
      userType: validatedUser.userType,
    };

    return { token, userData };
  }

  async validateUser(cuil: string, plainPass: string): Promise<User> {
    if (!cuil || !plainPass) {
      throw errors.login.accounts.invalidInput;
    }
    const user = await this.userRepository.getUserByCuil(cuil);
    if (!user) {
      throw errors.login.accounts.unauthorized;
    }
    const isPasswordValid = await this.comparePasswords(plainPass, user.password!);
    if (!isPasswordValid) {
      throw errors.login.accounts.unauthorized;
    }
    return user;
  }

  private async comparePasswords(plainPass: string, storedPass: string): Promise<boolean> {
    if (storedPass.startsWith('$2a$') || storedPass.startsWith('$2b$')) {
      return bcrypt.compare(plainPass, storedPass);
    }
    return plainPass === storedPass;
  }

  async getUserInfo({ password, ...userInfoWithoutPassword }: User) {
    return userInfoWithoutPassword;
  }
}

export default AuthService;
