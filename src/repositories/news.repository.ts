import { Model, Connection } from 'mongoose';
import { NewsModel, NewsSchema } from '@/models';

class NewsRepository {
  private model: Model<NewsModel>;

  constructor(private readonly connection: Connection) {
    this.model = this.connection.model<NewsModel>('NewsModel', NewsSchema, 'news');
  }

  async getAllNews() {
    const data = await this.model.find().lean();
    return data;
  }
}

export default NewsRepository;
