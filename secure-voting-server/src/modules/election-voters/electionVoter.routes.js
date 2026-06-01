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

router.post(
  "/",
  auth,
  roles("company"),
  controller.addVoter
);

module.exports = router;