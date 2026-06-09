import mongoose from "mongoose";

const embeddedLinkSchema = new mongoose.Schema({
  title: String,

  url: {
    type: String,
    match: /^https?:\/\/.+/,
  },

  type: {
    type: String,
    enum: ["video", "article", "other"],
    default: "other",
  },
});

const candidateSchema = new mongoose.Schema(
  {
    electionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    avatar: String,

    bio: String,

    embeddedLinks: [embeddedLinkSchema],

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

candidateSchema.index(
  {
    electionId: 1,
    candidateIndexOnChain: 1,
  },
  {
    unique: true,
  }
);

candidateSchema.index(
  {
    electionId: 1,
    email: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model(
  "Candidate",
  candidateSchema
);