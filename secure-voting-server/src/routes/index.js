const router = require("express")
.Router();

router.use(
  "/auth",
  require("../modules/auth/auth.routes")
);

router.use(
  "/elections",
  require("../modules/elections/election.routes")
);

router.use(
  "/candidates",
  require("../modules/candidates/candidate.routes")
);

router.use(
  "/election-voters",
  require(
    "../modules/elections/election-voters/electionVoter.routes"
  )
);

router.use(
  "/votingTokens",
  require(
  "../modules/votingTokens/votingToken.route"
  )
);

router.use(
  "/ballots",
  require("../modules/ballots/ballot.routes")
);

const resultRoutes =
require(
 "../modules/results/result.route"
);

router.use( 
 "/results",
 resultRoutes
);

router.use(
 "/audit",
 require(
 "../modules/audit/audit.route"
 )
);
// router.use(
//   "/voters",
//   require("../modules/voters/voter.routes")
// );

// router.use(
//   "/ballots",
//   require("../modules/ballots/ballot.routes")
// );

module.exports = router;