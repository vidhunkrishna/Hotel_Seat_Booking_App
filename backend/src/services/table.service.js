import { tableModel } from "../models/table.model.js";
import { hotelModel } from "../models/hotel.model.js";

export const AddTable = async (userId, userRole, hotelId, data) => {
  const hotel = await hotelModel.findOne({
    _id: hotelId,
  });

  if (!hotel) {
    throw new Error("No hotel found");
  }

  if (userRole !== "super_admin" && hotel.admin.toString() !== userId) {
    throw new Error("You are not allowed to add tables to this hotel");
  }

  return await tableModel.create({
    ...data,
    hotel: hotelId,
  });
};

export const GetTables = async (hotelId) => {
  return await tableModel.find({
    hotel: hotelId,
  });
};

export const GetTableById = async (id) => {
  return await tableModel.findOne({
    _id: id,
  });
};

export const PatchTable = async (userId, userRole, id, data) => {
  const table = await tableModel.findOne({
    _id: id,
  });

  if (!table) {
    throw new Error("No table found");
  }

  const hotel = await hotelModel.findOne({
    _id: table.hotel,
  });

  if (!hotel) {
    throw new Error("No hotel found");
  }

  if (userRole !== "super_admin" && hotel.admin.toString() !== userId) {
    throw new Error("You are not allowed to update this table");
  }

  return await tableModel.findByIdAndUpdate(id, data, {
    new: true,
  });
};

export const DeleteTable = async (userId, userRole, id) => {
  const table = await tableModel.findOne({
    _id: id,
  });

  if (!table) {
    throw new Error("No table found");
  }

  const hotel = await hotelModel.findOne({
    _id: table.hotel,
  });

  if (!hotel) {
    throw new Error("No hotel found");
  }

  if (userRole !== "super_admin" && hotel.admin.toString() !== userId) {
    throw new Error("You are not allowed to delete this table");
  }

  return await tableModel.deleteOne({
    _id: id,
  });
};
