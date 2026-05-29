import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { FaQuoteLeft, FaCircleCheck } from 'react-icons/fa6';

export default function Testimonials() {
  const stories = [
    {
      name: "Sabrina Jenkins",
      role: "Sophomore, Environmental Sciences",
      achievement: "Water Footprint Reducer",
      story: "Tracking my ecological footprint with Green Earth changed my perspective. Checking off the 7-day challenge was addictive! I saved thousands of liters of water, felt incredibly energized, and realized plant-based food is actually cheap and fun to cook in a dorm.",
      color: "var(--color-sage)"
    },
    {
      name: "Daniel Cho",
      role: "Senior, Competitive Athletics",
      achievement: "Enhanced Recovery Rate",
      story: "I swapped to a fully vegan lifestyle to accelerate muscle recovery. Thanks to the Nutrition Guide's high-protein tempeh and hemp seeds layout, I hit my macro targets easily. My joint inflammation dropped, and I set a personal best record in my half-marathon.",
      color: "var(--color-orange)"
    },
    {
      name: "Clara Vance",
      role: "Graduate Student, Literature",
      achievement: "Reduced Grocery Cost by 30%",
      story: "College budget was my main bottleneck. swaping beef and processed cheese for dry lentils, black beans, sweet potatoes, and peanut-hummus wraps literally cut my weekly food budget down to under $40. My body feels lighter, and my skin cleared up completely!",
      color: "var(--color-purple)"
    }
  ];

  return (
    <section id="testimonials" style={{ background: 'linear-gradient(to bottom, var(--bg-color) 0%, var(--color-clay) 100%)' }}>
      {/* Wave top divider */}
      <div className="organic-divider divider-top">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="shape-fill"></path>
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
          Transformations
        </motion.span>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Student Stories
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 0.8, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Hear how active university students are changing their athletic recovery, saving massive budgets, and healing the planet.
        </motion.p>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true, el: '.swiper-testimonials-pagination' }}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          style={{ paddingBottom: '50px' }}
        >
          {stories.map((story) => (
            <SwiperSlide key={story.name}>
              <motion.div
                className="glass-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                  padding: '50px',
                  textAlign: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255,255,255,0.45)'
                }}
              >
                <div style={{ fontSize: '3rem', color: story.color, opacity: 0.25 }}>
                  <FaQuoteLeft />
                </div>

                <p
                  style={{
                    fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)',
                    color: 'var(--color-text-dark)',
                    fontFamily: 'var(--font-headings)',
                    lineHeight: 1.6,
                    fontStyle: 'italic',
                    maxWidth: '750px'
                  }}
                >
                  "{story.story}"
                </p>

                <hr style={{ width: '80px', border: 'none', borderTop: `2px solid ${story.color}` }} />

                <div>
                  <h4 style={{ fontSize: '1.25rem', color: 'var(--color-earth)', fontWeight: 700, margin: 0 }}>
                    {story.name}
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-light)', opacity: 0.8, margin: '2px 0 8px 0' }}>
                    {story.role}
                  </p>
                  
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: 'var(--color-cream)',
                      color: 'var(--color-earth)',
                      padding: '4px 14px',
                      borderRadius: '30px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      border: `1px solid ${story.color}`
                    }}
                  >
                    <FaCircleCheck style={{ color: story.color }} /> {story.achievement}
                  </span>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Testimonials pagination custom bullets */}
        <div
          className="swiper-testimonials-pagination"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '15px'
          }}
        />
      </div>

      <style>{`
        .swiper-testimonials-pagination .swiper-pagination-bullet-active {
          background: var(--color-earth) !important;
          width: 24px !important;
          border-radius: 6px !important;
        }
      `}</style>
    </section>
  );
}
