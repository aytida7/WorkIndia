const axios = require('axios');

const BASE_URL = 'http://localhost:5000'; 
const USER_CREDENTIALS = { username: "Aditya Patil", password: "abc" };

// Function to get the JWT token
const getToken = async () => {
    try {
        const response = await axios.post(`${BASE_URL}/auth/login`, USER_CREDENTIALS);
        return response.data.token; 
    } catch (error) {
        console.error("Failed to fetch token:", error.response ? error.response.data : error.message);
        process.exit(1); 
    }
};



const testBooking = async (user, token) => {
    const bookingData = {
        train_name: "patil express",
        time_start: "2025-02-17 14:30:00+05:30",
        book_seat_count: 10,
        user_name: `User${user}`
    };

    try {
        const response = await axios.post(`${BASE_URL}/bookings/book`, bookingData, {
            headers: { Authorization: `${token}` } 
        });

        console.log(`User ${user} Booking Successful:`, response.data);
    } catch (error) {
        console.error(`User ${user} Booking Failed:`, error.response ? error.response.data : error.message);
    }
};

// multiple use request to one endpint eg. 10 here
const runConcurrentTests = async () => {
    const token = await getToken(); 

    for (let i = 1; i <= 10; i++) { 
        testBooking(i, token);
    }
};

runConcurrentTests();
