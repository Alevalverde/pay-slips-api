import { NextFunction, Request, Response } from 'express';
import { FilterService, prepareResponse, SocialNetworks } from 'qsocialnow-common';

class FilterController {
  constructor(private readonly filterService: FilterService) {}

  getFilters = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const filters = await this.filterService.getAvailableFilters(id);
      return res.json(prepareResponse(200, null, filters));
    } catch (error) {
      next(error);
    }
  };

  getFiltersBySocialNetworks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { networkName } = req.params;

      const socialNetwork = SocialNetworks[networkName as keyof typeof SocialNetworks];

      const filters = await this.filterService.getSeriesByNetwork(id, socialNetwork);
      return res.json(prepareResponse(200, null, filters));
    } catch (error) {
      next(error);
    }
  };

  getFrontDates = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const filters = await this.filterService.getFrontDatesByClient(id);
      return res.json(prepareResponse(200, null, filters));
    } catch (error) {
      next(error);
    }
  };

  getEventMapOptions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.filterService.getEventMapOptions();
      return res.json(prepareResponse(200, null, response));
    } catch (error) {
      next(error);
    }
  };
}

export default FilterController;
