
import { DBConnection } from '@/config/databases/mongo';
import PaySlipRepository from './pay-slip.repository';

const paySlipRepository = new PaySlipRepository(DBConnection);

export { paySlipRepository };
