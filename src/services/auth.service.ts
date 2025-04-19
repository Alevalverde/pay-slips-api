import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserRepository from '@/repositories/user.repository';
import { User } from '@/models';
import config from '@/config';
import { errors } from '@/config/errors/errors-categories';

class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async login(cuil: string, plainTextPassword: string) {
    const validatedUser: any = await this.validateUser(cuil, plainTextPassword);

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

  //   const userInfo: Pick<User, '_id' | 'email' | 'username' | 'role'> & { clientId: ObjectId | undefined } = {
  //     _id: userDoc._id,
  //     email: userDoc.email,
  //     username: userDoc.username,
  //     clientId: userDoc.client,
  //     role: userDoc.role,
  //   };
  //   return { token, userInfo };
  // }

  // async generateResetPasswordToken(email: string): Promise<{ token: string; expiresIn: number }> {
  //   const user = await this.userRepository.findOneByEmail(email);

  //   if (!user) {
  //     throw errors.login.users.unregistered;
  //   }

  //   const token = jwt.sign({ userId: user._id }, config.JWT_SECRET, {
  //     expiresIn: config.EXPIRE_TIME_TOKEN_RESET_PASSWORD,
  //   });
  //   user.resetPasswordToken = token;
  //   await this.userRepository.save(user);

  //   const resetUrl = `${config.FRONTEND_DOMAIN}${config.RESET_PASSWORD_FRONTEND_PATH}?token=${token}`;
  //   await sendResetPasswordEmail(email, resetUrl);
  //   // Convert expiration time settings to milliseconds
  //   const expiresInMilliseconds = ms(String(config.EXPIRE_TIME_TOKEN_RESET_PASSWORD));

  //   return { token, expiresIn: expiresInMilliseconds };
  // }

  // async resetPassword(token: string, newPassword: string): Promise<User> {
  //   try {
  //     const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload & { userId: string };

  //     this.validatePassword(newPassword);

  //     const user = await this.userRepository.findOneById(decoded.userId);
  //     if (!user || user.resetPasswordToken !== token) {
  //       throw errors.password_reset.token_invalid;
  //     }

  //     user.password = await this.hashPassword(newPassword);
  //     user.resetPasswordToken = undefined;
  //     await this.userRepository.save(user);
  //     return user;
  //   } catch (error) {
  //     if (error instanceof jwt.TokenExpiredError) {
  //       throw errors.password_reset.token_expired;
  //     } else if (error instanceof jwt.JsonWebTokenError) {
  //       throw errors.password_reset.token_invalid;
  //     }
  //     throw error;
  //   }
  // }

  // private validatePassword(password: string): void {
  //   if (password.length < 8) {
  //     throw errors.password_reset.password_too_short;
  //   }
  // }

  // private async hashPassword(password: string): Promise<string> {
  //   return bcrypt.hash(password, 10);
  // }

  // async getUserInfo(user: User) {
  //   const userObject = user.toObject();
  //   const { password, ...userInfoWithoutPassword } = userObject;

  //   return userInfoWithoutPassword;
  // }
}

export default AuthService;
