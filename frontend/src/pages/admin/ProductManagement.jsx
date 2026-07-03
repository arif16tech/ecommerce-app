import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'sonner';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error('Fetch products error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await api.delete(`/products/${id}`);
      if (response.data.success) {
        toast.success('Product deleted successfully!');
        fetchProducts();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-400">Loading products...</div>;
  }

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[80vh]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Product Management</h1>
        <Link
          to="/admin/add-product"
          className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-lg"
        >
          Add New Product
        </Link>
      </div>

      <div className="bg-slate-900/50 shadow-xl rounded-3xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-[100px_2fr_1.5fr_1fr_1fr_1fr] gap-4 p-4 bg-slate-800/80 text-slate-300 font-bold border-b border-slate-700">
              <div>Image</div>
              <div>Name</div>
              <div>Category</div>
              <div>Price</div>
              <div>Stock</div>
              <div>Actions</div>
            </div>
            {products.map(product => (
              <div
                key={product._id}
                className="grid grid-cols-[100px_2fr_1.5fr_1fr_1fr_1fr] gap-4 p-4 border-b border-slate-800/50 items-center hover:bg-slate-800/30 transition-colors text-white"
              >
                <div>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg bg-slate-800 border border-slate-700"
                  />
                </div>
                <div className="font-semibold">{product.name}</div>
                <div className="text-slate-400">
                  <span className="text-slate-300">{product.category}</span> - {product.subcategory}
                </div>
                <div className="font-bold text-emerald-400">₹{product.price}</div>
                <div>
                  <span className="px-3 py-1 bg-slate-800 rounded-lg text-sm font-medium border border-slate-700">
                    {product.sizes.reduce((sum, s) => sum + s.stock, 0)}
                  </span>
                </div>
                <div>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="px-4 py-2 bg-red-500/10 text-red-400 font-bold rounded-lg hover:bg-red-500/20 border border-red-500/20 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                No products found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
