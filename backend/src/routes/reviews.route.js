import { Router } from "express";
import { authmiddleware } from "../middleware/auth.authentication.middleware.js";
import {
  addreview,
  getreviews,
  editreview,
  deletereview,
} from "../controllers/reviews.controller.js";
export const reviewRouter = Router();
reviewRouter.post("/hotels/:hotelId/reviews", authmiddleware, addreview);
reviewRouter.get("/hotels/:hotelId/reviews", getreviews);
reviewRouter.patch("/reviews/:id", authmiddleware, editreview);
reviewRouter.delete("/reviews/:id", authmiddleware, deletereview);
