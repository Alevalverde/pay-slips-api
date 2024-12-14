import { paySlipRepository, userRepository } from '@/repositories';
import PaySlipService from './pay-slip.service';
import GoogleDriveService from './google-drive.service';

const googleDriveService = new GoogleDriveService();
const paySlipService = new PaySlipService(paySlipRepository, googleDriveService, userRepository);

export { paySlipService, googleDriveService };
