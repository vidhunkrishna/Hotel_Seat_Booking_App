import { hotelModel } from "../models/hotel.model.js";

export const AddHotel = async (adminId, data) => {
  const { name, description, address, contact, openingTime, closingTime } =
    data;
  return await hotelModel.create({
    name,
    description,
    address,
    contact,
    openingTime,
    closingTime,
    admin: adminId,
  });
};
export const GetHotels = async () => {
  return await hotelModel.find().populate({
    path: "admin",
    select: "name email role -_id ",
  });
};
export const GetHotelById = async (id) => {
  return await hotelModel
    .findOne({
      _id: id,
    })
    .populate({
      path: "admin",
      select: "name email role -_id",
    });
};
export const PatchHotelById = async (userId, userRole, id, data) => {
  const hotel = await hotelModel.findById(id);

  if (!hotel) {
    throw new Error("Hotel not found");
  }

  if (userRole !== "super_admin" && hotel.admin.toString() !== userId) {
    throw new Error("You are not allowed to modify this hotel");
  }

  return await hotelModel.findByIdAndUpdate(id, data, {
    new: true,
  });
};
export const DeleteHotel = async (userId, userRole, id) => {
  const hotel = await hotelModel.findById(id);

  if (!hotel) {
    throw new Error("Hotel not found");
  }

  if (userRole !== "super_admin" && hotel.admin.toString() !== userId) {
    throw new Error("You are not allowed to delete this hotel");
  }

  return await hotelModel.deleteOne({ _id: id });
};
