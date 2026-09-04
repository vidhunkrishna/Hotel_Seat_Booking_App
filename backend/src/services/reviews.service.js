import { reviewModel } from "../models/reviews.model.js";
import { bookingsModel } from "../models/bookings.model.js";

export const Addreview = async (userId, hotelId, data) => {
  const bookings = await bookingsModel.findOne({
    hotel: hotelId,
    user: userId,
    status: "Completed",
  });
  if (!bookings) {
    throw new Error("User didnt book a table here so user cannot add review");
  }
  return await reviewModel.create({ user: userId, hotel: hotelId, ...data });
};

export const Getreviews = async (hotelId) => {
  return await reviewModel.find({ hotel: hotelId });
};

export const Editreview = async (userId, id, data) => {
  const review = await reviewModel.findOne({ _id: id });
  if (!review) {
    throw new Error("There is no such review");
  }
  if (review.user.toString() !== userId) {
    throw new Error("You are not allowed to do this");
  }
  return await reviewModel.findByIdAndUpdate(id, data, { new: true });
};

export const Deletereview = async (userId, id) => {
  const review = await reviewModel.findOne({ _id: id });
  if (!review) {
    throw new Error("There is no such review");
  }
  if (review.user.toString() !== userId) {
    throw new Error("You are not allowed to do this");
  }
  return await reviewModel.deleteOne({ _id: id });
};
