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
    "./election.controller"
  );

router.post(
  "/",

  auth,

  roles("company"),

  controller.createElection
);

module.exports = router;