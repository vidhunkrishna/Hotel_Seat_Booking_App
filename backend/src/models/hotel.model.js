import mongoose from "mongoose";
import { hotelschema } from "../schemas/hotel.schema.js";

export const hotelModel = mongoose.model("Hotel", hotelschema);
