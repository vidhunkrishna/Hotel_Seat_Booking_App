import { Router } from "express";

import { authmiddleware } from "../middleware/auth.authentication.middleware.js";

import { authorizationmiddleware } from "../middleware/auth.authorization.middlewire.js";

import { getAnalytics } from "../controllers/analytics.controller.js";

export const analyticsRouter = Router();

analyticsRouter.get(
  "/hotels/:hotelId/analytics",
  authmiddleware,
  authorizationmiddleware("super_admin", "hotel_admin"),
  getAnalytics,
);
