import { paySlipService, userService } from '@/services';
import PaySlipController from './pay-slip.controller';
import UserController from './user.controller';

const paySlipController = new PaySlipController(paySlipService);
const userController = new UserController(userService);

export { paySlipController, userController };
