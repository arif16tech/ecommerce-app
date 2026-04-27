# 🛍️ StyleStore – Modern Full-Stack E-Commerce Application

StyleStore is a premium, feature-rich full-stack e-commerce application built utilizing the **MERN Stack** (MongoDB, Express, React, Node.js). It emphasizes a clean, scalable architecture, robust security, and a highly responsive, modern UI/UX with fluid animations.

---

## ✨ Key Features

### 👤 User Experience & Security
- **Advanced Authentication**: 
  - Implementation using **JWT & httpOnly cookies** for maximum session security.
  - **OTP-based Email Verification** upon signup using Nodemailer to ensure valid user accounts.
  - **Google OAuth 2.0** integration via Passport.js for seamless single sign-on (SSO).
  - Secure **Forgot Password** flow via email OTPs.
  - Rate limiting applied to sensitive endpoints to prevent brute-force attacks.
- **Modern UI/UX**: Overhauled design with a premium aesthetic, custom glassmorphism effects, and a highly responsive mobile-first layout.
- **Fluid Animations**: Staggered entry animations and smooth route transitions powered by **Framer Motion**.
- **State Management**: Scalable global state for products and cart using **Redux Toolkit**.
- **Real-time Notifications**: Instant feedback with beautiful toast notifications via **Sonner**.
- **Dynamic Cart**: Persistent, Redux-driven cart management with size and stock validation.
- **Stripe Integration**: Secure and seamless checkout process using the **Stripe Payment Gateway**.
- **Order Tracking**: Detailed user order history and status tracking.

### 🛡️ Admin Dashboard
- **Comprehensive Management**: Full control over products, categories, and inventory.
- **Stock Control**: Size-specific stock management for accurate inventory tracking.
- **Order Fulfillment**: View and update order statuses (Processing, Shipped, Delivered).
- **Product Operations**: Add, edit, and delete products with ease.

---

## 🏗️ Clean Architecture

The project strictly separates concerns between the client and server:
- **Frontend (`/frontend`)**: Handles UI rendering, global state (Redux), client-side routing, and animations. It communicates with the backend via a centralized Axios instance utilizing interceptors for robust error handling.
- **Backend (`/backend`)**: Built as a RESTful API. Business logic is cleanly separated into controllers, routes, models, and middleware. It utilizes a stateless JWT architecture while safely storing tokens in HTTP-only cookies.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React + Vite
- **State Management**: Redux Toolkit & React Redux
- **Styling**: Tailwind CSS (with custom Glassmorphism utilities)
- **Animations**: Framer Motion
- **Toasts**: Sonner
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Payments**: Stripe Elements

### Backend
- **Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: Passport.js (Google OAuth), bcryptjs, jsonwebtoken, cookie-parser
- **Security & Mail**: express-rate-limit, helmet, nodemailer
- **Payments**: Stripe SDK

---

## 🚀 Getting Started

### 1️⃣ Prerequisites
- Node.js installed
- MongoDB (Local or Atlas)
- Stripe Account (for API keys)
- Google Cloud Console Project (for OAuth keys)
- Email Account (for Nodemailer App Password)

### 2️⃣ Clone the Repository
```bash
git clone https://github.com/arif16tech/ecommerce-app.git
cd ecommerce-app
```

### 3️⃣ Backend Setup
Navigate to the `backend` directory and install dependencies:
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
PORT=5000
NODE_ENV=development # Change to 'production' when deploying
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_xxx
CLIENT_URL=http://localhost:5173

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email Credentials (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```
Start the backend server:
```bash
npm run dev
```

### 4️⃣ Frontend Setup
Navigate to the `frontend` directory and install dependencies:
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend` folder and add the following:
```env
VITE_API_URL=http://localhost:5000/api
```
Start the development server:
```bash
npm run dev
```

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📝 License
This project is licensed under the MIT License.