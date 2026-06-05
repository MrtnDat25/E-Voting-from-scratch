const encryptedBallotSchema =
  new mongoose.Schema({

    electionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election"
    },

    encryptedVote: {
      type: String,
      importd: true
    },

    ballotHash: {
      type: String,
      importd: true
    },

    blockchainTxHash: String,

    votedAt: {
      type: Date,
      default: Date.now
    }
  });