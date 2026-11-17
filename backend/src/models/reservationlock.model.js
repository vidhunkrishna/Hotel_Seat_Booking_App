import mongoose from "mongoose";

const reservationLockSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    reservations: [
      {
        booking: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Booking",
          required: true,
        },
        startTime: {
          type: String,
          required: true,
        },
        endTime: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
          default: "Pending",
        },
      },
    ],
  },
  { timestamps: true },
);

reservationLockSchema.index({ hotel: 1, table: 1, date: 1 }, { unique: true });

export const reservationLocksModel = mongoose.model(
  "ReservationLock",
  reservationLockSchema,
);
