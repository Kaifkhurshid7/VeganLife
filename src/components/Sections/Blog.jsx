import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';
import { blogs } from '../../data/blogs';

export default function Blog() {
  return (
    <section id="blogs" style={{ backgroundColor: 'var(--bg-color)' }}>
      {/* Wave top divider */}
      <div className="organic-divider divider-top">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V120C68.18,97.74,144.66,90.13,214.71,71.65,251,62.06,286.31,63,321.39,56.44Z" className="shape-fill"></path>
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
          Daily Insights
        </motion.span>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Awareness & Stories
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 0.8, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Stay informed on cutting-edge research, student budget lifestyle blue-prints, and physical wellness.
        </motion.p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        {blogs.map((post, idx) => (
          <motion.article
            key={post.id}
            className="glass-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: idx * 0.15 }}
            style={{
              padding: 0,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '480px'
            }}
          >
            {/* Image banner with scale hover */}
            <div 
              style={{ 
                height: '180px', 
                width: '100%', 
                overflow: 'hidden', 
                position: 'relative' 
              }}
              className="blog-img-box"
            >
              <span
                style={{
                  position: 'absolute',
                  top: '15px',
                  left: '15px',
                  backgroundColor: 'var(--color-cream)',
                  color: 'var(--color-earth)',
                  padding: '3px 12px',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  zIndex: 2,
                  border: '1px solid var(--glass-border)'
                }}
              >
                {post.category}
              </span>
              
              <img
                src={post.image}
                alt={post.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                className="blog-card-img"
              />
            </div>

            {/* Post details */}
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
                    justifyContent: 'space-between',
                    fontSize: '0.8rem',
                    color: 'var(--color-text-light)',
                    opacity: 0.75,
                    fontWeight: 700,
                    marginBottom: '10px'
                  }}
                >
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>

                <h3
                  style={{
                    fontSize: '1.25rem',
                    color: 'var(--color-earth)',
                    lineHeight: 1.4,
                    marginBottom: '10px',
                    fontFamily: 'var(--font-headings)'
                  }}
                >
                  {post.title}
                </h3>

                <p
                  style={{
                    fontSize: '0.88rem',
                    color: 'var(--color-text-light)',
                    opacity: 0.9,
                    lineHeight: 1.6,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {post.desc}
                </p>
              </div>

              {/* Read button link simulation */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: 'var(--color-earth)',
                  marginTop: '15px',
                  transition: 'color 0.3s ease'
                }}
                className="blog-link"
              >
                <span>Read Full Article</span>
                <FiArrowUpRight />
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <style>{`
        .blog-img-box:hover .blog-card-img {
          transform: scale(1.06);
        }
        .glass-card:hover .blog-link {
          color: var(--color-orange) !important;
        }
      `}</style>
    </section>
  );
}
