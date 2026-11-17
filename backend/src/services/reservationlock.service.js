import { reservationLocksModel } from "../models/reservationLock.model.js";

export const EnsureReservationLocks = async (hotel, tables, date) => {
  for (const table of tables) {
    try {
      await reservationLocksModel.updateOne(
        { hotel, table, date },
        {
          $setOnInsert: {
            hotel,
            table,
            date,
            reservations: [],
          },
        },
        { upsert: true },
      );
    } catch (error) {
      if (error.code !== 11000) {
        throw error;
      }
    }
  }
};

export const AcquireReservationLock = async (
  session,
  hotel,
  table,
  date,
  startTime,
  endTime,
  bookingId,
) => {
  const lock = await reservationLocksModel.findOneAndUpdate(
    {
      hotel,
      table,
      date,
      reservations: {
        $not: {
          $elemMatch: {
            status: { $ne: "Cancelled" },
            startTime: { $lt: endTime },
            endTime: { $gt: startTime },
          },
        },
      },
    },
    {
      $push: {
        reservations: {
          booking: bookingId,
          startTime,
          endTime,
          status: "Pending",
        },
      },
    },
    {
      new: true,
      session,
    },
  );

  if (!lock) {
    const error = new Error(`Table ${table} is already reserved for this time`);
    error.statusCode = 409;
    throw error;
  }

  return lock;
};
export const ReleaseReservationLock = async (
  session,
  hotel,
  tables,
  date,
  bookingId,
) => {
  for (const table of tables) {
    const result = await reservationLocksModel.updateOne(
      {
        hotel,
        table,
        date,
        reservations: {
          $elemMatch: {
            booking: bookingId,
            status: { $ne: "Cancelled" },
          },
        },
      },
      {
        $set: {
          "reservations.$.status": "Cancelled",
        },
      },
      { session },
    );
    if (result.modifiedCount !== 1) {
      throw new Error(`Failed to release reservation lock for table ${table}`);
    }
  }
};
