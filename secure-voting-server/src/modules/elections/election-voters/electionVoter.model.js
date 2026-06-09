import mongoose from "mongoose";

const electionVoterSchema = new mongoose.Schema(
  {
    electionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true,
    },

    voterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isEligible: {
      type: Boolean,
      default: true,
    },

    votingTokenHash: {
      type: String,
      default: null,
    },

    hasVoted: {
      type: Boolean,
      default: false,
    },

    votedAt: {
      type: Date,
      default: null,
    },

    blockchainBallotHash: {
      type: String,
      default: null,
    },

    blockchainTxHash: {
      type: String,
      default: null,
    },

    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

electionVoterSchema.index(
  { electionId: 1, voterId: 1 },
  { unique: true }
);

export default mongoose.model("ElectionVoter", electionVoterSchema);