import { Document, Schema } from 'mongoose';

interface News {
  date: Date;
  title: string;
  subtitle: string;
  body: string;
  footer: string;
  img: string | null;
  status: boolean;
}

interface NewsModel extends News, Document {}

const NewsSchema: Schema = new Schema<NewsModel>(
  {
    date: { type: Date, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    body: { type: String, required: true },
    footer: { type: String, required: true },
    img: { type: String, required: false },
    status: { type: Boolean, required: true },
  },
  { timestamps: true, versionKey: false }
);

export { News, NewsModel, NewsSchema };
