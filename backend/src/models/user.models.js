import mongoose from "mongoose";
import users from "../schemas/user.schema.js";

export const userModel = mongoose.model("User", users);
