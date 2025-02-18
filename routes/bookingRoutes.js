const express = require('express');
const { bookSeat } = require('../controllers/bookingController');
const { getBookingDetails } = require('../controllers/bookingDetailsController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /bookings/book:
 *   post:
 *     summary: Book a seat on a train
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []  # The Authorization header should have a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               train_name:
 *                 type: string
 *                 example: "Express 123"
 *               time_start:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-02-17 14:30:00+05:30"
 *               book_seat_count:
 *                 type: integer
 *                 example: 2
 *               user_name:
 *                 type: string
 *                 example: "john_doe"
 *     responses:
 *       201:
 *         description: Booking successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Booking successful"
 *                 booking:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     user_name:
 *                       type: string
 *                       example: "john_doe"
 *                     train_name:
 *                       type: string
 *                       example: "Express 123"
 *                     book_seat_count:
 *                       type: integer
 *                       example: 2
 *       400:
 *         description: Not enough seats available
 *       404:
 *         description: Train not found
 *       500:
 *         description: Internal server error
 */
router.post('/book', verifyToken, bookSeat);


/**
 * @swagger
 * /bookings/details:
 *   get:
 *     summary: Get booking details for a user
 *     tags: [Bookings]
 *     parameters:
 *       - in: query
 *         name: user_name
 *         required: true
 *         schema:
 *           type: string
 *         description: User's name to get booking details
 *     responses:
 *       200:
 *         description: Booking details found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   user_name:
 *                     type: string
 *                     example: "john_doe"
 *                   train_name:
 *                     type: string
 *                     example: "Express 123"
 *                   book_seat_count:
 *                     type: integer
 *                     example: 2
 *       404:
 *         description: No bookings found for this user
 *       500:
 *         description: Internal server error
 */
router.get('/details', getBookingDetails);

module.exports = router;
