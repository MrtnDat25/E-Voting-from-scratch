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
"./audit.controller"
);

router.get(
 "/:electionId",
 auth,
 roles("company"),
 controller.getLogs
);

module.exports =
router;