import mongoose from "mongoose";
import { paymentSchema } from "../schemas/payments.schema.js";

export const paymentsModel = mongoose.model("Payment", paymentSchema);
