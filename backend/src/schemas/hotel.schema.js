import mongoose from "mongoose";

export const hotelschema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String, match: [/^\d{6}$/, "Enter correct pinncode"] },
    },
    contact: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Mobile number is must be exactly 10 numbers"],
    },
    openingTime: {
      type: String,
      required: true,
    },
    closingTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "inActive"],
      default: "Active",
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
