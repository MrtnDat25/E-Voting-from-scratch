const mongoose = require("mongoose");

const embeddedLinkSchema =
  new mongoose.Schema({
    title: String,
    url: String,

    type: {
      type: String,

      enum: [
        "video",
        "article",
        "other",
      ],
    },
  });

const candidateSchema =
  new mongoose.Schema(
    {
      electionId: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Election",

        required: true,
      },

      userId: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        default: null,
      },

      email: {
        type: String,
        required: true,
      },

      name: {
        type: String,
        required: true,
      },

      avatar: String,

      bio: String,

      embeddedLinks: [
        embeddedLinkSchema,
      ],

      candidateIndexOnChain: {
        type: Number,
        required: true,
      },

      cachedVoteCount: {
        type: Number,
        default: 0,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Candidate",
    candidateSchema
  );