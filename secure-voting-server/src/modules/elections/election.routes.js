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
router.get(
  "/public",
  controller.getPublicElections
);
router.post(
  "/join",
  auth,
  controller.joinElection
);

router.get(
  "/my",
  auth,
  controller.myElection
)

router.patch(
 "/:id/status",
 auth,
 roles("company"),
 controller.changeStatus
);

module.exports = router;