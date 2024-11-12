import { NextFunction, Request, Response } from 'express';
import { FilterService, SocialNetworks, prepareResponse, excelService } from 'qsocialnow-common';
import { getStrategy } from '@/services/chart/chart-service.factory';
import { ChartType } from '@/models/enums/chart-type.enum';
import { FiltersChartsDTO, FiltersExportableDTO } from '@/models';

class ChartController {
  constructor(private readonly filterService: FilterService) {}

  getChartData = async (req: Request & { filters?: FiltersChartsDTO }, res: Response, next: NextFunction) => {
    try {
      const { networkName, chartType } = req.params;

      const strategy = getStrategy(networkName as SocialNetworks, chartType as ChartType, this.filterService);

      const chartsWithPagination = [ChartType.DETAILED_EVENT_VIEW, ChartType.REPEATED_EVENTS];

      if (chartsWithPagination.includes(chartType as ChartType)) {
        const { data, pagination } = await strategy.getChartData(req.filters!, networkName as SocialNetworks);
        return res.json(prepareResponse(200, null, data, pagination));
      }

      const data = await strategy.getChartData(req.filters!, chartType);

      return res.json(prepareResponse(200, null, data));
    } catch (err) {
      return next(err);
    }
  };

  getExportable = async (req: Request & { filters?: FiltersExportableDTO }, res: Response, next: NextFunction) => {
    try {
      const { networkName, chartType } = req.params;

      const strategy = getStrategy(networkName as SocialNetworks, chartType as ChartType, this.filterService);

      const data = await strategy.getExportable(req.filters!, chartType, networkName as SocialNetworks);

      return await excelService.generateExcel(data, res);
    } catch (err) {
      return next(err);
    }
  };
}

export default ChartController;
