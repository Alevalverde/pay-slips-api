import { paySlipService, userService, authService } from '@/services';
import PaySlipController from './pay-slip.controller';
import UserController from './user.controller';
import AuthController from './auth.controller';

const paySlipController = new PaySlipController(paySlipService);
const userController = new UserController(userService);
const authController = new AuthController(authService);

export { paySlipController, userController, authController };
