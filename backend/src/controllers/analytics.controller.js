import { GetAnalytics } from "../services/analytics.service.js";

export const getAnalytics = async (req, res) => {
  try {
    const data = await GetAnalytics(
      req.user.userId,
      req.user.role,
      req.params.hotelId,
    );

    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
