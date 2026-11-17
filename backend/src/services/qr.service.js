import QRCode from "qrcode";
import crypto from "crypto";
import { bookingsModel } from "../models/bookings.model.js";
import { qrModel } from "../models/qr.model.js";
import { hotelModel } from "../models/hotel.model.js";

export const GenerateQR = async (userId, bookingId) => {
  const booking = await bookingsModel.findOne({
    _id: bookingId,
    user: userId,
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.status !== "Confirmed") {
    throw new Error("Booking is not confirmed");
  }

  if (booking.qrVerified) {
    throw new Error("QR has already been verified");
  }

  let qr = await qrModel.findOne({ booking: bookingId });

  if (!qr) {
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    qr = await qrModel.create({
      booking: bookingId,
      tokenHash,
      expiresAt: new Date(`${booking.date}T${booking.endTime}:00+05:30`),
    });

    const qrCode = await QRCode.toDataURL(token);

    return {
      bookingId: booking._id,
      qrCode,
    };
  }

  throw new Error("QR already generated. Request a new QR if needed.");
};

export const VerifyQR = async (userId, userRole, token) => {
  if (!token || typeof token !== "string") {
    throw new Error("Invalid QR token");
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const qr = await qrModel.findOne({
    tokenHash,
    verified: false,
    expiresAt: { $gt: new Date() },
  });

  if (!qr) {
    throw new Error("Invalid, expired or already used QR");
  }

  const booking = await bookingsModel.findOne({
    _id: qr.booking,
    status: "Confirmed",
    qrVerified: false,
  });

  if (!booking) {
    throw new Error("Booking is not valid");
  }

  if (userRole !== "super_admin") {
    const hotel = await hotelModel.findById(booking.hotel);

    if (!hotel || hotel.admin.toString() !== userId.toString()) {
      const error = new Error("You are not allowed to verify this booking");
      error.statusCode = 403;
      throw error;
    }
  }

  const verifiedQR = await qrModel.findOneAndUpdate(
    {
      _id: qr._id,
      verified: false,
      expiresAt: { $gt: new Date() },
    },
    {
      $set: {
        verified: true,
        verifiedBy: userId,
        verifiedAt: new Date(),
      },
    },
    { new: true },
  );

  if (!verifiedQR) {
    throw new Error("QR has already been verified");
  }

  const updatedBooking = await bookingsModel.findOneAndUpdate(
    {
      _id: booking._id,
      status: "Confirmed",
      qrVerified: false,
    },
    {
      $set: { qrVerified: true },
    },
    { new: true },
  );

  if (!updatedBooking) {
    throw new Error("Booking has already been verified");
  }

  return {
    message: "QR verified successfully",
    booking: updatedBooking,
  };
};
