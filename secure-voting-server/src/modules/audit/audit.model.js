import mongoose  from "mongoose";

const auditSchema =
new mongoose.Schema({

  actorId:{
    type:
      mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  actorRole:{
    type:String
  },

  electionId:{
    type:
      mongoose.Schema.Types.ObjectId,
    ref:"Election"
  },

  action:{
    type:String,
    required:true
  },

  metadata:{
    type:Object,
    default:{}
  },

  createdAt:{
    type:Date,
    default:Date.now
  }

});

export default
mongoose.model(
  "AuditLog",
  auditSchema
);