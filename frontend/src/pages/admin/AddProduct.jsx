import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'sonner';

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    price: '',
    category: '',
    subcategory: '',
    sizes: [
      { size: 'S', stock: 0 },
      { size: 'M', stock: 0 },
      { size: 'L', stock: 0 },
      { size: 'XL', stock: 0 }
    ]
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSizeStockChange = (size, stock) => {
    const newSizes = formData.sizes.map(s =>
      s.size === size ? { ...s, stock: parseInt(stock) || 0 } : s
    );
    setFormData({ ...formData, sizes: newSizes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/products', {
        ...formData,
        price: parseFloat(formData.price)
      });

      if (response.data.success) {
        toast.success('Product created successfully!');
        navigate('/admin/products');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[80vh]">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-6 sm:mb-8">Add New Product</h1>

      <form onSubmit={handleSubmit} className="bg-slate-900/50 p-6 sm:p-10 rounded-3xl shadow-xl border border-slate-800">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors text-white placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors text-white placeholder-slate-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">Image URL *</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
              placeholder="https://example.com/image.jpg"
              className="block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors text-white placeholder-slate-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors text-white placeholder-slate-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">Category *</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                placeholder="e.g., Men, Women"
                className="block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors text-white placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">Subcategory *</label>
              <input
                type="text"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                required
                placeholder="e.g., T-Shirts"
                className="block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors text-white placeholder-slate-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <label className="block text-sm font-semibold text-slate-300 mb-4">Size & Stock</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {formData.sizes.map(sizeObj => (
                <div key={sizeObj.size} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                  <span className="block text-center font-bold text-white mb-2">{sizeObj.size}</span>
                  <input
                    type="number"
                    value={sizeObj.stock}
                    onChange={(e) => handleSizeStockChange(sizeObj.size, e.target.value)}
                    min="0"
                    className="block w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-white text-center font-mono"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-10 pt-6 border-t border-slate-800">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3.5 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Creating Product...' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-8 py-3.5 bg-slate-800 border border-slate-700 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
