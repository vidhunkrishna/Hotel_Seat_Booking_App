import {
  CreateBooking,
  GetMyBookings,
  GetBookingById,
  CancelBooking,
  GetHotelBookings,
  UpdateBookingStatus,
  GetAvailability,
} from "../services/bookings.service.js";

export const createBooking = async (req, res) => {
  const data = await CreateBooking(req.user.userId, req.body);

  res.status(201).json(data);
};

export const getMyBookings = async (req, res) => {
  const data = await GetMyBookings(req.user.userId);

  res.status(200).json(data);
};

export const getBookingById = async (req, res) => {
  const data = await GetBookingById(
    req.user.userId,
    req.user.role,
    req.params.id,
  );

  res.status(200).json(data);
};

export const cancelBooking = async (req, res) => {
  const data = await CancelBooking(req.user.userId, req.params.id);

  res.status(200).json(data);
};

export const getHotelBookings = async (req, res) => {
  try {
    const data = await GetHotelBookings(
      req.user.userId,
      req.user.role,
      req.params.hotelId,
    );

    res.status(200).json(data);
  } catch (error) {
    res.status(error.statusCode || 400).json({
      message: error.message,
    });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const data = await UpdateBookingStatus(
      req.user.userId,
      req.user.role,
      req.params.id,
      req.body.status,
    );

    res.status(200).json(data);
  } catch (error) {
    res.status(error.statusCode || 400).json({
      message: error.message,
    });
  }
};

export const getAvailability = async (req, res) => {
  const { date, startTime, endTime, guests } = req.query;

  const data = await GetAvailability(
    req.params.hotelId,
    date,
    startTime,
    endTime,
    guests,
  );

  res.status(200).json(data);
};
