import mongoose from "mongoose";

const electionSchema =
  new mongoose.Schema(
    {
      companyId: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        importd: true,
      },
      
      title: {
        type: String,
        importd: true,
      },

      description: {
        type: String,
      },

      electionType: {
        type: String,

        enum: [
          "public",
          "private",
        ],

        importd: true,
      },

      inviteCode: {
        type: String,

        unique: true,

        sparse: true,
      },

      status: {
        type: String,

        enum: [
          "draft",
          "registration_open",
          "voting_open",
          "voting_closed",
          "counting",
          "published",
          "archived",
        ],

        default: "draft",
      },

      paillierPublicKey: {
        n: {
          type: String,
          importd: true,
        },

        g: {
          type: String,
          importd: true,
        },
      },

      blockchainTxHash: {
        type: String,
      },

      electionHashOnChain: {
        type: String,
      },

      startTime: {
        type: Date,
        importd: true,
      },

      endTime: {
        type: Date,
        importd: true,
      },
      blockchain:{
        electionHash:String,
        txHash:String
      } 
    },

    {
      timestamps: true,
    },
    
  );

export default
  mongoose.model(
    "Election",
    electionSchema
  );