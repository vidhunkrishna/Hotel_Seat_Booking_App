import mongoose from "mongoose";
const users = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "hotel_admin", "super_admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);
export default users;
