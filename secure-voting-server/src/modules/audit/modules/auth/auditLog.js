const auditLogSchema =
  new mongoose.Schema({
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    action: String,

    resourceType: String,

    resourceId: String,

    metadata: Object,

    createdAt: {
      type: Date,
      default: Date.now
    }
  });