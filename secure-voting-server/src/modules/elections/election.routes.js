
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
import {
  getElectionStats
}
from "./election.stats.controller.js";
/**
 * @swagger
 * components:
 *   schemas:
 *     Election:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         companyId:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         electionType:
 *           type: string
 *           enum:
 *             - public
 *             - private
 *         inviteCode:
 *           type: string
 *         status:
 *           type: string
 *           enum:
 *             - draft
 *             - registration_open
 *             - voting_open
 *             - voting_closed
 *             - counting
 *             - published
 *             - archived
 *         chainElectionId:
 *           type: string
 *         blockchainTxHash:
 *           type: string
 *         electionHashOnChain:
 *           type: string
 *         paillierPublicKey:
 *           type: object
 *           properties:
 *             n:
 *               type: string
 *             g:
 *               type: string
 *         startTime:
 *           type: string
 *           format: date-time
 *         endTime:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /elections:
 *   post:
 *     summary: Create election
 *     tags: [Elections]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - electionType
 *               - startTime
 *               - endTime
 *               - paillierPublicKey
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               electionType:
 *                 type: string
 *                 enum: [public, private]
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *               paillierPublicKey:
 *                 type: object
 *                 properties:
 *                   n:
 *                     type: string
 *                   g:
 *                     type: string
 *     responses:
 *       201:
 *         description: Election created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Company role required
 */
router.post(
  "/",

  auth,

  roles("company"),

  controller.createElection
);

/**
 * @swagger
 * /elections/public:
 *   get:
 *     summary: Get public elections
 *     tags: [Elections]
 *     responses:
 *       200:
 *         description: Public elections
 */
router.get(
  "/public",
  controller.getPublicElections
);
/**
 * @swagger
 * /elections/join:
 *   post:
 *     summary: Join election using invite code
 *     tags: [Elections]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - inviteCode
 *             properties:
 *               inviteCode:
 *                 type: string
 *                 example: ABC123XYZ
 *     responses:
 *       200:
 *         description: Joined election
 *       404:
 *         description: Invalid invite code
 */
router.post(
  "/join",
  auth,
  controller.joinElection
);

/**
 * @swagger
 * /elections/my:
 *   get:
 *     summary: Get my joined elections
 *     tags: [Elections]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: My elections
 */
router.get(
  "/my",
  auth,
  controller.myElection
)

/**
 * @swagger
 * /elections/{id}/status:
 *   patch:
 *     summary: Change election status
 *     tags: [Elections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - draft
 *                   - registration_open
 *                   - voting_open
 *                   - voting_closed
 *                   - counting
 *                   - published
 *                   - archived
 *     responses:
 *       200:
 *         description: Status updated
 */

router.patch(
 "/:id/status",
 auth,
 roles("company"),
 controller.changeStatus
);

/**
 * @swagger
 * /elections/{id}/status:
 *   patch:
 *     summary: Change election status
 *     tags: [Elections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - draft
 *                   - registration_open
 *                   - voting_open
 *                   - voting_closed
 *                   - counting
 *                   - published
 *                   - archived
 *     responses:
 *       200:
 *         description: Status updated
 */
router.get(
  "/:id/stats",
  getElectionStats
);

/**
 * @swagger
 * /elections/{id}/stats:
 *   get:
 *     summary: Get election statistics
 *     tags: [Elections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Election statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalVoters:
 *                       type: integer
 *                     requestedTokens:
 *                       type: integer
 *                     voted:
 *                       type: integer
 *                     turnoutRate:
 *                       type: number
 */
router.get(
  "/:id/stats",
  auth,
  roles("company"),
  controller.getElectionStats
);
export default router;