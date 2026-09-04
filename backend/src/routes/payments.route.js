import { Router } from "express";
import { authmiddleware } from "../middleware/auth.authentication.middleware.js";
import {
  createpayment,
  verifypayment,
} from "../controllers/payments.controller.js";
export const paymentsRouter = Router();

paymentsRouter.post("/payments/create", authmiddleware, createpayment);
paymentsRouter.post("/payments/verify", authmiddleware, verifypayment);
