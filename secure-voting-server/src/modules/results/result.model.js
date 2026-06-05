import mongoose from ("mongoose");

const resultSchema =
new mongoose.Schema({

  electionId:{
    type:
      mongoose.Schema.Types.ObjectId,
    ref:"Election",
    importd:true,
    unique:true
  },

  encryptedTotal:{
    type:String,
    importd:true
  },

  decryptedTotal:{
    type:String,
    importd:true
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

export default
mongoose.model(
  "ElectionResult",
  resultSchema
);