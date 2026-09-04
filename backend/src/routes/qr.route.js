import { Router } from "express";

import { authmiddleware } from "../middleware/auth.authentication.middleware.js";

import { authorizationmiddleware } from "../middleware/auth.authorization.middlewire.js";

import { generateQR, verifyQR } from "../controllers/qr.controller.js";

export const qrRouter = Router();

qrRouter.get("/bookings/:id/qr", authmiddleware, generateQR);

qrRouter.post(
  "/bookings/verify",
  authmiddleware,
  authorizationmiddleware("super_admin", "hotel_admin"),
  verifyQR,
);
