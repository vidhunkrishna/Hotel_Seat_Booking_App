import {
  AddHotel,
  GetHotels,
  GetHotelById,
  PatchHotelById,
  DeleteHotel,
} from "../services/hotel.service.js";

export const addHotel = async (req, res) => {
  try {
    const data = await AddHotel(req.user.userId, req.body);

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create hotel",
      error: error.message,
    });
  }
};

export const getHotels = async (req, res) => {
  try {
    const data = await GetHotels();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch hotels",
      error: error.message,
    });
  }
};

export const getHotelbyId = async (req, res) => {
  try {
    const data = await GetHotelById(req.params.id);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch hotel",
      error: error.message,
    });
  }
};

export const patchHotelById = async (req, res) => {
  try {
    const data = await PatchHotelById(
      req.user.userId,
      req.user.role,
      req.params.id,
      req.body,
    );

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update hotel",
      error: error.message,
    });
  }
};

export const deleteHotel = async (req, res) => {
  try {
    const data = await DeleteHotel(
      req.user.userId,
      req.user.role,
      req.params.id,
    );

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete hotel",
      error: error.message,
    });
  }
};
