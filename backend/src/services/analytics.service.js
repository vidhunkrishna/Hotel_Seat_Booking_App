import { bookingsModel } from "../models/bookings.model.js";
import { tableModel } from "../models/table.model.js";
import { reviewModel } from "../models/reviews.model.js";
import { hotelModel } from "../models/hotel.model.js";

export const GetAnalytics = async (userId, userRole, hotelId) => {
  const hotel = await hotelModel.findById(hotelId);

  if (!hotel) {
    throw new Error("Hotel not found");
  }

  if (userRole !== "super_admin" && hotel.admin.toString() !== userId) {
    const error = new Error("You are not allowed to view this analytics");

    error.statusCode = 403;
    throw error;
  }

  const bookings = await bookingsModel.find({
    hotel: hotelId,
  });

  const totalBookings = bookings.length;

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "Confirmed",
  ).length;

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "Pending",
  ).length;

  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "Cancelled",
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === "Completed",
  ).length;

  const totalRevenue = bookings
    .filter(
      (booking) =>
        booking.status === "Confirmed" || booking.status === "Completed",
    )
    .reduce((total, booking) => total + (booking.amount || 0), 0);

  const totalTables = await tableModel.countDocuments({
    hotel: hotelId,
  });

  const reviews = await reviewModel.find({
    hotel: hotelId,
  });

  const totalReviews = reviews.length;

  const averageRating =
    totalReviews === 0
      ? 0
      : reviews.reduce((total, review) => total + review.rating, 0) /
        totalReviews;

  return {
    hotel: hotel.name,

    bookings: {
      total: totalBookings,
      confirmed: confirmedBookings,
      pending: pendingBookings,
      cancelled: cancelledBookings,
      completed: completedBookings,
    },

    revenue: totalRevenue,

    tables: totalTables,

    reviews: {
      total: totalReviews,
      averageRating: Number(averageRating.toFixed(2)),
    },
  };
};
