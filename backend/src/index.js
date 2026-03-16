const express = require('express');
const cors = require('cors');
const path = require('path');
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});