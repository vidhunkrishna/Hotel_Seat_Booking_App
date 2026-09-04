import { userModel } from "../models/user.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const RegisterUser = async (data) => {
  const { name, email, password } = data;
  const hashedpassword = await bcrypt.hash(password, 10);
  const dat = await userModel.create({ name, email, password: hashedpassword })
  return dat;
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
      const token = await jwt.sign(
        { userId: user._id, role: user.role },
        process.env.SECRET_KEY,
        {
          expiresIn: "1h",
        },
      );
      return {
        user: user,
        token: token,
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
