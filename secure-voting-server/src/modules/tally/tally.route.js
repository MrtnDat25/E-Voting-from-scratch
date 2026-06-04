router.post(

 "/:id/tally",

 auth,

 roles(
   "company"
 ),

 controller.tally
);