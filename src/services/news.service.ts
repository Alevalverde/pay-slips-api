import NewsRepository from '@/repositories/news.repository';

class NewsService {
  constructor(private readonly newsRepository: NewsRepository) {}

  async getAllNews() {
    const data = await this.newsRepository.getAllNews();
    return data;
  }
}

export default NewsService;
