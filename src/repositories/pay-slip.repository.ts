import { Model, Connection, Types } from 'mongoose';
import { PaySlip, PaySlipModel, PaySlipSchema } from '@/models';

class PaySlipRepository {
  private model: Model<PaySlipModel>;

  constructor(private readonly connection: Connection) {
    this.model = this.connection.model<PaySlipModel>('PaySlipModel', PaySlipSchema, 'payslips');
  }

  async getPaySlip(id: Types.ObjectId) {
    return this.model.findById(id);
  }

  async uploadPaySlip(payslipDetails: PaySlip) {
    return this.model.create(payslipDetails);
  }

  async updatePaySlip(id: Types.ObjectId, payload: PaySlip) {
    return this.model.findOneAndUpdate({ _id: id }, { $set: payload }).lean();
  }

  async deletePaySlip(id: Types.ObjectId) {
    return this.model.deleteOne({ _id: id });
  }

  async getPaySlipsByUserId(userId: Types.ObjectId, year: string) {
    if (!year) {
      return this.model.find({ userId });
    }
    return this.model.find({ userId, year });
  }
}

export default PaySlipRepository;
