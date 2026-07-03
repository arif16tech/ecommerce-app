import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'sonner';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/all/orders');
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error('Fetch orders error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await api.put(`/orders/${orderId}/status`, {
        orderStatus: newStatus
      });

      if (response.data.success) {
        toast.success('Order status updated!');
        fetchOrders();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-400">Loading orders...</div>;
  }

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-6 sm:mb-8">Order Management</h1>

      <div className="space-y-6">
        {orders.map(order => (
          <div key={order._id} className="bg-slate-900/50 p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-800">
            <div className="flex flex-col sm:flex-row justify-between mb-4 pb-4 border-b border-slate-800">
              <div>
                <p className="font-bold text-white text-lg">
                  Order #{order._id.slice(-8).toUpperCase()}
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Customer: <span className="text-slate-300">{order.userId?.name || 'N/A'}</span> ({order.userId?.email || 'N/A'})
                </p>
                <p className="text-sm text-slate-400">
                  Date: {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="mt-4 sm:mt-0 text-left sm:text-right bg-slate-800/50 px-6 py-3 rounded-xl border border-slate-700/50 self-start">
                <p className="text-sm text-slate-400 mb-1">Total Amount</p>
                <p className="text-xl font-extrabold text-emerald-400">₹{order.totalAmount}</p>
                <p className="text-sm text-slate-400 mt-1">
                  {order.paymentMethod} - <span className="text-slate-300">{order.paymentStatus}</span>
                </p>
              </div>
            </div>

            <div className="mb-6 space-y-2">
              <p className="text-sm font-semibold text-slate-300 mb-2">Order Items:</p>
              {order.items.map((item, index) => (
                <div key={index} className="text-sm text-slate-400 bg-slate-800/30 p-3 rounded-lg border border-slate-700/30 flex gap-4 items-center">
                  {item.image && (
                     <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded bg-slate-800" />
                  )}
                  <div>
                    <span className="font-medium text-white block">{item.name}</span>
                    Size: {item.size} | Qty: {item.quantity}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-6 border-t border-slate-800">
              <label className="font-semibold text-slate-300">Update Status:</label>
              <select
                value={order.orderStatus}
                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 font-medium"
              >
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="text-center py-12 text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800">
            No orders found.
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
