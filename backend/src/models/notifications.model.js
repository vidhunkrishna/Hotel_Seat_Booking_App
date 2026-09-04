import mongoose from "mongoose";
import { notificationsScheama } from "../schemas/notifications.schema.js";

export const notificationsModel = mongoose.model(
  "Notification",
  notificationsScheama,
);
