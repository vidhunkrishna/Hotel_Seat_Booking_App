import { notificationsModel } from "../models/notifications.model.js";

export const Getnotifications = async (userId) => {
  return await notificationsModel.find({ user: userId });
};
export const Readbyid = async (userId, id) => {
  const notification = await notificationsModel.findOne({ _id: id });
  if (!notification) {
    throw new Error("Notification not found");
  }
  if (notification.user.toString() !== userId) {
    throw new Error("User is not associated with this notification");
  }
  return await notificationsModel.findByIdAndUpdate(
    id,
    { read: true },
    { new: true },
  );
};
export const Readall = async (userId) => {
  return await notificationsModel.updateMany({ user: userId }, { read: true });
};
