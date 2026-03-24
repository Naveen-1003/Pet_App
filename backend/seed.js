const pool = require('./src/config/db');

async function seed() {
    try {
        console.log("Setting up the database...");
        
        // Drop existing table to apply new schema
        await pool.query('SET FOREIGN_KEY_CHECKS = 0;');
        await pool.query('DROP TABLE IF EXISTS Offerings;');
        await pool.query('SET FOREIGN_KEY_CHECKS = 1;');
        
        // Create table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS Offerings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                type ENUM('event', 'service') NOT NULL,
                provider_name VARCHAR(255) NOT NULL,
                base_price DECIMAL(10, 2) NOT NULL,
                provider_payment_url VARCHAR(255) NOT NULL, 
                is_premium_only BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Offerings table created or already exists.");

        // Check existing data
        const [rows] = await pool.query('SELECT count(*) as count FROM Offerings');
        if (rows[0].count > 0) {
            console.log("Offerings table already has data (" + rows[0].count + " rows). Skipping seeding.");
            process.exit(0);
        }
        console.log("Offerings table is empty. Proceeding to insert data.");

        // Insert mock data
        await pool.query(`
            INSERT INTO Offerings (title, description, type, provider_name, base_price, provider_payment_url, is_premium_only) VALUES 
            ('Puppy Training Basics', 'A 4-week introductory course for puppies.', 'service', 'Pawsitive Training Co.', 150.00, 'https://example.com/pay1', true),
            ('Weekend Dog Park Meetup', 'Join us this Saturday for a group play session.', 'event', 'City Parks Dept.', 0.00, 'https://example.com/pay2', false),
            ('Mobile Pet Grooming', 'Full service grooming right at your doorstep.', 'service', 'Bubble Paws', 75.50, 'https://example.com/pay3', true),
            ('Annual Pet Health Expo', 'Visit booths and learn about pet nutrition and health.', 'event', 'Pets Point Community', 15.00, 'https://example.com/pay4', false),
            ('Overnight Pet Boarding', 'Safe and comfortable overnight stay for dogs and cats.', 'service', 'Cozy Kennels', 45.00, 'https://example.com/pay5', false)
        `);
        
        console.log("Dummy data successfully seeded into Offerings table!");
        process.exit(0);
    } catch (error) {
        console.error("Error setting up database:", error.message);
        process.exit(1);
    }
}

seed();
