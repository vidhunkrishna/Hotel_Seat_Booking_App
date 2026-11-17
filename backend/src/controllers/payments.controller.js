import { Createpayment, Verifypayment } from "../services/payments.service.js";

export const createpayment = async (req, res) => {
  try {
    const data = await Createpayment(req.user.userId, req.body.bookingId);

    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

export const verifypayment = async (req, res) => {
  try {
    const data = await Verifypayment(
      req.user.userId,
      req.body.razorpay_order_id,
      req.body.razorpay_payment_id,
      req.body.razorpay_signature,
    );

    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
