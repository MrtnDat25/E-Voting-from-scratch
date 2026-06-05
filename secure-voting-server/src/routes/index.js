import express from "express";
const router = express.Router();

import * as AuthRoutes from "../modules/auth/auth.routes.js";
import electionRoutes from "../modules/elections/election.routes.js";
import candidateRoutes from "../modules/candidates/candidate.routes.js";
import voterRoutes from "../modules/elections/election-voters/electionVoter.routes.js";
import tokenRoutes from "../modules/votingTokens/votingToken.route.js";
import ballotRoutes from "../modules/ballots/ballot.routes.js";
import resultRoutes from "../modules/results/result.route.js";

router.use("/auth", AuthRoutes);
router.use("/elections", electionRoutes);
router.use("/candidates", candidateRoutes);
router.use("/election-voters", voterRoutes);
router.use("/votingTokens", tokenRoutes);
router.use("/ballots", ballotRoutes);
router.use("/results", resultRoutes);
router.use("/audit", auditRoutes);

export default router;

// router.use(
//   "/voters",
//   import("../modules/voters/voter.routes")
// );

// router.use(
//   "/ballots",
//   import("../modules/ballots/ballot.routes")
// );