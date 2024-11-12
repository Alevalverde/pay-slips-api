import ChartController from './chart.controller';
import { filterService } from '../services';
import FilterController from './filter.controller';

const chartController = new ChartController(filterService);
const filterController = new FilterController(filterService);

export { chartController, filterController };
