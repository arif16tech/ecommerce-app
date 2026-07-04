# 🛍️ StyleStore – Modern Full-Stack E-Commerce Application

StyleStore is a premium, feature-rich full-stack e-commerce application built using the **MERN Stack** (MongoDB, Express, React, Node.js). It emphasizes a clean, scalable architecture, robust security, and a highly responsive, premium dark-themed UI/UX with fluid animations.

---

## ✨ Key Features

### 👤 User Experience & Security
- **Advanced Authentication**:
  - Secure sessions via **JWT & httpOnly cookies** for maximum security.
  - **OTP-based Email Verification** on signup — users must verify their email before logging in.
  - **OTP-based Forgot Password** flow — a time-limited OTP is emailed for secure password reset.
  - **Google OAuth 2.0** integration via Passport.js for one-click Registration and Login.
  - Rate limiting on all sensitive endpoints to prevent brute-force attacks.
- **Premium Dark Theme UI**: Entirely overhauled design with a `slate-950` dark base, glassmorphic card styles (`bg-slate-900/50`), proper borders, and consistent spacing across all pages.
- **Fluid Animations**: Staggered entry animations and smooth route transitions powered by **Framer Motion**.
- **State Management**: Scalable global state for products and cart using **Redux Toolkit**.
- **Real-time Notifications**: Instant feedback with beautiful toast notifications via **Sonner**.
- **Dynamic Cart**: Persistent, Redux-driven cart management with size and stock validation.
- **Stripe Integration**: Secure and seamless checkout process using the **Stripe Payment Gateway**.
- **Order Tracking**: Detailed user order history and status tracking.

### ⚡ Performance & Reliability
- **Full-Text Product Search**: Advanced searching using MongoDB `$text` indexes for rapid queries.
- **Infinite Scroll Pagination**: Seamlessly loads products as users scroll, reducing backend load.
- **Optimized Database**: MongoDB indexing and a dedicated Cart model structure.
- **Robust Validation**: Zod schemas to strictly validate all incoming API requests.
- **Global Error Handling**: Express-compatible global middleware for secure error formatting.
- **Beautiful HTML OTP Emails**: Branded dark-themed HTML email templates for all OTP communications.

### 🛡️ Admin Dashboard
- **Comprehensive Management**: Full control over products, categories, and inventory.
- **Stock Control**: Size-specific stock management for accurate inventory tracking.
- **Order Fulfillment**: View and update order statuses (Pending, Shipped, Delivered, Cancelled).
- **Product Operations**: Add and delete products with instant feedback toasts.

---

## 🏗️ Architecture

The project strictly separates concerns between client and server:
- **Frontend (`/frontend`)**: Handles UI rendering, global state (Redux), client-side routing, and animations. Communicates with the backend via a centralized Axios instance with interceptors for automatic token refresh.
- **Backend (`/backend`)**: RESTful API with business logic cleanly separated into controllers, routes, models, and middleware. Uses a stateless JWT architecture with tokens stored in HTTP-only cookies.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React + Vite | UI Framework & Dev Server |
| Redux Toolkit | Global State Management |
| Tailwind CSS | Styling (Dark Theme) |
| Framer Motion | Animations & Transitions |
| Sonner | Toast Notifications |
| React Router DOM | Client-side Routing |
| Axios | HTTP Client with Interceptors |
| Stripe Elements | Payment UI |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express.js | Server & REST API |
| MongoDB + Mongoose | Database & ODM |
| Passport.js | Google OAuth 2.0 |
| bcryptjs + jsonwebtoken | Password Hashing & JWT |
| Nodemailer | OTP Email Delivery |
| express-rate-limit | Brute-force Protection |
| Stripe SDK | Payment Processing |
| Zod | Request Validation |

---

## 🚀 Getting Started

### 1️⃣ Prerequisites
- Node.js (v18+) installed
- MongoDB (Local or Atlas URI)
- Stripe Account (for payment API keys)
- Google Cloud Console Project (for OAuth credentials)
- Gmail Account with **App Password** enabled (for OTP emails)

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

Create a `.env` file in the `backend` folder with the following variables:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Email (Nodemailer — Gmail App Password)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_char_app_password
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

Create a `.env` file in the `frontend` folder:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the development server:
```bash
npm run dev
```

The app will be available at **https://stylestore16tech.vercel.app**

---

## 🔐 Authentication Flow

```
Registration:
  User fills form → POST /api/auth/register
  → OTP emailed to user → User enters OTP
  → POST /api/auth/verify-email → Account activated & logged in

Forgot Password:
  User enters email → POST /api/auth/forgot-password
  → OTP emailed → User enters OTP + new password
  → POST /api/auth/reset-password → Password updated

Login:
  User enters email + password → POST /api/auth/login
  → JWT set in httpOnly cookie → User logged in
```

---

## 🗂️ Project Structure

```
ecommerce-app/
├── backend/
│   ├── config/          # Passport.js, DB config
│   ├── controllers/     # Auth, Product, Order, Payment logic
│   ├── middleware/       # Auth guard, validation, error handler
│   ├── models/          # Mongoose schemas (User, Product, Order, Cart)
│   ├── routes/          # Express route definitions
│   ├── utils/           # sendEmail, OTP email templates
│   ├── validations/     # Zod schemas
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/  # Navbar, reusable UI
    │   ├── context/     # AuthContext
    │   ├── pages/       # Home, Login, Register, Cart, Checkout, Orders, Profile, Admin
    │   ├── redux/       # Store, cartSlice
    │   └── utils/       # Axios instance (api.js)
    └── index.html
```

---

## 🌐 API Endpoints (Auth)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user, send OTP | Public |
| POST | `/api/auth/verify-email` | Verify email with OTP | Public |
| POST | `/api/auth/resend-otp` | Resend verification OTP | Public |
| POST | `/api/auth/login` | Login with email + password | Public |
| POST | `/api/auth/logout` | Logout, clear cookies | Private |
| GET | `/api/auth/check` | Check current auth status | Public |
| POST | `/api/auth/refresh-token` | Refresh JWT access token | Public |
| POST | `/api/auth/forgot-password` | Send password reset OTP | Public |
| POST | `/api/auth/reset-password` | Reset password with OTP | Public |
| GET | `/api/auth/profile` | Get user profile | Private |
| PUT | `/api/auth/profile` | Update user profile | Private |
| GET | `/api/auth/google` | Google OAuth login | Public |