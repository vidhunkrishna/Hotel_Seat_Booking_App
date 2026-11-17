import { paymentsModel } from "../models/payments.model.js";
import { bookingsModel } from "../models/bookings.model.js";
import { notificationsModel } from "../models/notifications.model.js";
import { razorpay } from "../config/Razorpay.js";
import mongoose from "mongoose";
import crypto from "crypto";
export const Createpayment = async (userId, bookingId) => {
  const booking = await bookingsModel.findOne({
    _id: bookingId,
    user: userId,
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.status !== "Pending") {
    throw new Error("Payment is not allowed for this booking");
  }

  const existingPayment = await paymentsModel.findOne({
    booking: bookingId,
    status: "Success",
  });

  if (existingPayment) {
    throw new Error("Booking is already paid");
  }

  const pendingPayment = await paymentsModel.findOne({
    booking: bookingId,
    status: "Pending",
    razorpayOrderId: { $exists: true, $ne: null },
  });

  if (pendingPayment) {
    return {
      payment: pendingPayment,
      keyId: process.env.RAZOR_KEY_ID,
    };
  }

  if (!Number.isFinite(booking.amount) || booking.amount < 1) {
    throw new Error("Invalid booking amount");
  }

  const order = await razorpay.orders.create({
    amount: Math.round(booking.amount * 100),
    currency: "INR",
    receipt: `booking_${booking._id}_${Date.now()}`,
    notes: {
      bookingId: booking._id.toString(),
      userId: userId.toString(),
    },
  });

  const payment = await paymentsModel.create({
    user: userId,
    booking: bookingId,
    amount: booking.amount,
    currency: "INR",
    razorpayOrderId: order.id,
    status: "Pending",
  });

  return {
    payment,
    keyId: process.env.RAZOR_KEY_ID,
  };
};

export const Verifypayment = async (userId, orderId, paymentId, signature) => {
  const session = await mongoose.startSession();

  try {
    let verifiedPayment;

    await session.withTransaction(async () => {
      const payment = await paymentsModel
        .findOne({
          user: userId,
          razorpayOrderId: orderId,
        })
        .session(session);

      if (!payment) {
        throw new Error("Payment not found");
      }

      if (payment.status === "Success") {
        throw new Error("Payment is already successful");
      }

      if (payment.status === "Failed") {
        throw new Error("Payment has already failed");
      }

      const body = `${orderId}|${paymentId}`;

      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZOR_KEY_SECRET)
        .update(body)
        .digest("hex");

      const signatureBuffer = Buffer.from(signature, "hex");
      const expectedBuffer = Buffer.from(expectedSignature, "hex");

      if (
        signatureBuffer.length !== expectedBuffer.length ||
        !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
      ) {
        throw new Error("Invalid payment signature");
      }

      const booking = await bookingsModel
        .findOne({
          _id: payment.booking,
          user: userId,
          status: "Pending",
        })
        .session(session);

      if (!booking) {
        throw new Error("Booking not found or cannot be confirmed");
      }

      payment.paymentId = paymentId;
      payment.status = "Success";

      await payment.save({ session });

      booking.status = "Confirmed";
      await booking.save({ session });

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
        { session },
      );

      verifiedPayment = payment;
    });

    return verifiedPayment;
  } finally {
    await session.endSession();
  }
};
