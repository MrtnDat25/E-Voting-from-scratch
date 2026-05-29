const User = require(
  "../users/user.model"
);

const jwt = require(
  "jsonwebtoken"
);

const {
  hashPassword,
  comparePassword,
} = require(
  "../../utils/hash"
);

const {
  generateAccessToken,
  generateRefreshToken,
} = require(
  "../../utils/jwt"
);

exports.register =
  async (data) => {

    const {
      email,
      password,
      role,
      fullName,
    } = data;

    const existing =
      await User.findOne({
        email:
          email.toLowerCase(),
      });

    if (existing) {
      throw new Error(
        "Email already exists"
      );
    }

    const passwordHash =
      await hashPassword(
        password
      );

    const user =
      await User.create({

        email:
          email.toLowerCase(),

        passwordHash,

        role,

        fullName,
      });

    return {
      status: "success",
      message:
        "Register success",
      data: {
        id: user._id,
        email: user.email,
      },
    };
};

exports.login =
  async (data) => {

    const {
      email,
      password,
    } = data;

    const user =
      await User.findOne({
        email:
          email.toLowerCase(),
      });

    if (!user) {
      throw new Error(
        "User not found"
      );
    }

    const match =
      await comparePassword(
        password,
        user.passwordHash
      );

    if (!match) {
      throw new Error(
        "Wrong password"
      );
    }

    const accessToken =
      generateAccessToken({
        userId: user._id,
        role: user.role,
      });

    const refreshToken =
      generateRefreshToken({
        userId: user._id,
      });

    user.refreshToken =
      refreshToken;

    user.lastLogin =
      new Date();

    await user.save();

    return {
      status: "success",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        fullName:
          user.fullName,
      },
    };
};

exports.refresh =
  async (refreshToken) => {

    if (!refreshToken) {
      throw new Error(
        "Missing refresh token"
      );
    }

    const decoded =
      jwt.verify(
        refreshToken,
        process.env
          .JWT_REFRESH_SECRET
      );

    const user =
      await User.findById(
        decoded.userId
      );

    if (!user) {
      throw new Error(
        "User not found"
      );
    }

    if (
      user.refreshToken !==
      refreshToken
    ) {
      throw new Error(
        "Invalid refresh token"
      );
    }

    const newAccessToken =
      generateAccessToken({
        userId: user._id,
        role: user.role,
      });

    return {
      status: "success",
      accessToken:
        newAccessToken,
    };
};

exports.logout =
  async (userId) => {

    await User.findByIdAndUpdate(
      userId,
      {
        refreshToken: null,
      }
    );

    return {
      status: "success",
      message:
        "Logout success",
    };
};

exports.me =
  async (userId) => {

    const user =
      await User.findById(
        userId
      ).select(
        "-passwordHash -refreshToken"
      );

    return {
      status: "success",
      data: user,
    };
};