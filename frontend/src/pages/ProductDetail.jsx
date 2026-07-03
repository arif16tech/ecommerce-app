import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDispatch } from "react-redux";
import { fetchCart } from "../redux/slices/cartSlice";
import api from "../utils/api";
import { motion } from "framer-motion";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      if (response.data.success) {
        setProduct(response.data.product);
        const availableSize = response.data.product.sizes.find(
          (s) => s.stock > 0,
        );
        if (availableSize) setSelectedSize(availableSize.size);
      }
    } catch (error) {
      console.error("Fetch product error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    setAdding(true);
    try {
      const response = await api.post("/cart/add", {
        productId: product._id,
        size: selectedSize,
        quantity,
      });

      if (response.data.success) {
        dispatch(fetchCart());
        toast.success("Added to cart!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
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

  const selectedSizeStock =
    product.sizes.find((s) => s.size === selectedSize)?.stock || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="bg-slate-900/50 p-6 rounded-3xl shadow-lg border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex justify-center items-center">
          <motion.img
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full max-w-sm h-auto rounded-2xl shadow-2xl object-cover aspect-4/5 bg-slate-800"
          />
        </div>

        <div className="flex flex-col justify-center gap-5">
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-1">
              {product.name}
            </h1>
            <p className="text-slate-400 font-medium text-sm tracking-wide">
              <span className="text-slate-300">{product.category}</span> /{" "}
              {product.subcategory}
            </p>
          </div>

          <p className="text-2xl font-extrabold text-white">
            ₹{product.price}
          </p>

          <div className="text-slate-400 text-sm leading-relaxed">
            <p>
              {isExpanded
                ? product.description
                : product.description?.length > 120
                ? `${product.description.substring(0, 120)}...`
                : product.description}
            </p>
            {product.description?.length > 120 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-white hover:text-slate-300 font-semibold mt-1 transition-colors underline underline-offset-4"
              >
                {isExpanded ? "Show Less" : "Read More"}
              </button>
            )}
          </div>

          <div className="space-y-3 mt-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Select Size
            </h3>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map((sizeObj) => (
                <button
                  key={sizeObj.size}
                  onClick={() => setSelectedSize(sizeObj.size)}
                  disabled={sizeObj.stock === 0}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    selectedSize === sizeObj.size
                      ? "bg-white text-slate-900 shadow-md ring-2 ring-white ring-offset-2 ring-offset-slate-900"
                      : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white"
                  } ${sizeObj.stock === 0 ? "opacity-50 cursor-not-allowed line-through" : ""}`}
                >
                  {sizeObj.size}
                </button>
              ))}
            </div>
            {selectedSize && (
              <p className="text-sm text-slate-400 mt-2">
                <span
                  className={
                    selectedSizeStock > 0
                      ? "text-emerald-400 font-medium"
                      : "text-red-400"
                  }
                >
                  {selectedSizeStock > 0
                    ? `In Stock (${selectedSizeStock} available)`
                    : "Out of Stock"}
                </span>
              </p>
            )}
          </div>

          <div className="space-y-3 mt-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Quantity
            </h3>
            <div className="flex items-center gap-4 bg-slate-800 w-fit p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-700 border border-slate-600 text-white hover:bg-slate-600 transition-colors shadow-sm"
              >
                -
              </button>
              <span className="text-lg font-bold w-8 text-center text-white">
                {quantity}
              </span>
              <button
                onClick={() =>
                  setQuantity(Math.min(selectedSizeStock, quantity + 1))
                }
                disabled={quantity >= selectedSizeStock}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-700 border border-slate-600 text-white hover:bg-slate-600 disabled:opacity-50 disabled:hover:bg-slate-700 transition-colors shadow-sm"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={adding || !selectedSize || selectedSizeStock === 0}
            className="mt-4 w-full bg-white text-slate-900 py-3.5 rounded-xl hover:bg-slate-200 disabled:opacity-50 disabled:bg-slate-600 disabled:text-slate-400 font-bold shadow-lg transition-all transform hover:-translate-y-1 active:translate-y-0"
          >
            {adding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetail;
