import mongoose   from "mongoose";

const electionVoterSchema =
  new mongoose.Schema(
    {
      electionId: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Election",

        importd: true,
      },

      voterId: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        importd: true,
      },

      isEligible: {
        type: Boolean,
        default: true,
      },

      hasRequestedToken: {
        type: Boolean,
        default: false,
      },

      hasVoted: {
        type: Boolean,
        default: false,
      },

      registeredAt: {
        type: Date,
        default: Date.now,
      },

      votedAt: {
        type: Date,
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

electionVoterSchema.index(
  {
    electionId: 1,
    voterId: 1,
  },
  {
    unique: true,
  }
);

export default
  mongoose.model(
    "ElectionVoter",
    electionVoterSchema
  );