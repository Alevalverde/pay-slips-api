import { paySlipRepository } from '@/repositories';
import PaySlipService from './pay-slip.service';
import GoogleDriveService from './google-drive.service';
import PaySlipProcessor from './pay-slip-processor';

const paySlipService = new PaySlipService(paySlipRepository);
const paySlipProcessor = new PaySlipProcessor();
const googleDriveService = new GoogleDriveService();

export { paySlipService, paySlipProcessor, googleDriveService };
