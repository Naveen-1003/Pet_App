const db = require('../config/db');

const processMockPayment = async (req, res) => {
    const { user_id, amount } = req.body;

    if (!user_id || !amount) {
        return res.status(400).json({ error: 'Missing user_id or amount' });
    }

    try {
        // Update user subscription status
        await db.query(`UPDATE Users SET is_subscribed = TRUE WHERE id = ?`, [user_id]);

        // Insert payment record
        await db.query(
            `INSERT INTO Subscription_Payments (user_id, razorpay_payment_id, amount, payment_status) 
             VALUES (?, 'mock_rzp_tx_12345', ?, 'success')`,
            [user_id, amount]
        );

        res.status(200).json({ message: 'Subscription activated successfully!', isSubscribed: true });
    } catch (error) {
        console.error('Subscription mock payment error:', error);
        res.status(500).json({ error: 'Internal server error while processing subscription.', details: error.message });
    }
};

module.exports = {
    processMockPayment
};
