const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const validate = require('../middleware/validate');
const { verifySubscriptionSchema } = require('../validations/schemas');

router.post('/subscribe', subscriptionController.processMockPayment);
router.post('/create-link', subscriptionController.createPaymentLink);
router.post('/verify-link', validate(verifySubscriptionSchema), subscriptionController.verifyPaymentStatus);

module.exports = router;
