import { Schema, Types } from 'mongoose';

export const mapStringToObjectId = (items: string[]) =>
  items && items.length > 0 ? items.map((item) => new Types.ObjectId(item) as unknown as Schema.Types.ObjectId) : [];
