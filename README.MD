# 🛍️ StyleStore – Modern Online Clothing Store

StyleStore is a premium, full-stack e-commerce application built using the **MERN Stack** (MongoDB, Express, React, Node.js). It features a highly responsive, modern UI/UX with smooth animations and robust state management.

---

## ✨ Key Features

### 👤 User Experience
- **Secure Authentication**: Implementation using **JWT & httpOnly cookies** for maximum security.
- **Modern UI/UX**: Overhauled design with a premium aesthetic, custom glassmorphism effects, and a responsive layout.
- **Fluid Animations**: Staggered entry animations and smooth transitions powered by **Framer Motion**.
- **State Management**: Scalable global state for products and cart using **Redux Toolkit**.
- **Real-time Notifications**: Instant feedback with beautiful toast notifications via **Sonner**.
- **Dynamic Cart**: Persistent cart management with stock validation.
- **Stripe Integration**: Secure and seamless checkout process using the **Stripe Payment Gateway**.
- **Order Tracking**: Detailed order history and status tracking.

### 🛡️ Admin Dashboard
- **Comprehensive Management**: Full control over products, categories, and inventory.
- **Stock Control**: Size-specific stock management for accurate inventory tracking.
- **Order Fulfilment**: View and update order statuses (Processing, Shipped, Delivered).
- **Product Operations**: Add, edit, and delete products with ease.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React + Vite
- **State Management**: Redux Toolkit & React Redux
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Toasts**: Sonner
- **Routing**: React Router
- **HTTP Client**: Axios
- **Payments**: Stripe Elements

### Backend
- **Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Security**: JWT, bcryptjs, cookie-parser
- **Payments**: Stripe SDK

---

## 🚀 Getting Started

### 1️⃣ Prerequisites
- Node.js installed
- MongoDB (Local or Atlas)
- Stripe Account (for API keys)

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
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_xxx
FRONTEND_URL=http://localhost:5173
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
create .env file in frontend folder and add the following:
```env
VITE_API_URL=http://localhost:5000
```
Start the development server:
```bash
npm run dev
```