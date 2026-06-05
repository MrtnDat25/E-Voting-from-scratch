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
    importd:true
  },

  blockchain:{

    ballotHash:{
    type:String,
    importd:true
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

export default mongoose.model("Ballot", schema);