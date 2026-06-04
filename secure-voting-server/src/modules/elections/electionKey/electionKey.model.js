const mongoose =
require("mongoose");

const schema =
new mongoose.Schema({

  electionId:{
    type:
      mongoose
      .Schema
      .Types
      .ObjectId,
    ref:"Election",
    required:true,
    unique:true
  },

  lambda:{
    type:String,
    required:true
  },

  mu:{
    type:String,
    required:true
  }

},{
  timestamps:true
});

module.exports =
mongoose.model(
  "ElectionKey",
  schema
);