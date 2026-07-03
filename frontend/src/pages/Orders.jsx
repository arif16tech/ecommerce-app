import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/my-orders');
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error('Fetch orders error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#f39c12';
      case 'Shipped': return '#3498db';
      case 'Delivered': return '#27ae60';
      case 'Cancelled': return '#e74c3c';
      default: return '#7f8c8d';
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-400">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20 min-h-[60vh] flex flex-col justify-center items-center">
        <div className="bg-slate-900/50 p-10 rounded-3xl border border-slate-800 max-w-md w-full">
          <h2 className="text-xl font-bold text-white mb-4">No orders yet</h2>
          <p className="text-slate-400">Start shopping to see your orders here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-6 sm:mb-8">My Orders</h1>

      <div className="space-y-6">
        {orders.map(order => (
          <div
            key={order._id}
            className="bg-slate-900/50 p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-800"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-4 mb-4">
              <div>
                <p className="font-bold text-white text-lg">
                  Order #{order._id.slice(-8).toUpperCase()}
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <span
                className="mt-2 sm:mt-0 inline-block px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-sm"
                style={{ backgroundColor: getStatusColor(order.orderStatus) }}
              >
                {order.orderStatus}
              </span>
            </div>

            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4 items-center bg-slate-800/30 p-3 rounded-xl border border-slate-700/50">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg bg-slate-800"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">{item.name}</p>
                    <p className="text-sm text-slate-400 mt-1">
                      Size: {item.size} | Qty: {item.quantity}
                    </p>
                    <p className="text-emerald-400 font-bold mt-1">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-t border-slate-800 pt-6 mt-6">
              <div className="text-sm text-slate-400 space-y-1.5">
                <p>
                  <strong className="text-slate-300">Payment:</strong> {order.paymentMethod}
                </p>
                <p>
                  <strong className="text-slate-300">Status:</strong> {order.paymentStatus}
                </p>
              </div>
              <div className="text-right mt-4 sm:mt-0 bg-slate-800/50 px-6 py-3 rounded-xl border border-slate-700/50">
                <p className="text-sm text-slate-400 mb-1">Total Amount</p>
                <p className="text-xl font-extrabold text-white">₹{order.totalAmount}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
