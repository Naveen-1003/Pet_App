const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const validate = require('../middleware/validate');
const { initiateBookingSchema } = require('../validations/schemas');

// Handles POST /initiate containing user_id, offering_id, and discount_code
router.post('/initiate', validate(initiateBookingSchema), bookingController.initiateBooking);

module.exports = router;
