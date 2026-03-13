import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

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
        alert('Order status updated!');
        fetchOrders();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading orders...</div>;
  }

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Order Management</h1>

      <div className="space-y-6">
        {orders.map(order => (
          <div key={order._id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex flex-col sm:flex-row justify-between mb-4 pb-4 border-b">
              <div>
                <p className="font-bold text-gray-800">
                  Order #{order._id.slice(-8).toUpperCase()}
                </p>
                <p className="text-sm text-gray-500">
                  Customer: {order.userId?.name || 'N/A'} ({order.userId?.email || 'N/A'})
                </p>
                <p className="text-sm text-gray-500">
                  Date: {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="mt-4 sm:mt-0 text-right">
                <p className="text-xl font-bold text-green-600">₹{order.totalAmount}</p>
                <p className="text-sm text-gray-500">
                  {order.paymentMethod} - {order.paymentStatus}
                </p>
              </div>
            </div>

            <div className="mb-4 space-y-1">
              {order.items.map((item, index) => (
                <div key={index} className="text-sm">
                  {item.name} (Size: {item.size}, Qty: {item.quantity})
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 pt-4 border-t">
              <label className="font-medium">Order Status:</label>
              <select
                value={order.orderStatus}
                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded"
              >
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderManagement;
