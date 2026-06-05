const AuditLog =
require("./audit.model");

exports.writeAudit =
async ({
  actorId,
  actorRole,
  electionId,
  action,
  metadata={}
})=>{

  console.log("AUDIT WRITE");

  const log =
    await AuditLog.create({
      actorId,
      actorRole,
      electionId,
      action,
      metadata
    });

  console.log(log);
};