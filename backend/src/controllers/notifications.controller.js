import {
  Getnotifications,
  Readbyid,
  Readall,
} from "../services/notifications.service.js";

export const getnotifications = async (req, res) => {
  try {
    const data = await Getnotifications(req.user.userId);

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const readbyid = async (req, res) => {
  try {
    const data = await Readbyid(req.user.userId, req.params.id);

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const readall = async (req, res) => {
  try {
    const data = await Readall(req.user.userId);

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
