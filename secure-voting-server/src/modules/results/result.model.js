import mongoose from "mongoose";

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

    votes:{
      type:Number,
      default:0
    }

  }],

  winnerCandidateId:{
    type:
      mongoose.Schema.Types.ObjectId,
    ref:"Candidate"
  },

  blockchain:{

    resultHash:{
      type:String
    },

    txHash:{
      type:String
    }

  },

  publishedAt:{
    type:Date,
    default:Date.now
  }

},
{
  timestamps:true
});

export default
mongoose.model(
  "ElectionResult",
  resultSchema
);