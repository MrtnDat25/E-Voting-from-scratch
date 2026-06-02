const encryptedBallotSchema =
  new mongoose.Schema({

    electionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election"
    },

    encryptedVote: {
      type: String,
      required: true
    },

    ballotHash: {
      type: String,
      required: true
    },

    blockchainTxHash: String,

    votedAt: {
      type: Date,
      default: Date.now
    }
  });