import { Router } from "express";
import {
  getnotifications,
  readbyid,
  readall,
} from "../controllers/notifications.controller.js";
import { authmiddleware } from "../middleware/auth.authentication.middleware.js";
export const notificationRouter = Router();
notificationRouter.get("/notifications", authmiddleware, getnotifications);
notificationRouter.patch("/notifications/:id/read", authmiddleware, readbyid);
notificationRouter.patch("/notifications/read-all", authmiddleware, readall);
