const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');

router.post('/subscribe', subscriptionController.processMockPayment);

module.exports = router;
