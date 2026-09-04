import mongoose from "mongoose";
import { reviewSchema } from "../schemas/reviews.schema.js";

export const reviewModel = mongoose.model("Review", reviewSchema);
