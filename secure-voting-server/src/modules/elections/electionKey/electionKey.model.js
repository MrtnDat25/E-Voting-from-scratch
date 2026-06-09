import mongoose 
from "mongoose";

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

export default
mongoose.model(
  "ElectionKey",
  schema
);