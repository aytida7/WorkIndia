const pool = require('../config/db');

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
 *       404:
 *         description: No bookings found for this user
 */
const getBookingDetails = async (req, res) => {
    const { user_name } = req.query;

    try {
        const bookingsQuery = await pool.query(
            'SELECT * FROM bookings WHERE user_name = $1',
            [user_name]
        );

        if (bookingsQuery.rows.length === 0) {
            return res.status(404).json({ message: 'No bookings found for this user' });
        }

        res.status(200).json(bookingsQuery.rows);
    } catch (error) {
        console.error('Error fetching booking details:', error);
        res.status(500).json({ message: 'Error fetching booking details' });
    }
};

module.exports = { getBookingDetails };
