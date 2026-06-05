import express from "express";

const router =
  express.Router();

import auth 
  from 
    "../../middleware/auth.middleware.js"
  ;

import roles 
  from 
    "../../middleware/role.middleware.js"
  ;

import controller 
  from 
    "./election.controller.js"
  ;

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

export default router;