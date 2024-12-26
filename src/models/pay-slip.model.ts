import { Document, Schema, Types } from 'mongoose';

interface PaySlip {
  name: string;
  month: string;
  year: string;
  url: string;
  userId: Types.ObjectId;
}

interface PaySlipModel extends PaySlip, Document {}

const PaySlipSchema: Schema = new Schema<PaySlipModel>(
  {
    name: { type: String, required: true },
    month: { type: String, required: true },
    year: { type: String, required: true },
    url: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true, versionKey: false }
);

export { PaySlip, PaySlipModel, PaySlipSchema };
