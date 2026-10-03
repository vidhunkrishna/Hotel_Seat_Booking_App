import QRCode from "qrcode";
import { bookingsModel } from "../models/bookings.model.js";

export const GenerateQR = async (userId, bookingId) => {
  const booking = await bookingsModel.findOne({
    _id: bookingId,
    user: userId,
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.status !== "Confirmed") {
    throw new Error("QR can only be generated for a confirmed booking");
  }

  if (booking.qrVerified) {
    throw new Error("QR has already been verified");
  }

  const qrData = JSON.stringify({
    bookingId: booking._id.toString(),
  });

  const qrCode = await QRCode.toDataURL(qrData);

  return {
    bookingId: booking._id,
    qrCode: qrCode,
  };
};

export const VerifyQR = async (userId, userRole, bookingId) => {
  const booking = await bookingsModel.findById(bookingId);

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.status === "Cancelled") {
    throw new Error("This booking has been cancelled");
  }

  if (booking.status !== "Confirmed") {
    throw new Error("Booking is not confirmed");
  }

  if (booking.qrVerified) {
    throw new Error("QR has already been verified");
  }

  if (userRole !== "super_admin") {
    const hotel = await hotelModel.findById(booking.hotel);

    if (!hotel) {
      throw new Error("Hotel not found");
    }

    if (hotel.admin.toString() !== userId) {
      const error = new Error("You are not allowed to verify this booking");

      error.statusCode = 403;
      throw error;
    }
  }

  booking.qrVerified = true;

  await booking.save();

  return booking;
};
