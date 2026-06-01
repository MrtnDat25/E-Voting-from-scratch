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
    "./candidate.controller"
  );

router.post(
  "/",

  auth,

  roles("company"),

  controller.createCandidate
);

router.get(
  "/",
  auth,
  controller.getCandidates
);


module.exports = router;