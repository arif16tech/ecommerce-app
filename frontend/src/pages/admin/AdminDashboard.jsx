import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-12">
        Admin Dashboard
      </h1>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/admin/add-product"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transform hover:-translate-y-1 text-center"
        >
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4 bg-blue-500">
            +
          </div>
          <h3 className="text-lg font-medium mb-1">Add Product</h3>
          <p className="text-sm text-gray-500">Create new product listings</p>
        </Link>

        <Link
          to="/admin/products"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transform hover:-translate-y-1 text-center"
        >
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4 bg-green-500">
            📦
          </div>
          <h3 className="text-lg font-medium mb-1">Manage Products</h3>
          <p className="text-sm text-gray-500">View and edit all products</p>
        </Link>

        <Link
          to="/admin/orders"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transform hover:-translate-y-1 text-center"
        >
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4 bg-red-500">
            📋
          </div>
          <h3 className="text-lg font-medium mb-1">Manage Orders</h3>
          <p className="text-sm text-gray-500">View and update order status</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
