import SerieRepository from 'qsocialnow-common/lib/repositories/serie.repository';
import ClientRepository from 'qsocialnow-common/lib/repositories/client.repository';
import EventModelRepository from 'qsocialnow-common/lib/repositories/event-model.repository';
import LocationRepository from 'qsocialnow-common/lib/repositories/location.repository';
import CategoryRepository from 'qsocialnow-common/lib/repositories/category.repository';
import CountryRepository from 'qsocialnow-common/lib/repositories/country.repository';
import TwitterRepository from './twitter.repository';
import InstagramRepository from './instagram.repository';
import FacebookRepository from './facebook.repository';
import TiktokRepository from './tiktok.repository';
import { appSocialDBConnection, etlDBConnection } from '@/config/databases/mongo';

const serieRepository = new SerieRepository(etlDBConnection);
const twitterRepository = new TwitterRepository(etlDBConnection);
const instagramRepository = new InstagramRepository(etlDBConnection);
const facebookRepository = new FacebookRepository(etlDBConnection);
const tiktokRepository = new TiktokRepository(etlDBConnection);
const clientRepository = new ClientRepository(appSocialDBConnection);
const eventModelRepository = new EventModelRepository(etlDBConnection);
const categoryRepository = new CategoryRepository(etlDBConnection);
const locationRepository = new LocationRepository(etlDBConnection);
const countryRepository = new CountryRepository(etlDBConnection);

export {
  twitterRepository,
  instagramRepository,
  facebookRepository,
  tiktokRepository,
  clientRepository,
  serieRepository,
  eventModelRepository,
  categoryRepository,
  locationRepository,
  countryRepository,
};
