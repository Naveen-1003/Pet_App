const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');

router.post('/subscribe', subscriptionController.processMockPayment);
router.post('/create-link', subscriptionController.createPaymentLink);
router.post('/verify-link', subscriptionController.verifyPaymentStatus);

module.exports = router;
