const db = require('../config/db');
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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

const createPaymentLink = async (req, res) => {
    try {
        const paymentLink = await razorpay.paymentLink.create({
            amount: 99900,
            currency: "INR",
            description: "Vibe Pets Premium",
            customer: {
                name: "Demo User",
                email: "demo@vibepets.com"
            },
            notify: {
                sms: false,
                email: false
            }
        });

        res.status(200).json({
            success: true,
            short_url: paymentLink.short_url,
            id: paymentLink.id
        });
    } catch (error) {
        console.error('Error creating payment link:', error);
        res.status(500).json({ success: false, error: 'Failed to create payment link' });
    }
};

const verifyPaymentStatus = async (req, res) => {
    const { payment_link_id, user_id } = req.body;

    if (!payment_link_id || !user_id) {
        return res.status(400).json({ success: false, error: 'Missing payment_link_id or user_id' });
    }

    try {
        const paymentLink = await razorpay.paymentLink.fetch(payment_link_id);

        if (paymentLink.status === 'paid') {
            await db.query(`UPDATE Users SET is_subscribed = TRUE WHERE id = ?`, [user_id]);
            await db.query(
                `INSERT INTO Subscription_Payments (user_id, razorpay_payment_id, amount, payment_status) 
                 VALUES (?, ?, ?, 'success')`,
                [user_id, payment_link_id, 999] // 999 INR
            );
            return res.status(200).json({ success: true });
        } else {
            return res.status(200).json({ success: false, message: "Payment not completed yet" });
        }
    } catch (error) {
        console.error('Error verifying payment status:', error);
        res.status(500).json({ success: false, error: 'Failed to verify payment status' });
    }
};

module.exports = {
    processMockPayment,
    createPaymentLink,
    verifyPaymentStatus
};
