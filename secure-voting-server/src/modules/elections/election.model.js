const mongoose =
  require("mongoose");

const electionSchema =
  new mongoose.Schema(
    {
      companyId: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,
      },

      title: {
        type: String,
        required: true,
      },

      description: {
        type: String,
      },

      electionType: {
        type: String,

        enum: [
          "public",
          "private",
        ],

        required: true,
      },

      inviteCode: {
        type: String,

        unique: true,

        sparse: true,
      },

      status: {
        type: String,

        enum: [
          "draft",
          "registration_open",
          "voting_open",
          "voting_closed",
          "counting",
          "published",
          "archived",
        ],

        default: "draft",
      },

      paillierPublicKey: {
        n: {
          type: String,
          required: true,
        },

        g: {
          type: String,
          required: true,
        },
      },

      blockchainTxHash: {
        type: String,
      },

      electionHashOnChain: {
        type: String,
      },

      startTime: {
        type: Date,
        required: true,
      },

      endTime: {
        type: Date,
        required: true,
      },
    },

    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Election",
    electionSchema
  );