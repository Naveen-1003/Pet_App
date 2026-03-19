const express = require('express');
const cors = require('cors');
const path = require('path');
const bookingRoutes = require('./routes/bookingRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const db = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// A quick health-check route to verify everything works
app.get('/api/health', async (req, res) => {
    try {
        await db.query('SELECT 1'); // Test DB connection
        res.status(200).json({ status: 'Server and Database are healthy!' });
    } catch (error) {
        res.status(500).json({ status: 'Database connection failed', error: error.message });
    }
});

// Fetch all events and services
app.get('/api/offerings', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Offerings ORDER BY created_at DESC');
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching offerings:", error.message);
        res.status(500).json({ status: 'Database fetching failed', error: error.message });
    }
});

// Booking Routes
app.use('/api/bookings', bookingRoutes);

// Subscription Routes
app.use('/api/subscriptions', subscriptionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});