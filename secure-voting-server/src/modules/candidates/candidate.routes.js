import express from "express";

const router = express.Router();

import auth from "../../middleware/auth.middleware.js";
import roles from "../../middleware/role.middleware.js";
import controller from "./candidate.controller.js";

/**
 * @swagger
 * tags:
 *   name: Candidates
 *   description: Candidate management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     EmbeddedLink:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: Campaign Video
 *         url:
 *           type: string
 *           format: uri
 *           example: https://youtube.com/watch?v=abc123
 *         type:
 *           type: string
 *           enum:
 *             - video
 *             - article
 *             - other
 *           example: video
 *
 *     Candidate:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 665c7c1f7b123456789abcd1
 *
 *         electionId:
 *           type: string
 *           example: 665c7c1f7b123456789abcd2
 *
 *         userId:
 *           type: string
 *           nullable: true
 *           example: 665c7c1f7b123456789abcd3
 *
 *         email:
 *           type: string
 *           format: email
 *           example: candidate@example.com
 *
 *         name:
 *           type: string
 *           example: Nguyen Van A
 *
 *         avatar:
 *           type: string
 *           example: https://example.com/avatar.jpg
 *
 *         bio:
 *           type: string
 *           example: Candidate biography
 *
 *         embeddedLinks:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/EmbeddedLink'
 *
 *         candidateIndexOnChain:
 *           type: integer
 *           example: 1
 *
 *         cachedVoteCount:
 *           type: integer
 *           example: 120
 *
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /candidates:
 *   post:
 *     summary: Create a candidate
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - electionId
 *               - email
 *               - name
 *               - candidateIndexOnChain
 *             properties:
 *               electionId:
 *                 type: string
 *                 example: 665c7c1f7b123456789abcd2
 *               email:
 *                 type: string
 *                 format: email
 *                 example: candidate@example.com
 *               name:
 *                 type: string
 *                 example: Nguyen Van A
 *               avatar:
 *                 type: string
 *                 example: https://example.com/avatar.jpg
 *               bio:
 *                 type: string
 *                 example: Candidate biography
 *               candidateIndexOnChain:
 *                 type: integer
 *                 example: 1
 *               embeddedLinks:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/EmbeddedLink'
 *     responses:
 *       201:
 *         description: Candidate created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Candidate'
 *       400:
 *         description: Cannot add candidate now
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Company role required
 *       404:
 *         description: Election not found
 *       500:
 *         description: Internal server error
 */
router.post(
  "/",
  auth,
  roles("company"),
  controller.createCandidate
);

/**
 * @swagger
 * /candidates:
 *   get:
 *     summary: Get candidates by election
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: electionId
 *         required: true
 *         schema:
 *           type: string
 *         example: 665c7c1f7b123456789abcd2
 *     responses:
 *       200:
 *         description: Candidate list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Candidate'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/",
  auth,
  controller.getCandidates
);

export default router;