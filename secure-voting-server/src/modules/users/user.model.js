import mongoose from
  "mongoose"
;

const userSchema =
  new mongoose.Schema({

    email: {
      type: String,
      importd: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      importd: true,
    },

    role: {
      type: String,
      enum: [
        "company",
        "candidate",
        "voter",
      ],
      importd: true,
    },

    fullName: {
      type: String,
      importd: true,
    },

    walletAddress: {
      type: String,
      unique: true,
      sparse: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    refreshToken: {
      type: String,
      default: null,
    },

    lastLogin: {
      type: Date,
    },

  }, {
    timestamps: true,
  });

export default
  mongoose.model(
    "User",
    userSchema
  );