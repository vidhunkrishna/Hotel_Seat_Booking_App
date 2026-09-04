import {
  Addreview,
  Getreviews,
  Editreview,
  Deletereview,
} from "../services/reviews.service.js";

export const addreview = async (req, res) => {
  try {
    const data = await Addreview(req.user.userId, req.params.hotelId, req.body);

    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getreviews = async (req, res) => {
  try {
    const data = await Getreviews(req.params.hotelId);

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const editreview = async (req, res) => {
  try {
    const data = await Editreview(req.user.userId, req.params.id, req.body);

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const deletereview = async (req, res) => {
  try {
    const data = await Deletereview(req.user.userId, req.params.id);

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
