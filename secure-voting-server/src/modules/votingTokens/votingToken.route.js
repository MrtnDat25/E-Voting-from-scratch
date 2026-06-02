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
  require("./votingToken.controller")

router.post(
  "/request",
  auth,
  roles("voter"),
  controller.requestToken
);

module.exports = router;