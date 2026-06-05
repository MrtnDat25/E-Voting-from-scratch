const AuditLog =
require("./audit.model");

exports.getLogs =
async (req,res)=>{

  const logs =
    await AuditLog
    .find({

      electionId:
        req.params
          .electionId

    })
    .sort({
      createdAt:-1
    });

  return res.json({

    status:"success",

    data:logs

  });

};