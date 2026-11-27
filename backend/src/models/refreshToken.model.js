import mongoose from "mongoose";
import { refreshTokenSchema } from "../schemas/refreshToken.schema.js";

export const refreshTokenModel = mongoose.model(
  "refreshToken",
  refreshTokenSchema,
);
