import { Model, Connection, Types } from 'mongoose';
import { PaySlipModel, PaySlipSchema } from '@/models';

class PaySlipRepository {
  private model: Model<PaySlipModel>;

  constructor(private readonly connection: Connection) {
    this.model = this.connection.model<PaySlipModel>('PaySlipModel', PaySlipSchema, 'payslips');
  }

  async getPaySlip(id: Types.ObjectId) {
    return this.model.findById(id);
  }
}

export default PaySlipRepository;
