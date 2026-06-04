const express = require("express")
const router = express.Router();
const auth =
  require(
    "../../middleware/auth.middleware"
  );

const roles =
  require(
    "../../middleware/role.middleware"
  );

const controller = require("./tally.controller");
router.post(
  "/:id/tally",
  auth,
  roles("company"),
  controller.tally
);

module.exports =router;