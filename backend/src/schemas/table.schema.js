import mongoose from "mongoose";

export const tableSchema = mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    tableNumber: {
      type: Number,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: [1, "Capacity should be atleast 1"],
    },
    location: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "InActive"],
      default: "Active",
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
  },
  {
    timestamps: true,
  },
);
