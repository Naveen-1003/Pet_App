```markdown
# 🐾 Vibe Pet App

A full-stack, subscription-based mobile application for pet owners. Built with React Native (Expo), Node.js (Express), and MySQL. 

## 📂 Project Structure
This repository is a monorepo containing two main directories:
* `/backend`: Node.js Express API and MySQL database configuration.
* `/mobile`: React Native Expo mobile application.

---

## 🛠️ Prerequisites
Before you begin, ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v18 or higher)
* [MySQL Server](https://dev.mysql.com/downloads/installer/) (Running locally)
* [Expo Go](https://expo.dev/go) app installed on your physical iOS or Android device.

---

## ⚙️ 1. Backend Setup

Open a terminal and navigate to the backend directory:
```bash
cd backend
```

### Install Dependencies
```bash
npm install
```

### Configure Environment Variables
Create a `.env` file in the root of the `/backend` folder and add your database and payment gateway credentials:

```env
PORT=3000

# MySQL Database Credentials
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=vibe_pets_db

# Razorpay Test Keys
RAZORPAY_KEY_ID=rzp_test_Rv8cTIJoSHbhQM
RAZORPAY_KEY_SECRET=O1Lm58aNKCamcB2xbLgUe0WX
```

### Setup the Database
1. Open your MySQL client (like MySQL Workbench or DBeaver) and create the database:
   ```sql
   CREATE DATABASE vibe_pets_db;
   ```
2. Run the seed script to automatically build the tables and insert dummy pet events and services:
   ```bash
   node seed.js
   ```

### Start the Server
```bash
node src/index.js
# Or use 'npx nodemon src/index.js' for auto-reloading during development
```
*The backend should now be running on `http://localhost:3000`.*

---

## 📱 2. Frontend (Mobile App) Setup

Open a **new, separate terminal window** and navigate to the mobile directory:
```bash
cd mobile
```

### Install Dependencies
```bash
npm install
```

### ⚠️ IMPORTANT: Configure the Backend IP Address
Mobile apps running on physical devices cannot connect to `localhost`. You must point the app to your computer's local Wi-Fi IP address.

1. Find your computer's IPv4 address (e.g., `192.168.31.100`).
2. Open `mobile/utils/api.ts` (or wherever your base URL is defined).
3. Update the URL to match your IP:
   ```typescript
   // Replace with your actual Wi-Fi IP address
   export const getBackendUrl = () => '[http://192.168.31.100:3000](http://192.168.31.100:3000)';
   ```
*(Note: If you are using an Android Emulator instead of a physical phone, change this IP to `http://10.0.2.2:3000`)*.

### Start the Expo Bundler
```bash
npx expo start --clear
```

---

## 🚀 3. How to View the App

Once the Expo bundler starts, it will display a large QR code in your terminal. Here are the ways you can view the app:

### Option A: Physical Mobile Device (Recommended)
1. Ensure your phone and your computer are connected to the **exact same Wi-Fi network**.
2. Open the **Expo Go** app on your phone.
3. **Android:** Tap "Scan QR Code" in the Expo Go app and scan the terminal code.
4. **iOS:** Open your iPhone's default Camera app, scan the QR code, and tap the "Open in Expo Go" notification.

### Option B: Android Emulator
1. Open Android Studio and launch a Virtual Device (AVD).
2. Once the emulator is running, go to your Expo terminal and press `a`.
3. Expo will automatically install the app on the emulator and launch it.

### Option C: iOS Simulator (Mac Only)
1. Open Xcode and launch a Simulator.
2. In your Expo terminal, press `i`.

### Option D: Web Browser
1. In your Expo terminal, press `w`.
2. The app will open in your default web browser at `http://localhost:8081`. *(Note: Some native mobile APIs or strictly mobile layout features may render differently on the web).*

---

## 🧪 Troubleshooting
* **"Network Error" on Mobile:** Ensure your laptop's Firewall is not blocking Node.js connections on port 3000. Double-check that the IP address in your Axios config matches your computer's current Wi-Fi IP.
* **Database Connection Failed:** Verify that MySQL is actively running on your machine and that the credentials in your `backend/.env` file are perfectly accurate.
