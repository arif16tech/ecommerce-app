import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSelector, useDispatch } from 'react-redux';
import { clearCartState } from '../redux/slices/cartSlice'; 
import api from '../utils/api';
import { toast } from 'sonner'; // Imported toast

const Checkout = () => {
  const { user } = useAuth();
  const { items: cart, total: cartTotal } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    pincode: user?.pincode || ''
  });

  const handleChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const handleCODOrder = async () => {
    setLoading(true);
    try {
      const response = await api.post('/orders/create', {
        paymentMethod: 'COD',
        shippingAddress
      });

      if (response.data.success) {
        dispatch(clearCartState()); 
        toast.success('Order placed successfully!'); // Replaced alert
        navigate('/orders');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Order failed'); // Replaced alert
    } finally {
      setLoading(false);
    }
  };

  const handleStripeCheckout = async () => {
    setLoading(true);
    try {
      const response = await api.post('/payment/create-checkout-session', {
        shippingAddress
      });

      if (response.data.success && response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment initialization failed'); // Replaced alert
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!cart || cart.length === 0) {
      toast.warning('Your cart is empty'); // Replaced alert
      return;
    }

    if (paymentMethod === 'COD') {
      handleCODOrder();
    } else {
      handleStripeCheckout();
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold">Your cart is empty</h2>
        <button
          onClick={() => navigate('/')}
          className="mt-6 px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit}>
            <h2 className="text-lg font-medium mb-4">Shipping Address</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Full Name *</label>
              <input
                type="text"
                name="name"
                value={shippingAddress.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email *</label>
              <input
                type="email"
                name="email"
                value={shippingAddress.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Phone *</label>
              <input
                type="tel"
                name="phone"
                value={shippingAddress.phone}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Address *</label>
              <textarea
                name="address"
                value={shippingAddress.address}
                onChange={handleChange}
                required
                rows="3"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Pincode *</label>
              <input
                type="text"
                name="pincode"
                value={shippingAddress.pincode}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <h2 className="text-lg font-medium mt-8 mb-4">Payment Method</h2>

            <div className="space-y-4">
              <label className="flex items-center p-3 border rounded cursor-pointer">
                <input
                  type="radio"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="form-radio"
                />
                <span className="ml-3">Cash on Delivery</span>
              </label>

              <label className="flex items-center p-3 border rounded cursor-pointer">
                <input
                  type="radio"
                  value="Stripe"
                  checked={paymentMethod === 'Stripe'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="form-radio"
                />
                <span className="ml-3">Pay with Stripe (Card/UPI/Wallets)</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full bg-green-600 text-white py-2 rounded hover:bg-green-500 font-semibold disabled:opacity-50"
            >
              {loading
                ? 'Processing...'
                : paymentMethod === 'COD'
                ? 'Place Order (COD)'
                : 'Proceed to Payment'}
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Order Summary</h2>

          <div className="space-y-4">
            {cart.map((item) => (
              <div key={`${item.productId._id}-${item.size}`} className="flex gap-4 items-center">
                <img
                  src={item.productId.image}
                  alt={item.productId.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.productId.name}</p>
                  <p className="text-sm text-gray-500">
                    Size: {item.size} | Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-bold">₹{item.productId.price * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{cartTotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>FREE</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span>₹{cartTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;