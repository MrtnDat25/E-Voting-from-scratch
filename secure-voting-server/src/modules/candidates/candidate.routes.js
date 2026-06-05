import express 
  from "express";

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
    "./candidate.controller.js"
  ;

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


export default router;