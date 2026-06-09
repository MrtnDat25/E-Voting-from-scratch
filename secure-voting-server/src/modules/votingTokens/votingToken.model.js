import mongoose from "mongoose";

const votingTokenSchema = new mongoose.Schema({
	electionId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Election",
		required: true
	},

	voterId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},

	token: {
		type: String,
		required: true,
		unique: true
	},

	status: {
		type: String,
		enum: ["active", "used", "expired"],
		default: "active"
	},

	expiresAt: {
		type: Date,
		required: true,
		// index: true
	}
}, {
	timestamps: true
});

// 1 token / voter / election
votingTokenSchema.index({
	electionId: 1,
	voterId: 1
}, {
	unique: true
});

// auto delete expired
votingTokenSchema.index({
	expiresAt: 1
}, {
	expireAfterSeconds: 0
});

export default
mongoose.model(
	"VotingToken",
	votingTokenSchema
);