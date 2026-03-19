# Implementation Plan: Vibe Pet App

Implementing progressive phases of the internship assessment.

## Proposed Changes for Part 3: Bookings & Discounts

### Backend Bookings API
#### [NEW] [bookingController.js](file:///d:/Projects/Mazo/backend/src/controllers/bookingController.js)
- Create `initiateBooking` controller logic to compute discounts (`SAVE20`, `MINUS10`) based on the fetched offering's base price. Record the transaction in the `Bookings` table.
- **The controller MUST include the `provider_payment_url` in its successful JSON response.**
#### [NEW] [bookingRoutes.js](file:///d:/Projects/Mazo/backend/src/routes/bookingRoutes.js)
- Establish the `POST /initiate` endpoint wiring to the controller.
#### [MODIFY] [index.js](file:///d:/Projects/Mazo/backend/src/index.js)
- Register `bookingRoutes` at `/api/bookings`.

### Frontend Booking Interfaces
#### [NEW] [BookingModal.tsx](file:///d:/Projects/Mazo/mobile/components/BookingModal.tsx)
- Create a `Modal` component capturing user discount codes and handling checkout submissions via Axios.
- **Upon a successful API response, use React Native's `Linking.openURL(url)` to redirect the user to the provider's payment page.**
#### [MODIFY] [offerings.tsx](file:///d:/Projects/Mazo/mobile/app/(tabs)/offerings.tsx)
- Add a "Book Now" trigger mechanism linking local component state (`selectedOffering`) to the new `BookingModal`.



## Verification Plan

### Automated Tests
- Run `curl http://localhost:3000/api/offerings` to ascertain that the backend successfully returns JSON data without internal 500 errors.

### Manual Verification
1. Navigate to the new "Services" tab in the Expo Go app.
2. Confirm that the loader is temporarily visible while awaiting the backend connection.
3. Terminate `node index.js` in the backend manually, hit "Retry" on the mobile app, and ensure that the "Network Error" gracefully resolves into the Retry interface instead of crashing in a Redbox.
4. If dummy data exists in your MySQL table, confirm the cards render with styled titles, types, providers, and prices appropriate to dark/light theme!
