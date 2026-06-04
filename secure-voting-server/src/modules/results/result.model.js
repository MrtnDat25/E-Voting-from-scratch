const mongoose =
require("mongoose");

const resultSchema =
new mongoose.Schema({

  electionId:{
    type:
      mongoose.Schema.Types.ObjectId,
    ref:"Election",
    required:true,
    unique:true
  },

  encryptedTotal:{
    type:String,
    required:true
  },

  decryptedTotal:{
    type:String,
    required:true
  },

  results:[{
    candidateId:{
      type:
        mongoose.Schema.Types.ObjectId,
      ref:"Candidate"
    },

    votes:Number
  }],

  winnerCandidateId:{
    type:
      mongoose.Schema.Types.ObjectId,
    ref:"Candidate"
  },

  resultHash:String,

  blockchainTxHash:String,

  publishedAt:{
    type:Date,
    default:Date.now
  }

});

module.exports =
mongoose.model(
  "ElectionResult",
  resultSchema
);