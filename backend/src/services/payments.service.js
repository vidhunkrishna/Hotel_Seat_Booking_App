import { paymentsModel } from "../models/payments.model.js";
import { bookingsModel } from "../models/bookings.model.js";
import { notificationsModel } from "../models/notifications.model.js";
import mongoose from "mongoose";

export const Createpayment = async (userId, bookingId) => {
  const booking = await bookingsModel.findOne({
    _id: bookingId,
    user: userId,
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.status === "Cancelled") {
    throw new Error("Cannot make payment for a cancelled booking");
  }

  const existingPayment = await paymentsModel.findOne({
    booking: bookingId,
    status: "Success",
  });

  if (existingPayment) {
    throw new Error("Booking is already paid");
  }

  return await paymentsModel.create({
    user: userId,
    booking: bookingId,
    amount: booking.amount,
    status: "Pending",
  });
};

export const Verifypayment = async (userId, paymentId, status) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    if (!["Success", "Failed"].includes(status)) {
      throw new Error("Invalid payment status");
    }

    const payment = await paymentsModel
      .findOne({
        _id: paymentId,
        user: userId,
      })
      .session(session);

    if (!payment) {
      throw new Error("Payment not found");
    }

    if (payment.status === "Success") {
      throw new Error("Payment is already successful");
    }

    if (status === "Success") {
      payment.status = "Success";
      await payment.save({ session });

      const booking = await bookingsModel.findByIdAndUpdate(
        payment.booking,
        {
          status: "Confirmed",
        },
        {
          new: true,
          session,
        },
      );

      if (!booking) {
        throw new Error("Booking not found");
      }

      await notificationsModel.create(
        [
          {
            user: userId,
            message:
              "Your payment was successful and your booking has been confirmed.",
            type: "Payment",
            read: false,
          },
        ],
        {
          session,
        },
      );
    } else {
      payment.status = "Failed";

      await payment.save({ session });
    }

    await session.commitTransaction();

    return payment;
  } catch (err) {
    await session.abortTransaction();

    throw err;
  } finally {
    await session.endSession();
  }
};
