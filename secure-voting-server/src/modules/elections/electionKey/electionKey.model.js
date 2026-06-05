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
    importd:true,
    unique:true
  },

  lambda:{
    type:String,
    importd:true
  },

  mu:{
    type:String,
    importd:true
  }

},{
  timestamps:true
});

export default
mongoose.model(
  "ElectionKey",
  schema
);