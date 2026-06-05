const mongoose =
require("mongoose");

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

module.exports =
mongoose.model(
  "AuditLog",
  auditSchema
);