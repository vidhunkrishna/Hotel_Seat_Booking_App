import {
  RegisterUser,
  LoginUser,
  GetUser,
  UpdateMyUser,
  GetAllUsers,
  GetUserById,
  UpdateUserRole,
  DeleteUser,
} from "../services/auth.service.js";
export const registerUser = async (req, res) => {
  const data = await RegisterUser(req.body);
  res.status(200).json(data);
};
export const loginUser = async (req, res) => {
  const data = await LoginUser(req.body);
  if (data) {
    res.status(200).json(data);
  } else {
    res.status(401).json({
      message: "Invalid email or password",
    });
  }
};
export const getUser = async (req, res) => {
  const user = await GetUser(req.user.userId);
  res.status(200).json(user);
};
export const updateMyUser = async (req, res) => {
  try {
    const user = await UpdateMyUser(req.user.userId, req.body);

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await GetAllUsers();

    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
export const getUserById = async (req, res) => {
  try {
    const user = await GetUserById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
export const updateUserRole = async (req, res) => {
  try {
    const user = await UpdateUserRole(req.params.id, req.body.role);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const user = await DeleteUser(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
