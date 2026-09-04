import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUser,
  updateMyUser,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
} from "../controllers/auth.controller.js";
import { authmiddleware } from "../middleware/auth.authentication.middleware.js";
import { authorizationmiddleware } from "../middleware/auth.authorization.middlewire.js";
export const router = Router();

router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.get("/auth/me", authmiddleware, getUser);
router.get("/users/me", authmiddleware, getUser);

router.patch("/users/me", authmiddleware, updateMyUser);

router.get(
  "/users",
  authmiddleware,
  authorizationmiddleware("super_admin"),
  getAllUsers,
);

router.get(
  "/users/:id",
  authmiddleware,
  authorizationmiddleware("super_admin"),
  getUserById,
);

router.patch(
  "/users/:id/role",
  authmiddleware,
  authorizationmiddleware("super_admin"),
  updateUserRole,
);

router.delete(
  "/users/:id",
  authmiddleware,
  authorizationmiddleware("super_admin"),
  deleteUser,
);
