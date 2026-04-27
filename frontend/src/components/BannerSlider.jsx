import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const originalBanners = [
  {
    id: 1,
    image: '/banners/banner_sale_fashion_1777182892596.png',
    title: 'Fashion Sale',
  },
  {
    id: 2,
    image: '/banners/banner_clothing_men_1777183668769.png',
    title: "Men's Collection",
  },
  {
    id: 3,
    image: '/banners/banner_clothing_women_1777183688849.png',
    title: "Women's Collection",
  },
  {
    id: 4,
    image: '/banners/banner_clothing_kids_1777183707181.png',
    title: "Kids' Collection",
  },
  {
    id: 5,
    image: '/banners/banner_sale_shoes_1777182925797.png',
    title: 'Shoes Sale',
  }
];

// Duplicate banners to allow continuous sliding feel
const banners = [...originalBanners, ...originalBanners, ...originalBanners, ...originalBanners];

const BannerSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        // Reset when reaching near the end to loop infinitely
        if (prevIndex >= banners.length - 4) return 0;
        return prevIndex + 1;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  // 100% on mobile (1 slide), 40% on desktop (2.5 slides per 100% width)
  const slidePercentage = isMobile ? 100 : 40;

  return (
    <div className="w-full max-w-7xl mx-auto mt-6 overflow-hidden pointer-events-none px-2 sm:px-4">
      <motion.div 
        className="flex"
        animate={{ x: `-${currentIndex * slidePercentage}%` }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {banners.map((banner, index) => (
          <div 
            key={`${banner.id}-${index}`} 
            className="shrink-0 px-1.5 sm:px-2"
            style={{ width: `${slidePercentage}%` }}
          >
            <div className="relative aspect-21/9 sm:aspect-21/9 w-full bg-gray-900 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm">
              <img
                src={banner.image}
                alt={banner.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default BannerSlider;
