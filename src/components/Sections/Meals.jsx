import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FiArrowLeft, FiArrowRight, FiClock, FiDollarSign } from 'react-icons/fi';
import { GiBarbedCoil } from 'react-icons/gi';
import { recipes } from '../../data/recipes';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Meals() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  const filteredRecipes = selectedCategory === 'All' 
    ? recipes 
    : recipes.filter((r) => r.category === selectedCategory);

  return (
    <section id="recipes" style={{ background: 'linear-gradient(to bottom, var(--color-clay) 0%, var(--bg-color) 100%)' }}>
      {/* Wave top divider */}
      <div className="organic-divider divider-top">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79-22.2,103.59-32.17,158-29.45,70.36,3.53,136.46,28.81,200.63,55.22,84,34.56,168.17,65,257.5,60.67,84.18-4.12,163.53-29.62,236.42-66C932.32,27.18,1022.61,1.52,1108.62,11.23c29,3.27,57,11.43,84.4,24.12V0Z" className="shape-fill"></path>
        </svg>
      </div>

      <div className="section-header">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 0.8, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'inline-block',
            fontSize: '0.95rem',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: 'var(--color-earth)',
            fontWeight: 700,
            marginBottom: '10px'
          }}
        >
          Gourmet Simplicity
        </motion.span>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Student Friendly Meals
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 0.8, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Quick, wallet-friendly, nutrient-packed creations that fit perfectly into your academic schedule.
        </motion.p>
      </div>

      {/* Category filters */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          marginBottom: '50px',
          maxWidth: '800px',
          margin: '0 auto 50px auto'
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              border: 'none',
              background: selectedCategory === cat ? 'var(--color-earth)' : 'var(--glass-bg)',
              color: selectedCategory === cat ? 'var(--color-cream)' : 'var(--color-earth)',
              padding: '10px 24px',
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: '1px solid var(--glass-border)',
              transition: 'all 0.3s ease'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Swiper slider structure */}
      <div 
        style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          position: 'relative',
          padding: '0 40px'
        }}
        className="meals-carousel-wrapper"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              navigation={{
                prevEl: '.swiper-btn-prev',
                nextEl: '.swiper-btn-next',
              }}
              pagination={{ clickable: true, el: '.swiper-custom-pagination' }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
              }}
              style={{ paddingBottom: '60px' }}
            >
              {filteredRecipes.map((recipe) => (
                <SwiperSlide key={recipe.id}>
                  <motion.div
                    className="glass-card"
                    style={{
                      padding: 0,
                      overflow: 'hidden',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '520px'
                    }}
                  >
                    {/* Image block with hover zoom */}
                    <div 
                      style={{ 
                        height: '220px', 
                        width: '100%', 
                        overflow: 'hidden', 
                        position: 'relative' 
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          top: '15px',
                          left: '15px',
                          backgroundColor: 'var(--color-cream)',
                          color: 'var(--color-earth)',
                          padding: '4px 12px',
                          borderRadius: '30px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          zIndex: 3,
                          border: '1px solid var(--glass-border)'
                        }}
                      >
                        {recipe.category}
                      </span>
                      
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                        className="recipe-slide-img"
                      />
                    </div>

                    {/* Content details */}
                    <div
                      style={{
                        padding: '30px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        flexGrow: 1
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            gap: '15px',
                            fontSize: '0.85rem',
                            color: 'var(--color-text-light)',
                            opacity: 0.8,
                            fontWeight: 600,
                            marginBottom: '10px'
                          }}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <FiClock /> {recipe.time}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <FiDollarSign /> {recipe.cost}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <GiBarbedCoil /> {recipe.protein} Protein
                          </span>
                        </div>

                        <h3 
                          style={{ 
                            fontSize: '1.4rem', 
                            color: 'var(--color-earth)', 
                            lineHeight: 1.3,
                            marginBottom: '12px' 
                          }}
                        >
                          {recipe.title}
                        </h3>

                        <p 
                          style={{ 
                            fontSize: '0.9rem', 
                            color: 'var(--color-text-light)', 
                            lineHeight: 1.6,
                            opacity: 0.9 
                          }}
                        >
                          {recipe.desc}
                        </p>
                      </div>

                      <div style={{ marginTop: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {recipe.ingredients.slice(0, 3).map((ing) => (
                          <span
                            key={ing}
                            style={{
                              fontSize: '0.75rem',
                              backgroundColor: 'rgba(87,61,33,0.05)',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontWeight: 600
                            }}
                          >
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </AnimatePresence>

        {/* Custom slider controls */}
        <div
          className="swiper-btn-prev"
          style={{
            position: 'absolute',
            left: 0,
            top: '40%',
            zIndex: 10,
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-cream)',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--color-earth)',
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
          }}
        >
          <FiArrowLeft />
        </div>
        <div
          className="swiper-btn-next"
          style={{
            position: 'absolute',
            right: 0,
            top: '40%',
            zIndex: 10,
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-cream)',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--color-earth)',
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
          }}
        >
          <FiArrowRight />
        </div>

        {/* Custom pagination positioning */}
        <div
          className="swiper-custom-pagination"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '20px'
          }}
        />
      </div>

      <style>{`
        .glass-card:hover .recipe-slide-img {
          transform: scale(1.08);
        }
        .swiper-pagination-bullet-active {
          background: var(--color-earth) !important;
          width: 24px !important;
          border-radius: 6px !important;
        }
        .swiper-pagination-bullet {
          transition: all 0.3s ease;
        }
        @media (max-width: 768px) {
          .swiper-btn-prev, .swiper-btn-next {
            display: none !important;
          }
          .meals-carousel-wrapper {
            padding: 0 !important;
          }
        }
      `}</style>
    </section>
  );
}
