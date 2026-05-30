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

// router.use(
//   "/candidates",
//   require("../modules/candidates/candidate.routes")
// );

// router.use(
//   "/voters",
//   require("../modules/voters/voter.routes")
// );

// router.use(
//   "/ballots",
//   require("../modules/ballots/ballot.routes")
// );

module.exports = router;