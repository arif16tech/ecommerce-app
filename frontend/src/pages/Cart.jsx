import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Cart = () => {
  const { cart, cartTotal, fetchCart } = useAuth();
  const navigate = useNavigate();

  const handleUpdateQuantity = async (productId, size, newQuantity) => {
    try {
      const response = await api.put('/cart/update', {
        productId,
        size,
        quantity: newQuantity
      });

      if (response.data.success) {
        await fetchCart();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update cart');
    }
  };

  const handleRemoveItem = async (productId, size) => {
    if (!window.confirm('Remove this item from cart?')) return;

    try {
      const response = await api.delete(`/cart/remove/${productId}/${size}`);

      if (response.data.success) {
        await fetchCart();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to remove item');
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
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
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div
              key={`${item.productId._id}-${item.size}`}
              className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow"
            >
              <img
                src={item.productId.image}
                alt={item.productId.name}
                className="w-full sm:w-32 h-32 object-cover rounded"
              />

              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-800">
                  {item.productId.name}
                </h3>
                <p className="text-sm text-gray-500">Size: {item.size}</p>
                <p className="text-green-600 font-bold mt-1">
                  ₹{item.productId.price}
                </p>
              </div>

              <div className="flex flex-col items-end space-y-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleUpdateQuantity(item.productId._id, item.size, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="px-2 py-1 border rounded disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="font-bold">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.productId._id, item.size, item.quantity + 1)}
                    className="px-2 py-1 border rounded"
                  >
                    +
                  </button>
                </div>

                <p className="font-bold">Subtotal: ₹{item.productId.price * item.quantity}</p>

                <button
                  onClick={() => handleRemoveItem(item.productId._id, item.size)}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <h2 className="text-xl font-semibold">Order Summary</h2>
          <div className="flex justify-between">
            <span>Items ({cart.length}):</span>
            <span>₹{cartTotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>FREE</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-4">
            <span>Total:</span>
            <span>₹{cartTotal}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-500 font-semibold"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
