import { paySlipService, userService, authService, newsService } from '@/services';
import PaySlipController from './pay-slip.controller';
import UserController from './user.controller';
import AuthController from './auth.controller';
import NewsController from './news.controller';

const paySlipController = new PaySlipController(paySlipService);
const userController = new UserController(userService);
const newsController = new NewsController(newsService);
const authController = new AuthController(authService);

export { paySlipController, userController, authController, newsController };
