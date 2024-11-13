import { paySlipService } from "@/services";
import PaySlipController from "./filter.controller";


const paySlipController = new PaySlipController(paySlipService);

export { paySlipController };
