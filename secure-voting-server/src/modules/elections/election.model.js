import mongoose from "mongoose";

const electionSchema =
  new mongoose.Schema(
    {
      companyId: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,
      },
      
      title: {
        type: String,
        required: true,
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

        required: true,
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
          required: true,
        },

        g: {
          type: String,
          required: true,
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
        required: true,
      },

      endTime: {
        type: Date,
        required: true,
      },
      chainElectionId: {
      type: String,
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