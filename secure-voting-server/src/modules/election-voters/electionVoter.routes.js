const express =
  require("express");

const router =
  express.Router();

const auth =
  require(
    "../../middleware/auth.middleware"
  );

const roles =
  require(
    "../../middleware/role.middleware"
  );

const controller =
  require(
    "./electionVoter.controller"
  );

const importController =
  require(
    "./electionVoter.import.controller"
  );

// add 1 voter
router.post(
  "/",
  auth,
  roles("company"),
  controller.addVoter
);

// import excel
router.post(
  "/import",
  auth,
  roles("company"),
  importController.importVoters
);

module.exports = router;