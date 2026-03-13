import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const ProductDetail = () => {
  const { id } = useParams();
  const { user, fetchCart } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      if (response.data.success) {
        setProduct(response.data.product);
        const availableSize = response.data.product.sizes.find(s => s.stock > 0);
        if (availableSize) setSelectedSize(availableSize.size);
      }
    } catch (error) {
      console.error('Fetch product error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    setAdding(true);
    try {
      const response = await api.post('/cart/add', {
        productId: product._id,
        size: selectedSize,
        quantity
      });

      if (response.data.success) {
        await fetchCart();
        alert('Added to cart!');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!product) {
    return <div className="text-center py-12">Product not found</div>;
  }

  const selectedSizeStock = product.sizes.find(s => s.size === selectedSize)?.stock || 0;

  return (
    <div className="py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-6 rounded-lg shadow grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex justify-center items-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full max-w-md h-auto rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-semibold text-gray-800">{product.name}</h1>
          <p className="text-gray-500">
            {product.category} - {product.subcategory}
          </p>
          <p className="text-2xl font-bold text-green-600">₹{product.price}</p>
          <p className="text-gray-700 leading-relaxed">{product.description}</p>

          <div className="mt-4">
            <h3 className="font-medium">Select Size</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {product.sizes.map(sizeObj => (
                <button
                  key={sizeObj.size}
                  onClick={() => setSelectedSize(sizeObj.size)}
                  disabled={sizeObj.stock === 0}
                  className={`px-4 py-2 border rounded transition-colors ${
                    selectedSize === sizeObj.size
                      ? 'bg-gray-800 text-white border-gray-800'
                      : 'bg-white text-gray-800 border-gray-300'
                  } ${sizeObj.stock === 0 ? 'opacity-50 cursor-not-allowed line-through' : ''}`}
                >
                  {sizeObj.size}
                  {sizeObj.stock === 0 && <span className="text-xs ml-1">(Out)</span>}
                </button>
              ))}
            </div>
            {selectedSize && (
              <p className="text-sm text-green-600 mt-1">
                Stock available: {selectedSizeStock}
              </p>
            )}
          </div>

          <div className="mt-4">
            <h3 className="font-medium">Quantity</h3>
            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 border rounded"
              >
                -
              </button>
              <span className="text-xl font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(selectedSizeStock, quantity + 1))}
                disabled={quantity >= selectedSizeStock}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={adding || !selectedSize || selectedSizeStock === 0}
            className="mt-6 w-full bg-green-600 text-white py-2 rounded hover:bg-green-500 disabled:opacity-50 font-semibold"
          >
            {adding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
