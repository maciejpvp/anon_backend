import User from "../models/user.model";
import { catchAsync } from "../utils/catchAsync";

export const register = catchAsync(async (req, res) => {
  const { username, password, publicKey } = req.body;

  const user = await User.register(username, password, publicKey);

  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      username: user.username,
      profilePic: user.profilePic,
      publicKey: user.publicKey,
    },
  });
});

export const login = catchAsync(async (req, res) => {
  const { username, password } = req.body;
  const data = await User.login(username, password);
  res.cookie("token", data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: "lax",
  });
  res.status(200).json({
    success: true,
    data: data.user,
  });
});

export const checkAuth = catchAsync(async (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    data: user,
  });
});
