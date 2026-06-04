const mongoose = require("mongoose");
const schema =
new mongoose.Schema({

  electionId:{
    type:
      mongoose
      .Schema
      .Types
      .ObjectId,
    ref:"Election"
  },

  encryptedVote:{
    type:String,
    required:true
  },

  ballotHash:{
    type:String,
    required:true
  },

  blockchainTxHash:{
    type:String
  },

  votedAt:{
    type:Date,
    default:Date.now
  }

});

module.exports = mongoose.model("Ballot", schema);