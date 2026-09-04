import { Router } from "express";
import { authmiddleware } from "../middleware/auth.authentication.middleware.js";
import { authorizationmiddleware } from "../middleware/auth.authorization.middlewire.js";
import {
  addtables,
  getTables,
  getTablebyId,
  patchTable,
  deleteTable,
} from "../controllers/table.controller.js";
export const tableRouter = Router();

tableRouter.post(
  "/hotels/:hotelId/tables",
  authmiddleware,
  authorizationmiddleware("super_admin", "hotel_admin"),
  addtables,
);
tableRouter.get("/hotels/:hotelId/tables", getTables);
tableRouter.get("/tables/:id", getTablebyId);
tableRouter.patch(
  "/tables/:id",
  authmiddleware,
  authorizationmiddleware("super_admin", "hotel_admin"),
  patchTable,
);
tableRouter.delete(
  "/tables/:id",
  authmiddleware,
  authorizationmiddleware("super_admin", "hotel_admin"),
  deleteTable,
);
