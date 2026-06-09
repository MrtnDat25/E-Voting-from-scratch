import AuditLog  from"./audit.model.js"


export const getLogs =
async (req,res)=>{

  try{

    const query = {

      electionId:
        req.params.electionId

    };

    if(req.query.action){

      query.action =
        req.query.action;

    }


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

    const formattedLogs =
  logs.map(log => ({

    actor:
      log.actorId?.fullName ||
      "Unknown",

    email:
      log.actorId?.email,

    role:
      log.actorRole,

    action:
      log.action,

    metadata:
      log.metadata,

    timestamp:
      log.createdAt

  }));

    return res.json({

      status:"success",

      count:
        formattedLogs.length,

      data:
        formattedLogs

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