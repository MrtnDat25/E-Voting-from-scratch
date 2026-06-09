import express from "express";

const router = express.Router();

import auth from "../../middleware/auth.middleware.js";

import {
  verifyElection,
  verifyResult,
} from "./blockchain.controller.js";

/**
 * @swagger
 * tags:
 *   name: Blockchain
 *   description: Blockchain verification APIs
 */

/**
 * @swagger
 * /blockchain/election/{id}:
 *   get:
 *     summary: Verify election data from blockchain
 *     tags: [Blockchain]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Election ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Election verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     electionId:
 *                       type: string
 *                       example: "1"
 *                     company:
 *                       type: string
 *                       example: ABC Corporation
 *                     electionHash:
 *                       type: string
 *                       example: 0x123abc456def
 *                     resultHash:
 *                       type: string
 *                       example: 0x789xyz123abc
 *                     closed:
 *                       type: boolean
 *                       example: false
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/election/:id",
  auth,
  verifyElection
);

/**
 * @swagger
 * /blockchain/result/{electionId}:
 *   get:
 *     summary: Verify election result stored on blockchain
 *     tags: [Blockchain]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: electionId
 *         required: true
 *         description: Election ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Result verification successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 blockchain:
 *                   type: object
 *       404:
 *         description: Result not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Result not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/result/:electionId",
  auth,
  verifyResult
);

export default router;