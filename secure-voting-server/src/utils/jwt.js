const jwt = require(
  "jsonwebtoken"
);

const generateAccessToken =
  (payload) => {

    return jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );
};

const generateRefreshToken =
  (payload) => {

    return jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};


const bcrypt = require(
  "bcryptjs"
);

const hashPassword =
  async (password) => {

    return bcrypt.hash(
      password,
      12
    );
};

const comparePassword =
  async (
    password,
    hash
  ) => {

    return bcrypt.compare(
      password,
      hash
    );
};

module.exports = {
  hashPassword,
  comparePassword,
};