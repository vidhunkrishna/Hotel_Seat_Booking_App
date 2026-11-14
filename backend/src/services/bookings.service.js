import { bookingsModel } from "../models/bookings.model.js";
import { hotelModel } from "../models/hotel.model.js";
import { tableModel } from "../models/table.model.js";

const populateBooking = (query) =>
  query
    .populate("hotel", "name imageurl address")
    .populate("tables", "tableNumber capacity location price");

export const CreateBooking = async (userId, data) => {
  const { hotel, tables, date, startTime, endTime, guests } = data;

  const hotels = await hotelModel.findById(hotel);

  if (!hotels) {
    throw new Error("No hotel found");
  }

  if (!Array.isArray(tables) || tables.length === 0) {
    throw new Error("Please select at least one table");
  }

  if (new Set(tables).size !== tables.length) {
    throw new Error("Duplicate tables are not allowed");
  }

  if (!date || !startTime || !endTime) {
    throw new Error("Date and time are required");
  }

  if (startTime >= endTime) {
    throw new Error("End time must be after start time");
  }

  if (!Number.isInteger(Number(guests)) || Number(guests) < 1) {
    throw new Error("Invalid guest count");
  }

  const selectedTables = await tableModel.find({
    _id: { $in: tables },
    hotel: hotel,
    status: "Active",
  });

  if (selectedTables.length !== tables.length) {
    throw new Error("Some tables are invalid or inactive");
  }

  const totalCapacity = selectedTables.reduce(
    (total, table) => total + table.capacity,
    0,
  );

  if (totalCapacity < Number(guests)) {
    throw new Error("Selected tables cannot accommodate this many guests");
  }

  const amount = selectedTables.reduce(
    (total, table) => total + table.price,
    0,
  );

  const overlappingBooking = await bookingsModel.findOne({
    hotel: hotel,
    tables: { $in: tables },
    date: date,
    status: { $ne: "Cancelled" },
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
  });

  if (overlappingBooking) {
    throw new Error("One or more selected tables are already booked");
  }

  const booking = await bookingsModel.create({
    user: userId,
    hotel,
    tables,
    date,
    startTime,
    endTime,
    guests,
    amount,
  });

  return await populateBooking(bookingsModel.findById(booking._id));
};

export const GetMyBookings = async (userId) => {
  return await populateBooking(bookingsModel.find({ user: userId }));
};

export const GetBookingById = async (userId, userRole, id) => {
  const booking = await bookingsModel.findOne({ _id: id });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.user.toString() === userId) {
    return await populateBooking(bookingsModel.findById(id));
  }

  if (userRole === "super_admin") {
    return await populateBooking(bookingsModel.findById(id));
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

  return await populateBooking(bookingsModel.findById(id));
};

export const CancelBooking = async (userId, id) => {
  const booking = await bookingsModel.findOne({ _id: id });

  if (!booking) {
    throw new Error("No such booking exists");
  }

  if (booking.user.toString() !== userId) {
    throw new Error("You are not allowed to do this");
  }

  return await populateBooking(
    bookingsModel.findByIdAndUpdate(id, { status: "Cancelled" }, { new: true }),
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

  return await populateBooking(bookingsModel.find({ hotel: hotelId }));
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

  return await populateBooking(
    bookingsModel.findByIdAndUpdate(id, { status }, { new: true }),
  );
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
  });

  const bookings = await bookingsModel.find({
    hotel: hotelId,
    date: date,
    status: { $ne: "Cancelled" },
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
  });

  const bookedTables = bookings.flatMap((booking) =>
    (booking.tables || []).map((table) => table.toString()),
  );

  const availableTables = tables.filter(
    (table) => !bookedTables.includes(table._id.toString()),
  );

  return availableTables;
};
