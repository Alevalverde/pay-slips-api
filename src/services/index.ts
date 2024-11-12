import { FilterService } from 'qsocialnow-common';
import {
  clientRepository,
  eventModelRepository,
  locationRepository,
  serieRepository,
  countryRepository,
} from '@/repositories';

const filterService = new FilterService(
  clientRepository,
  serieRepository,
  eventModelRepository,
  locationRepository,
  countryRepository
);

export { filterService };
