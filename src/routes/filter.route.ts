import { authenticate, cacheRequestMiddleware, validateProductAccess } from 'qsocialnow-common';
import { Router } from 'express';
import { filterController } from '../controllers';
import config from '@/config';

const router = Router();

router.get(
  '/clients/:id/filters',
  authenticate,
  validateProductAccess(config.PRODUCT_CODE),
  cacheRequestMiddleware,
  filterController.getFilters
);
router.get(
  '/clients/:id/filters/network/:networkName',
  authenticate,
  validateProductAccess(config.PRODUCT_CODE),
  cacheRequestMiddleware,
  filterController.getFiltersBySocialNetworks
);
router.get('/clients/:id/dates', authenticate, cacheRequestMiddleware, filterController.getFrontDates);
router.get('/filters/event-map', authenticate, cacheRequestMiddleware, filterController.getEventMapOptions);

export default router;
