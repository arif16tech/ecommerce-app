import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

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
        alert('Product deleted successfully!');
        fetchProducts();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete product');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading products...</div>;
  }

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Product Management</h1>
        <Link
          to="/admin/add-product"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
        >
          Add New Product
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="grid grid-cols-[100px_2fr_1.5fr_1fr_1fr_1fr] gap-4 p-4 bg-gray-800 text-white font-semibold">
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
            className="grid grid-cols-[100px_2fr_1.5fr_1fr_1fr_1fr] gap-4 p-4 border-b items-center"
          >
            <div>
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-20 object-cover rounded"
              />
            </div>
            <div>{product.name}</div>
            <div>
              {product.category} - {product.subcategory}
            </div>
            <div>₹{product.price}</div>
            <div>{product.sizes.reduce((sum, s) => sum + s.stock, 0)}</div>
            <div>
              <button
                onClick={() => handleDelete(product._id)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductManagement;
