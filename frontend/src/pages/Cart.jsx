import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateCartItem, removeCartItem } from "../redux/slices/cartSlice";
import { motion } from "framer-motion";

const Cart = () => {
  const { items: cart, total: cartTotal } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleUpdateQuantity = (productId, size, newQuantity) => {
    dispatch(updateCartItem({ productId, size, quantity: newQuantity }));
  };

  const handleRemoveItem = (productId, size) => {
    dispatch(removeCartItem({ productId, size }));
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }
    navigate("/checkout");
  };

  if (!cart || cart.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20 min-h-[60vh] flex flex-col justify-center items-center px-4"
      >
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-100 max-w-md w-full">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-8 text-sm sm:text-base">
            Looks like you haven't added anything to your cart yet.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-blue-600 text-white font-medium py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
          >
            Start Shopping
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6 sm:mb-8">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {cart.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              key={`${item.productId._id}-${item.size}`}
              // Adjusted padding (p-4 on mobile) and forced flex-row
              className="flex flex-row gap-3 sm:gap-6 bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100"
            >
              <img
                src={item.productId.image}
                alt={item.productId.name}
                loading="lazy"
                // Shrunk mobile image size to a 5rem square (w-20 h-20)
                className="w-20 h-20 sm:w-32 sm:h-32 object-cover rounded-lg sm:rounded-xl shrink-0"
              />

              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-1 line-clamp-1">
                    {item.productId.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
                    Size:{" "}
                    <span className="font-semibold text-gray-700">
                      {item.size}
                    </span>
                  </p>
                  <p className="text-blue-600 font-bold sm:font-extrabold text-sm sm:text-lg">
                    ₹{item.productId.price}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between py-1">
                <button
                  onClick={() =>
                    handleRemoveItem(item.productId._id, item.size)
                  }
                  className="text-red-500 hover:text-red-600 text-xs sm:text-sm font-medium transition-colors"
                >
                  Remove
                </button>

                {/* Shrunk the quantity selector buttons for mobile */}
                <div className="flex items-center space-x-1 sm:space-x-3 bg-gray-50 rounded-lg p-1 border border-gray-200 mt-2 sm:mt-0">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(
                        item.productId._id,
                        item.size,
                        item.quantity - 1,
                      )
                    }
                    disabled={item.quantity <= 1}
                    className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-md bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors text-sm"
                  >
                    -
                  </button>
                  <span className="font-bold w-5 sm:w-6 text-center text-xs sm:text-base text-gray-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleUpdateQuantity(
                        item.productId._id,
                        item.size,
                        item.quantity + 1,
                      )
                    }
                    className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-md bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors text-sm"
                  >
                    +
                  </button>
                </div>

                <p className="font-bold text-gray-900 text-sm sm:text-base mt-2">
                  ₹{item.productId.price * item.quantity}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-24 space-y-4 sm:space-y-6"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4">
            Order Summary
          </h2>
          <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-600 font-medium">
            <div className="flex justify-between">
              <span>Items ({cart.length}):</span>
              <span className="text-gray-900">₹{cartTotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span className="text-green-600 font-bold">FREE</span>
            </div>
            <div className="flex justify-between text-lg sm:text-xl font-extrabold text-gray-900 border-t border-gray-100 pt-4 sm:pt-6">
              <span>Total:</span>
              <span className="text-blue-600">₹{cartTotal}</span>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-3 sm:py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 font-bold text-base sm:text-lg shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-1"
          >
            Proceed to Checkout
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Cart;
