import { bookingsModel } from "../models/bookings.model.js";
import { hotelModel } from "../models/hotel.model.js";
import { tableModel } from "../models/table.model.js";

export const CreateBooking = async (userId, data) => {
  const { hotel, table, date, startTime, endTime, guests } = data;

  const hotels = await hotelModel.findOne({
    _id: hotel,
  });

  if (!hotels) {
    throw new Error("No hotel found");
  }

  const tables = await tableModel.findOne({
    _id: table,
  });

  if (!tables) {
    throw new Error("No table found");
  }

  if (tables.hotel.toString() !== hotel) {
    throw new Error("Table does not belong to this hotel");
  }

  if (tables.capacity < Number(guests)) {
    throw new Error(
      "This table cannot contain this many people. Please choose another table",
    );
  }
  const amount = tables.price;
  const overlappingBooking = await bookingsModel.findOne({
    hotel: hotel,
    table: table,
    date: date,
    status: { $ne: "Cancelled" },
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
  });

  if (overlappingBooking) {
    throw new Error("Booking overlap");
  }

  return await bookingsModel.create({
    user: userId,
    hotel,
    table,
    date,
    startTime,
    endTime,
    guests,
    amount,
  });
};

export const GetMyBookings = async (userId) => {
  return await bookingsModel.find({ user: userId });
};

export const GetBookingById = async (userId, userRole, id) => {
  const booking = await bookingsModel.findOne({ _id: id });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.user.toString() === userId) {
    return booking;
  }

  if (userRole === "super_admin") {
    return booking;
  }

  const hotel = await hotelModel.findById(booking.hotel);

  if (!hotel) {
    throw new Error("Hotel not found");
  }

  if (hotel.admin.toString() !== userId) {
    const error = new Error("You are not allowed to view this booking");
    error.statusCode = 403;
    throw error;
  }

  return booking;
};

export const CancelBooking = async (userId, id) => {
  const booking = await bookingsModel.findOne({ _id: id });
  if (!booking) {
    throw new Error("No such booking exists");
  }
  if (booking.user.toString() !== userId) {
    throw new Error("You are not allowed to do this");
  }
  return await bookingsModel.findByIdAndUpdate(
    id,
    {
      status: "Cancelled",
    },
    {
      new: true,
    },
  );
};

export const GetHotelBookings = async (userId, userRole, hotelId) => {
  const hotel = await hotelModel.findById(hotelId);

  if (!hotel) {
    throw new Error("Hotel not found");
  }

  if (userRole !== "super_admin" && hotel.admin.toString() !== userId) {
    const error = new Error(
      "You are not allowed to view this hotel's bookings",
    );

    error.statusCode = 403;
    throw error;
  }

  return await bookingsModel.find({ hotel: hotelId });
};

export const UpdateBookingStatus = async (userId, userRole, id, status) => {
  if (!["Pending", "Confirmed", "Cancelled", "Completed"].includes(status)) {
    throw new Error("Invalid booking status");
  }

  const booking = await bookingsModel.findById(id);

  if (!booking) {
    throw new Error("No such booking exists to update");
  }

  if (userRole !== "super_admin") {
    const hotel = await hotelModel.findById(booking.hotel);

    if (!hotel) {
      throw new Error("Hotel not found");
    }

    if (hotel.admin.toString() !== userId) {
      const error = new Error("You are not allowed to update this booking");

      error.statusCode = 403;
      throw error;
    }
  }

  return await bookingsModel.findByIdAndUpdate(id, { status }, { new: true });
};

export const GetAvailability = async (
  hotelId,
  date,
  startTime,
  endTime,
  guests,
) => {
  const tables = await tableModel.find({
    hotel: hotelId,
    status: "Active",
    capacity: { $gte: Number(guests) },
  });
  const bookings = await bookingsModel.find({
    hotel: hotelId,
    date: date,
    status: { $ne: "Cancelled" },
  });
  const availableTables = tables.filter((table) => {
    const booked = bookings.some((booking) => {
      return (
        booking.table.toString() === table._id.toString() &&
        booking.startTime < endTime &&
        booking.endTime > startTime
      );
    });
    return !booked;
  });
  return availableTables;
};
