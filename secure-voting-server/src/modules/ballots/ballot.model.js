import mongoose from "mongoose";
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

  blockchain:{

    ballotHash:{
    type:String,
    required:true
    },
    
    txHash:{
    type:String
    } 
  },

  blockchainTxHash:{
    type:String
  },


  votedAt:{
    type:Date,
    default:Date.now
  }

  
  
});
schema.index(
  {
    "blockchain.ballotHash": 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model("Ballot", schema);