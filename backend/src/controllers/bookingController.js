const db = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

exports.initiateBooking = asyncHandler(async (req, res) => {
    const { user_id, offering_id, discount_code } = req.body;
    
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
    
    // Ensure the mock user exists to satisfy foreign key constraints
    await db.query(`INSERT IGNORE INTO users (id, name, email) VALUES (?, ?, ?)`, [user_id, 'Demo User', 'demo@example.com']);

    // Insert into the Bookings table natively matching the schema
    const [result] = await db.query(
        `INSERT INTO bookings (user_id, offering_id, discount_code, discount_amount, final_price, status) VALUES (?, ?, ?, ?, ?, ?)`,
        [user_id, offering_id, discount_code || null, discount_amount, final_price, 'initiated']
    );
    const booking_id = result.insertId;

    // Return strictly formatted JSON response mapping the controller logic
    return res.status(200).json({
        booking_id,
        base_price,
        discount_amount,
        final_price,
        provider_payment_url
    });
});
