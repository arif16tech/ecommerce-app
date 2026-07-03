import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSelector, useDispatch } from 'react-redux';
import { clearCartState } from '../redux/slices/cartSlice'; 
import api from '../utils/api';
import { toast } from 'sonner';

const Checkout = () => {
  const { user, checkAuthStatus } = useAuth();
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
        await checkAuthStatus(); 
        toast.success('Order placed successfully!'); 
        navigate('/orders');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Order failed'); 
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
      toast.error(error.response?.data?.message || 'Payment initialization failed'); 
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!cart || cart.length === 0) {
      toast.warning('Your cart is empty'); 
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
      <div className="text-center py-20 min-h-[60vh] flex flex-col justify-center items-center">
        <div className="bg-slate-900/50 p-10 rounded-3xl border border-slate-800">
          <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate('/')}
            className="mt-6 px-8 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-6 sm:mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 bg-slate-900/50 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-sm">
          <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">Shipping Address</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Full Name *</label>
              <input
                type="text"
                name="name"
                value={shippingAddress.name}
                onChange={handleChange}
                required
                className="block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors text-white placeholder-slate-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Email *</label>
              <input
                type="email"
                name="email"
                value={shippingAddress.email}
                onChange={handleChange}
                required
                className="block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors text-white placeholder-slate-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Phone *</label>
              <input
                type="tel"
                name="phone"
                value={shippingAddress.phone}
                onChange={handleChange}
                required
                className="block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors text-white placeholder-slate-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Address *</label>
              <textarea
                name="address"
                value={shippingAddress.address}
                onChange={handleChange}
                required
                rows="3"
                className="block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors text-white placeholder-slate-500"
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Pincode *</label>
              <input
                type="text"
                name="pincode"
                value={shippingAddress.pincode}
                onChange={handleChange}
                required
                className="block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors text-white placeholder-slate-500"
              />
            </div>

            <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">Payment Method</h2>

            <div className="space-y-4">
              <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'COD' ? 'border-white bg-slate-800' : 'border-slate-700 bg-slate-900/50 hover:bg-slate-800'}`}>
                <input
                  type="radio"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-slate-900 bg-slate-800 border-slate-600 focus:ring-white focus:ring-2"
                />
                <span className="ml-3 font-medium text-white">Cash on Delivery</span>
              </label>

              <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'Stripe' ? 'border-white bg-slate-800' : 'border-slate-700 bg-slate-900/50 hover:bg-slate-800'}`}>
                <input
                  type="radio"
                  value="Stripe"
                  checked={paymentMethod === 'Stripe'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-slate-900 bg-slate-800 border-slate-600 focus:ring-white focus:ring-2"
                />
                <span className="ml-3 font-medium text-white">Pay with Stripe (Card/UPI/Wallets)</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full bg-white text-slate-900 py-4 rounded-xl hover:bg-slate-200 font-bold text-lg disabled:opacity-50 disabled:bg-slate-700 disabled:text-slate-400 shadow-lg transition-transform hover:-translate-y-1"
            >
              {loading
                ? 'Processing...'
                : paymentMethod === 'COD'
                ? 'Place Order (COD)'
                : 'Proceed to Payment'}
            </button>
          </form>
        </div>

        <div className="bg-slate-900/50 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-sm h-fit sticky top-28">
          <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-4 mb-6">Order Summary</h2>

          <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
            {cart.map((item) => (
              <div key={`${item.productId._id}-${item.size}`} className="flex gap-4 items-center bg-slate-800/50 p-2 rounded-xl">
                <img
                  src={item.productId.image}
                  alt={item.productId.name}
                  className="w-16 h-16 object-cover rounded-lg bg-slate-800 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">{item.productId.name}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Size: {item.size} | Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-bold text-white shrink-0">₹{item.productId.price * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-6 space-y-3 font-medium text-slate-400">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="text-white">₹{cartTotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span className="text-emerald-400 font-bold">FREE</span>
            </div>
            <div className="flex justify-between text-xl font-extrabold text-white border-t border-slate-800 pt-4 mt-2">
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