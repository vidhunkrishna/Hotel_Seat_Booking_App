import { userModel } from "../models/user.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { refreshTokenModel } from "../models/refreshToken.model.js";
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.SECRET_KEY,
    { expiresIn: "15m" },
  );
};
export const RegisterUser = async (data) => {
  const { name, email, password } = data;
  const hashedpassword = await bcrypt.hash(password, 10);
  const dat = await userModel.create({ name, email, password: hashedpassword });
  return dat;
};
const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
export const LoginUser = async (data) => {
  const datas = await userModel.findOne({
    email: data.email,
  });
  if (!datas) {
    return null;
  }
  const dat = datas.toObject();
  if (dat) {
    const correct = await bcrypt.compare(data.password, dat.password);
    if (correct) {
      const { password, ...user } = dat;
      const token = generateToken(user);
      const refreshToken = await generateRefreshToken(user._id);
      return {
        user: user,
        token: token,
        refreshToken: refreshToken,
      };
    } else {
      return null;
    }
  }
};
export const GetUser = async (id) => {
  return await userModel.findOne({ _id: id }).select("name email role");
};
export const UpdateMyUser = async (userId, data) => {
  const { name, email } = data;

  return await userModel
    .findByIdAndUpdate(
      userId,
      {
        name,
        email,
      },
      {
        new: true,
        runValidators: true,
      },
    )
    .select("name email role");
};

export const GetAllUsers = async () => {
  return await userModel.find().select("name email role");
};

export const GetUserById = async (id) => {
  return await userModel.findById(id).select("name email role");
};

export const UpdateUserRole = async (id, role) => {
  if (!["user", "hotel_admin", "super_admin"].includes(role)) {
    throw new Error("Invalid role");
  }

  return await userModel
    .findByIdAndUpdate(
      id,
      { role },
      {
        new: true,
        runValidators: true,
      },
    )
    .select("name email role");
};

export const DeleteUser = async (id) => {
  return await userModel.findByIdAndDelete(id);
};
export const generateRefreshToken = async (userId) => {
  const refreshToken = crypto.randomBytes(64).toString("hex");
  const tokenHash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await refreshTokenModel.create({
    user: userId,
    tokenHash,
    expiresAt,
  });
  return refreshToken;
};
export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    return null;
  }
  const tokenHash = hashToken(refreshToken);
  const storedToken = await refreshTokenModel.findOne({
    tokenHash,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  });
  if (!storedToken) return null;
  const user = await userModel.findById(storedToken.user);
  if (!user) return null;
  const newRefreshToken = crypto.randomBytes(64).toString("hex");
  const newTokenHash = hashToken(newRefreshToken);
  const rotatedToken = await refreshTokenModel.findOneAndUpdate(
    {
      _id: storedToken._id,
      tokenHash,
      revokedAt: null,
      expiresAt: { $gt: new Date() },
    },
    {
      $set: {
        tokenHash: newTokenHash,
      },
    },
    {
      new: true,
    },
  );
  if (!rotatedToken) return null;
  const token = generateToken(user);
  return {
    token,
    refreshToken: newRefreshToken,
    expiresAt: rotatedToken.expiresAt,
  };
};
export const LogoutUser = async (refreshToken) => {
  if (!refreshToken) {
    return;
  }

  const tokenHash = hashToken(refreshToken);

  await refreshTokenModel.findOneAndUpdate(
    {
      tokenHash,
      revokedAt: null,
    },
    {
      $set: {
        revokedAt: new Date(),
      },
    },
  );
};
