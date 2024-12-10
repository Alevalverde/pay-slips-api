import connection from '@/config/databases';
import PaySlipRepository from './pay-slip.repository';

const paySlipRepository = new PaySlipRepository(connection);

export { paySlipRepository };
