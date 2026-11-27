import {
  RegisterUser,
  LoginUser,
  GetUser,
  UpdateMyUser,
  GetAllUsers,
  GetUserById,
  UpdateUserRole,
  DeleteUser,
  refreshAccessToken,
  LogoutUser,
} from "../services/auth.service.js";
export const registerUser = async (req, res) => {
  const data = await RegisterUser(req.body);
  res.status(200).json(data);
};
export const loginUser = async (req, res) => {
  const data = await LoginUser(req.body);
  if (data) {
    res.cookie("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/api/auth",
    });
    res.status(200).json({ user: data.user, token: data.token });
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
export const RefreshAccessToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  const data = await refreshAccessToken(token);
  if (!data) {
    return res.status(401).json({
      message: "Session expired.Please log in again",
    });
  }
  const remainingTime = new Date(data.expiresAt).getTime() - Date.now();
  res.cookie("refreshToken", data.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: remainingTime,
    path: "/api/auth",
  });
  return res.status(200).json({ token: data.token });
};
export const logoutUser = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    await LogoutUser(token);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth",
    });

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to logout",
    });
  }
};
