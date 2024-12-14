import connection from '@/config/databases';
import PaySlipRepository from './pay-slip.repository';
import UserRepository from './user.repository';

const paySlipRepository = new PaySlipRepository(connection);
const userRepository = new UserRepository(connection);

export { paySlipRepository, userRepository };
