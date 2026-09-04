import mongoose from "mongoose";
import { bookingSchema } from "../schemas/bookings.schema.js";

export const bookingsModel = mongoose.model("Booking", bookingSchema);
