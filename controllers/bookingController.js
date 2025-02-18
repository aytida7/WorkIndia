const pool = require('../config/db');

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         user_name:
 *           type: string
 *           example: "john_doe"
 *         train_name:
 *           type: string
 *           example: "Express 123"
 *         book_seat_count:
 *           type: integer
 *           example: 2
 *         time_start:
 *           type: string
 *           format: date-time
 *           example: "2025-02-20T08:00:00Z"
 */

/**
 * @swagger
 * /bookings/book:
 *   post:
 *     summary: Book a seat on a train
 *     tags: [Bookings]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       201:
 *         description: Booking successful
 *       400:
 *         description: Not enough seats available
 *       404:
 *         description: Train not found
 */
const bookSeat = async (req, res) => {
    const { train_name, time_start, book_seat_count, user_name } = req.body;
    const client = await pool.connect(); 

    try {
        await client.query('BEGIN'); 
        // i am using 3 steps for booking

        // Step 1: Lock the row for the train
        const trainQuery = await client.query(
            'SELECT * FROM trains WHERE name = $1 AND time_start = $2 FOR UPDATE',
            [train_name, time_start]
        );

        if (trainQuery.rows.length === 0) {
            await client.query('ROLLBACK'); 
            return res.status(404).json({ message: 'Train not found' });
        }

        const train = trainQuery.rows[0];

        // Step 2: Check available seats
        if (Number(train.seats_left) < book_seat_count) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Not enough seats available' });
        }

        // Step 3: substract seats and insert booking
        await client.query(
            'UPDATE trains SET seats_left = seats_left - $1 WHERE name = $2 AND time_start = $3',
            [book_seat_count, train_name, time_start]
        );

        const booking = await client.query(
            'INSERT INTO bookings (user_name, train_name, book_seat_count, time_start) VALUES ($1, $2, $3, $4) RETURNING *',
            [user_name, train_name, book_seat_count, time_start]
        );

        await client.query('COMMIT'); 

        res.status(201).json({
            message: 'Booking successful',
            booking: booking.rows[0],
        });
    } catch (error) {
        await client.query('ROLLBACK'); 
        console.error('Booking error:', error);
        res.status(500).json({ message: 'Booking error' });
    } finally {
        // Release client connection after use
        client.release(); 
    }
};

module.exports = { bookSeat };
