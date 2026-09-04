import { Router } from "express";

import { authmiddleware } from "../middleware/auth.authentication.middleware.js";
import { authorizationmiddleware } from "../middleware/auth.authorization.middlewire.js";

import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getHotelBookings,
  updateBookingStatus,
  getAvailability,
} from "../controllers/bookings.controller.js";

export const bookingRouter = Router();

bookingRouter.get("/hotels/:hotelId/availability", getAvailability);

bookingRouter.post("/bookings", authmiddleware, createBooking);

bookingRouter.get("/bookings/my", authmiddleware, getMyBookings);

bookingRouter.get("/bookings/:id", authmiddleware, getBookingById);

bookingRouter.patch("/bookings/:id/cancel", authmiddleware, cancelBooking);

bookingRouter.get(
  "/hotels/:hotelId/bookings",
  authmiddleware,
  authorizationmiddleware("hotel_admin", "super_admin"),
  getHotelBookings,
);

bookingRouter.patch(
  "/bookings/:id/status",
  authmiddleware,
  authorizationmiddleware("hotel_admin", "super_admin"),
  updateBookingStatus,
);
