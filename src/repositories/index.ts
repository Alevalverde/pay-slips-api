import connection from '@/config/databases';
import PaySlipRepository from './pay-slip.repository';
import UserRepository from './user.repository';
import NewsRepository from './news.repository';

const paySlipRepository = new PaySlipRepository(connection);
const userRepository = new UserRepository(connection);
const newsRepository = new NewsRepository(connection);

export { paySlipRepository, userRepository, newsRepository };
