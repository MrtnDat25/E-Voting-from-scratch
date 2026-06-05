import AuditLog from"./audit.model.js";

export const writeAudit =
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