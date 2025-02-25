import { paySlipRepository, userRepository, newsRepository } from '@/repositories';
import PaySlipService from './pay-slip.service';
import GoogleDriveService from './google-drive.service';
import UserService from './users.service';
import AuthService from './auth.service';
import NewsService from './news.service';

const googleDriveService = new GoogleDriveService();
const paySlipService = new PaySlipService(paySlipRepository, googleDriveService, userRepository);
const userService = new UserService(userRepository);
const newsService = new NewsService(newsRepository);
const authService = new AuthService(userRepository);

export { paySlipService, googleDriveService, userService, authService, newsService };
