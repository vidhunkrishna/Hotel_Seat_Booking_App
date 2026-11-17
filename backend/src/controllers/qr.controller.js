import { GenerateQR, VerifyQR } from "../services/qr.service.js";

export const generateQR = async (req, res) => {
  try {
    const data = await GenerateQR(req.user.userId, req.params.id);
    res.status(200).json(data);
  } catch (err) {
    res.status(err.statusCode || 400).json({
      message: err.message,
    });
  }
};

export const verifyQR = async (req, res) => {
  try {
    const data = await VerifyQR(req.user.userId, req.user.role, req.body.token);

    res.status(200).json(data);
  } catch (err) {
    res.status(err.statusCode || 400).json({
      message: err.message,
    });
  }
};
