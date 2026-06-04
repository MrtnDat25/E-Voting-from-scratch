const mongoose = require("mongoose");

const ballotSchema =
  new mongoose.Schema({
    electionId: {
      type:
        mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true,
    },

    encryptedVote: {
      type: String,
      required: true,
    },

    ballotHash: {
      type: String,
      required: true,
      unique: true,
    },

    voterTokenId: {
      type:
        mongoose.Schema.Types.ObjectId,
      ref: "VotingToken",
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

module.exports =
  mongoose.model(
    "EncryptedBallot",
    ballotSchema
  );