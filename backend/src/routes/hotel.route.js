import { Router } from "express";

import { authmiddleware } from "../middleware/auth.authentication.middleware.js";
import { authorizationmiddleware } from "../middleware/auth.authorization.middlewire.js";

import {
  addHotel,
  getHotels,
  getHotelbyId,
  patchHotelById,
  deleteHotel,
  getManagedHotel,
} from "../controllers/hotel.controller.js";

export const hotelRouter = Router();

hotelRouter.post(
  "/",
  authmiddleware,
  authorizationmiddleware("hotel_admin", "super_admin"),
  addHotel,
);

hotelRouter.get("/", getHotels);
hotelRouter.get(
  "/managed",
  authmiddleware,
  authorizationmiddleware("hotel_admin", "super_admin"),
  getManagedHotel,
);
hotelRouter.get("/:id", getHotelbyId);

hotelRouter.patch(
  "/:id",
  authmiddleware,
  authorizationmiddleware("hotel_admin", "super_admin"),
  patchHotelById,
);

hotelRouter.delete(
  "/:id",
  authmiddleware,
  authorizationmiddleware("hotel_admin", "super_admin"),
  deleteHotel,
);
