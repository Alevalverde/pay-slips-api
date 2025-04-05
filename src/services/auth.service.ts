import bcrypt from 'bcryptjs';
import UserRepository from '@/repositories/user.repository';
import { User } from '@/models';
import { encryptPassword } from '@/utils';
import { errors } from '@/config/errors/errors-categories';

class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

 
  
  // async login(user: string, plainTextPassword: string) {
  //   const userDoc = await this.validateUser(user, plainTextPassword);
  //   const client = await this.clientRepository.findById(userDoc.client as ObjectId);
  //   const timezone = client?.timezone || config.DEFAULT_TIMEZONE;

  //   const token = jwt.sign({ _id: userDoc._id, timezone }, config.JWT_SECRET, {
  //     expiresIn: config.EXPIRE_TIME_TOKEN_USER_LOGGED,
  //   });

  //   const userInfo: Pick<User, '_id' | 'email' | 'username' | 'role'> & { clientId?: ObjectId; timezone: string } = {
  //     _id: userDoc._id,
  //     email: userDoc.email,
  //     username: userDoc.username,
  //     clientId: userDoc.client,
  //     role: userDoc.role,
  //     timezone,
  //   };

  //   return { token, userInfo };
  // }

  // async validateUser(user: string, plainTextPassword: string): Promise<User> {
  //   const userDoc: User | null = await this.userRepository.findOne(user);
  //   if (!userDoc) {
  //     throw errors.login.users.not_found;
  //   }
  //   const isMatch = await bcrypt.compare(plainTextPassword, userDoc.password);
  //   if (!isMatch) {
  //     throw errors.login.accounts.unauthorized;
  //   }
  //   return userDoc;
  // }


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
