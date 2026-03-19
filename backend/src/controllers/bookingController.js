const db = require('../config/db');

exports.initiateBooking = async (req, res) => {
    try {
        const { user_id, offering_id, discount_code } = req.body;
        
        if (!user_id || !offering_id) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Fetch the base price and provider URL from the Offerings table
        const [offerings] = await db.query('SELECT base_price, provider_payment_url FROM Offerings WHERE id = ?', [offering_id]);
        
        if (offerings.length === 0) {
            return res.status(404).json({ error: "Offering not found" });
        }
        
        const base_price = parseFloat(offerings[0].base_price);
        const provider_payment_url = offerings[0].provider_payment_url;
        
        // Calculate the discount
        let discount_amount = 0;
        
        // Mock hardcoded codes
        if (discount_code === 'SAVE20') {
            discount_amount = base_price * 0.20;
        } else if (discount_code === 'MINUS10') {
            discount_amount = 10;
        }
        
        let final_price = base_price - discount_amount;
        if (final_price < 0) {
            final_price = 0;
        }
        
        // Attempt to insert into the Bookings table
        let booking_id = null;
        try {
            // First attempt with explicit final price mapping if the columns exist natively
            const [result] = await db.query(
                `INSERT INTO bookings (user_id, offering_id, status, final_price) VALUES (?, ?, ?, ?)`,
                [user_id, offering_id, 'initiated', final_price]
            );
            booking_id = result.insertId;
        } catch (schemaErr) {
            // Fallback for strict database schema constraints
            const [fallbackResult] = await db.query(
                `INSERT INTO bookings (user_id, offering_id, status) VALUES (?, ?, ?)`,
                [user_id, offering_id, 'initiated']
            );
            booking_id = fallbackResult.insertId;
        }

        // Return strictly formatted JSON response mapping the controller logic
        return res.status(200).json({
            booking_id,
            base_price,
            discount_amount,
            final_price,
            provider_payment_url
        });
        
    } catch (error) {
        console.error("Booking failed:", error);
        return res.status(500).json({ error: "Booking Service Internal Error" });
    }
};
