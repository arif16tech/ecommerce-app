import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="py-8 sm:py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[60vh]">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-white mb-12">
        Admin Dashboard
      </h1>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/admin/add-product"
          className="bg-slate-900/50 p-8 rounded-3xl shadow-lg border border-slate-800 hover:border-slate-600 transition-all transform hover:-translate-y-1 text-center group"
        >
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-6 bg-slate-800 group-hover:bg-slate-700 transition-colors shadow-inner">
            +
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Add Product</h3>
          <p className="text-sm text-slate-400">Create new product listings in the catalog</p>
        </Link>

        <Link
          to="/admin/products"
          className="bg-slate-900/50 p-8 rounded-3xl shadow-lg border border-slate-800 hover:border-slate-600 transition-all transform hover:-translate-y-1 text-center group"
        >
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-6 bg-slate-800 group-hover:bg-slate-700 transition-colors shadow-inner">
            📦
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Manage Products</h3>
          <p className="text-sm text-slate-400">View, edit, and delete all products</p>
        </Link>

        <Link
          to="/admin/orders"
          className="bg-slate-900/50 p-8 rounded-3xl shadow-lg border border-slate-800 hover:border-slate-600 transition-all transform hover:-translate-y-1 text-center group"
        >
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-6 bg-slate-800 group-hover:bg-slate-700 transition-colors shadow-inner">
            📋
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Manage Orders</h3>
          <p className="text-sm text-slate-400">Track and update customer order statuses</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
