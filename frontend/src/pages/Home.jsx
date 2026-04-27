import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import { motion } from 'framer-motion';
import BannerSlider from '../components/BannerSlider';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
};

const Home = () => {
  const dispatch = useDispatch();
  const { items: products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="pb-12 pt-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <BannerSlider />
      
      <div className="text-center mb-10 mt-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-gray-900 to-gray-600 mb-4"
        >
          Discover Premium Styles
        </motion.h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">Explore our curated collection of high-quality products designed for your modern lifestyle.</p>
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-2 sm:gap-6 lg:gap-8 grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      >
        {products.map(product => (
          <motion.div variants={itemVariants} key={product._id}>
            <Link
              to={`/product/${product._id}`}
              className="block bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              <div className="relative overflow-hidden aspect-4/5">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
              <div className="p-2 sm:p-5">
                <p className="text-[10px] sm:text-xs font-semibold text-blue-600 uppercase tracking-wider mb-0.5 sm:mb-1 truncate">
                  {product.category}
                </p>
                <h3 className="text-xs sm:text-lg font-bold text-gray-900 truncate mb-1 sm:mb-2 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                  <p className="text-sm sm:text-xl font-extrabold text-gray-900">₹{product.price}</p>
                  <span className="text-[9px] sm:text-sm text-gray-500 bg-gray-100 px-1 sm:px-2 py-0.5 sm:py-1 rounded-sm sm:rounded-md w-fit">{product.subcategory}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Home;
