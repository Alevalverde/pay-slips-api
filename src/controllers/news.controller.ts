import { NextFunction, Request, Response } from 'express';
import { prepareResponse } from '@/utils';
import NewsService from '@/services/news.service';

class NewsController {
  constructor(private readonly newsService: NewsService) {}

  getAllNews = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.newsService.getAllNews();
      return res.json(prepareResponse(200, null, data));
    } catch (error) {
      next(error);
    }
  };
}

export default NewsController;
