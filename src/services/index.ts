import { paySlipRepository, userRepository } from '@/repositories';
import PaySlipService from './pay-slip.service';
import GoogleDriveService from './google-drive.service';
import UserService from './users.service';

const googleDriveService = new GoogleDriveService();
const paySlipService = new PaySlipService(paySlipRepository, googleDriveService, userRepository);
const userService = new UserService(userRepository);

export { paySlipService, googleDriveService, userService };
