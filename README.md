```markdown
# 🐾 Pets Point

A full-stack, subscription-based mobile application for pet owners to discover and book premium events and services. Built with React Native (Expo), Node.js (Express), and MySQL.

## ✨ Features Implemented
* **Modern UI/UX:** Welcoming user dashboard, sunset-themed color palette, and native animated Skeleton Loaders for optimal perceived performance.
* **Optimized Data Fetching:** Utilizes TanStack Query (React Query) for automatic caching, background refetching, and robust loading/error state management.
* **Freemium Product Model:** Intelligent database-driven gating that allows free users to book standard events, while locking `is_premium_only` offerings behind a paywall.
* **Discount & Booking Engine:** Backend controllers that securely process percentage-based and flat-rate discount codes before redirecting users to external provider payment links.
* **Subscription Management:** Full-stack integration allowing users to upgrade their accounts to unlock premium features, supported by a custom Node.js mock payment gateway (and designed for Razorpay Payment Links API integration).

---

## 🗄️ Database Schema
The backend runs on MySQL. Run `node seed.js` to automatically drop, rebuild, and seed these tables with dummy data.

### 1. `Users` Table
Stores user profile data and their current subscription status.
```sql
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    is_subscribed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. `Offerings` Table
Stores the available pet events and services. Features a freemium flag (`is_premium_only`) to restrict access to non-subscribers.
```sql
CREATE TABLE Offerings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('event', 'service') NOT NULL,
    title VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    is_premium_only BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. `Bookings` Table
Logs initiated bookings, tracking which user booked which offering, any applied discounts, and the final calculated price.
```sql
CREATE TABLE Bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    offering_id INT NOT NULL,
    discount_code VARCHAR(50),
    final_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'initiated',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (offering_id) REFERENCES Offerings(id)
);
```

### 4. `Subscription_Payments` Table
Records the transaction history of users purchasing the Premium Pet Pass.
```sql
CREATE TABLE Subscription_Payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    razorpay_payment_id VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'success',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);
```

---

## 🛠️ Tech Stack
* **Frontend:** React Native, Expo Router, Expo Go, TanStack Query (React Query), Axios.
* **Backend:** Node.js, Express.js, Zod (Input Validation).
* **Database:** MySQL (mysql2 promise pool).

---

## 🚀 Quick Setup Guide

### 1. Start the Backend
```bash
cd backend
npm install
# Ensure MySQL is running and your .env file is configured with DB credentials
node seed.js # Rebuilds and seeds the database
npm start # Or 'node src/index.js'
```

### 2. Start the Mobile App
```bash
cd mobile
npm install
# Open mobile/utils/api.ts and change 'localhost' to your computer's Wi-Fi IP Address!
npx expo start --clear
```
Scan the QR code with the **Expo Go** app on your physical device (must be on the same Wi-Fi network), or press `a` to run on an Android Emulator.
