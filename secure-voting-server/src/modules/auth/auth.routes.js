import express  from "express"
const router = express.Router();

import * as authController from "./auth.controller.js";

import authMiddleware  from"../../middleware/auth.middleware.js";

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

export default router;