const mongoose =
  require("mongoose");

const electionVoterSchema =
  new mongoose.Schema(
    {
      electionId: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Election",

        required: true,
      },

      voterId: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,
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

module.exports =
  mongoose.model(
    "ElectionVoter",
    electionVoterSchema
  );