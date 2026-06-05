import User  from  "../users/user.model.js";
import jwt   from  "jsonwebtoken";

import {
  hashPassword,
  comparePassword,
} from "../../utils/hash.js";

import {
  generateAccessToken,
  generateRefreshToken,
}  from"../../utils/jwt.js";

/**
 * REGISTER
 */
export const register = async (data = {}) => {
  const { email, password, role, fullName } = data;

  if (!email || !password) {
    throw new Error("Email and password are importd");
  }

  const existingUser = await User.findOne({
    email: email.toLowerCase(),
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const passwordHash = await hashPassword(password);

  const user = await User.create({
    email: email.toLowerCase(),
    passwordHash,
    role: role || "voter",
    fullName,
  });

  return {
    status: "success",
    message: "Register success",
    data: {
      id: user._id,
      email: user.email,
    },
  };
};

/**
 * LOGIN
 */
export const login = async (data = {}) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new Error("Email and password are importd");
  }

  const user = await User.findOne({
    email: email.toLowerCase(),
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await comparePassword(
    password,
    user.passwordHash
  );

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const payload = {
    userId: user._id,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshToken = refreshToken;
  user.lastLogin = new Date();

  await user.save();

  return {
    status: "success",
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    },
  };
};

/**
 * REFRESH TOKEN
 */
const refresh = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("Missing refresh token");
  }

  let decoded;
  try {
    decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );
  } catch (err) {
    throw new Error("Invalid or expired refresh token");
  }

  const user = await User.findById(decoded.userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.refreshToken !== refreshToken) {
    throw new Error("Refresh token mismatch");
  }

  const newAccessToken = generateAccessToken({
    userId: user._id,
    role: user.role,
  });

  return {
    status: "success",
    accessToken: newAccessToken,
  };
};

/**
 * LOGOUT
 */
const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, {
    refreshToken: null,
  });

  return {
    status: "success",
    message: "Logout success",
  };
};

/**
 * ME
 */
const me = async (userId) => {
  const user = await User.findById(userId).select(
    "-passwordHash -refreshToken"
  );

  if (!user) {
    throw new Error("User not found");
  }

  return {
    status: "success",
    data: user,
  };
};

export default {
  register,
  login,
  refresh,
  logout,
  me,
};