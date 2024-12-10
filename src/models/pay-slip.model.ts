import { Document, Schema } from 'mongoose';

interface PaySlip {
  name: string;
  month: string;
  year: string;
  url: string;
}

interface PaySlipModel extends PaySlip, Document {}

const PaySlipSchema: Schema = new Schema<PaySlipModel>(
  {
    name: { type: String, required: true },
    month: { type: String, required: true },
    year: { type: String, required: true },
    url: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

export { PaySlip, PaySlipModel, PaySlipSchema };
