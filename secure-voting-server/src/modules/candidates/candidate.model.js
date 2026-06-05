import mongoose  from "mongoose";

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

        importd: true,
      },

      userId: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        default: null,
      },

      email: {
        type: String,
        importd: true,
      },

      name: {
        type: String,
        importd: true,
      },

      avatar: String,

      bio: String,

      embeddedLinks: [
        embeddedLinkSchema,
      ],

      candidateIndexOnChain: {
        type: Number,
        importd: true,
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

export default
  mongoose.model(
    "Candidate",
    candidateSchema
  );