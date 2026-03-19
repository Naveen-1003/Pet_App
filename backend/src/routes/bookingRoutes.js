const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Handles POST /initiate containing user_id, offering_id, and discount_code
router.post('/initiate', bookingController.initiateBooking);

module.exports = router;
