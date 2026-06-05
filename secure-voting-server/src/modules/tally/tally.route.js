import express  from"express";
const router = express.Router();
import auth from 
    "../../middleware/auth.middleware.js"
  ;

import roles from
    "../../middleware/role.middleware.js"
  ;

import * as controller  from"./tally.controller.js";
router.post(
  "/:id/tally",
  auth,
  roles("company"),
  controller.tally
);

export default router;