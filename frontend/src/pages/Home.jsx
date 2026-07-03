import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } }
};

const Home = () => {
  const dispatch = useDispatch();
  const { items: products, loading, hasMore } = useSelector((state) => state.products);

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [page, setPage] = useState(1);
  const observer = useRef();

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    dispatch(fetchProducts({ searchQuery, page, limit: 10 }));
  }, [dispatch, searchQuery, page]);

  const lastProductElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const skeletonItems = Array.from({ length: 10 });
  
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="pb-20 pt-2 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <BannerSlider />
      
      <div className="text-center mt-20 mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 drop-shadow-sm"
        >
          Curated Essentials.
        </motion.h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg sm:text-xl font-medium">
          Elevate your everyday with our collection of premium, purposefully designed items.
        </p>
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-6 sm:gap-8 lg:gap-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {products.map((product, index) => {
          const isLastElement = products.length === index + 1;
          return (
            <motion.div 
              ref={isLastElement ? lastProductElementRef : null} 
              variants={itemVariants} 
              key={`${product._id}-${index}`}
            >
              <Link
                to={`/product/${product._id}`}
                className="block group cursor-pointer bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-slate-600 transition-colors duration-300 p-2 sm:p-3 overflow-hidden shadow-sm"
              >
                <div className="relative overflow-hidden aspect-4/5 rounded-xl bg-slate-800 mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                </div>
                
                <div className="px-2 pb-2 flex flex-col items-center text-center">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    {product.category}
                  </p>
                  <h3 className="text-sm sm:text-base font-semibold text-slate-200 mb-1.5 line-clamp-1 group-hover:text-white transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm font-medium text-slate-400">
                    ₹{product.price}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
        
        {loading && skeletonItems.map((_, index) => (
          <div key={`skeleton-${index}`} className="animate-pulse bg-slate-900/50 rounded-2xl border border-slate-800 p-2 sm:p-3">
            <div className="aspect-4/5 bg-slate-800 rounded-xl mb-4"></div>
            <div className="px-2 pb-2 flex flex-col items-center">
              <div className="h-3 bg-slate-800 rounded-full w-1/3 mb-2"></div>
              <div className="h-4 bg-slate-700 rounded-full w-3/4 mb-2"></div>
              <div className="h-4 bg-slate-800 rounded-full w-1/4"></div>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Home;
