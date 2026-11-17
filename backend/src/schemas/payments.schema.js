import mongoose from "mongoose";

export const paymentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentId: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Success", "Failed", "Pending"],
      default: "Pending",
    },
    razorpayOrderId: {
      type: String,
      unique: true,
      sparse: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
  },
  {
    timestamps: true,
  },
);
