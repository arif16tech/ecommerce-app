# StyleStore – MERN E-commerce

StyleStore is a full-stack e-commerce application built with the **MERN stack**.  
It includes secure authentication, cart management, Stripe payments, and an admin panel for managing products and orders.

---

# Features

### User
- Secure authentication with **JWT + httpOnly cookies**
- Browse and search products
- Add products to cart with stock validation
- Checkout with **Stripe payment gateway**
- Persistent cart
- Order history
- Profile management

### Admin
- Product management
- Size-wise stock control
- Order management
- Order status updates

---

# Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs
- cookie-parser
- Stripe

### Frontend
- React + Vite
- React Router
- Axios
- Stripe JS

---

# Installation

## 🔑 Environment Variables

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stylestore

JWT_SECRET=your_secret_key

STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx

FRONTEND_URL=http://localhost:5173

## ▶️ Run Locally

git clone https://github.com/arif16tech/ecommerce-app.git
cd ecommerce-app

### Backend
```bash
cd backend
npm install
npm run dev

### Frontend
```bash
cd frontend
npm install
npm run dev