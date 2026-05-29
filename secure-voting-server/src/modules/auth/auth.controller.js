const router = require("express")
.Router();

const authController =
  require("./auth.controller");

const authMiddleware =
  require("../../middleware/auth.middleware");

router.post(
  "/register",
  authController.register
);

router.post(
  "/login",
  authController.login
);

router.post(
  "/refresh",
  authController.refresh
);

router.post(
  "/logout",
  authMiddleware,
  authController.logout
);

router.get(
  "/me",
  authMiddleware,
  authController.me
);

module.exports = router;