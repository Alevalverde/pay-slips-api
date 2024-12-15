import { Model, Connection, Types } from 'mongoose';
import { PaySlip, PaySlipModel, PaySlipSchema } from '@/models';

class PaySlipRepository {
  private model: Model<PaySlipModel>;

  constructor(private readonly connection: Connection) {
    this.model = this.connection.model<PaySlipModel>('PaySlipModel', PaySlipSchema, 'payslips');
  }


  /**
   * Finds a payslip document by its ID.
   * @param id - The ID of the payslip to find.
   * @returns The payslip document if found, or null if not found.
   */
  async getPaySlip(id: Types.ObjectId) {
    return this.model.findById(id);
  }
  
  /**
   * Saves a payslip PDF to the database.
   * @param payslipDetails - The details of the payslip to be saved, including the name, month, year, and URL.
   * @returns The saved payslip document.
   */
  async uploadPaySlip(payslipDetails: PaySlip) {
    return this.model.create(payslipDetails);
  }
}

export default PaySlipRepository;
