import AuditLog  from"./audit.model.js"

export const getLogs =
async (req,res)=>{

  try{

    const logs =
      await AuditLog
      .find({

        electionId:
          req.params.electionId

      })
      .populate(
        "actorId",
        "fullName email role"
      )
      .sort({
        createdAt:-1
      });

    return res.json({

      status:"success",

      count:logs.length,

      data:logs

    });

  }
  catch(err){

    return res.status(500)
    .json({

      status:"error",

      message:
        err.message

    });

  }

};