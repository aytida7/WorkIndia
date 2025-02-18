const express = require("express");
const { addTrain } = require("../controllers/adminController");
const { verifyToken, verifyAdminKey } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management endpoints
 */

/**
 * @swagger
 * /admin/add-train:
 *   post:
 *     summary: Add a new train (Admin only)
 *     tags: [Admin]
 *     security:
 *       - apiKeyAuth: []  # This uses the "x-api-key" header
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - source
 *               - destination
 *               - seats
 *               - time_start
 *               - time_end
 *               - seats_left
 *             properties:
 *               name:
 *                 type: string
 *                 example: Express 123
 *               source:
 *                 type: string
 *                 example: New York
 *               destination:
 *                 type: string
 *                 example: Boston
 *               seats:
 *                 type: integer
 *                 example: 200
 *               time_start:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-02-17 14:30:00+05:30"
 *               time_end:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-02-17 14:30:00+05:30"
 *               seats_left:
 *                 type: integer
 *                 example: 200
 *     responses:
 *       201:
 *         description: Train successfully added
 *       400:
 *         description: Train with the same name and start time already exists
 *       401:
 *         description: Unauthorized - Admin token required
 *       500:
 *         description: Internal server error
 */
router.post("/add-train", verifyAdminKey, addTrain);

module.exports = router;
