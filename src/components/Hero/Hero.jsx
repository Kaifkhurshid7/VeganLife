import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaArrowDown } from 'react-icons/fa6';

export default function Hero() {
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Parallax scroll hooks
  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 500], [0, 160]);
  const bgY = useTransform(scrollY, [0, 500], [0, 80]);
  const leafY = useTransform(scrollY, [0, 500], [0, -100]);

  // Mouse move handler for organic parallax depth
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const x = (clientX - window.innerWidth / 2) / 35;
      const y = (clientY - window.innerHeight / 2) / 35;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      ref={containerRef}
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: '750px',
        width: '100%',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom, #ece0d2 0%, #e1c6ab 40%, #9d82ab 70%, #a6b48f 100%)',
        overflow: 'hidden'
      }}
      id="hero"
    >
      {/* Cinematic Soft Blur Ambient Gradients */}
      <motion.div
        style={{
          position: 'absolute',
          top: '15%',
          right: '10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(227,163,110,0.3) 0%, transparent 70%)',
          filter: 'blur(60px)',
          y: bgY
        }}
      />
      <motion.div
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '5%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(166,180,143,0.35) 0%, transparent 70%)',
          filter: 'blur(50px)',
          y: bgY
        }}
      />

      {/* Floating Organic Leaf 1 (Left) */}
      <motion.svg
        viewBox="0 0 100 100"
        style={{
          position: 'absolute',
          left: '8%',
          top: '25%',
          width: '100px',
          height: '100px',
          fill: '#a6b48f',
          opacity: 0.6,
          y: leafY,
          x: mousePosition.x * -0.5
        }}
        className="animate-float"
      >
        <path d="M50,0 C65,30 90,40 100,60 C90,80 75,90 50,100 C25,90 10,80 0,60 C10,40 35,30 50,0 Z" />
      </motion.svg>

      {/* Floating Organic Leaf 2 (Right) */}
      <motion.svg
        viewBox="0 0 100 100"
        style={{
          position: 'absolute',
          right: '10%',
          bottom: '28%',
          width: '80px',
          height: '80px',
          fill: '#e3a36e',
          opacity: 0.5,
          y: leafY,
          x: mousePosition.x * 0.4
        }}
        className="animate-float-slow"
      >
        <path d="M50,0 C65,35 90,45 100,65 C90,85 75,95 50,100 C25,95 10,85 0,65 C10,45 35,35 50,0 Z" />
      </motion.svg>

      {/* Floating Butterfly Element */}
      <motion.div
        style={{
          position: 'absolute',
          right: '25%',
          top: '30%',
          width: '45px',
          height: '45px',
          zIndex: 4,
          x: mousePosition.x * 0.8,
          y: mousePosition.y * 0.8
        }}
        className="animate-butterfly"
      >
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M32 30C28 20 12 16 8 28C6 34 16 42 32 50C48 42 58 34 56 28C52 16 36 20 32 30Z" fill="#9d82ab" opacity="0.65" />
          <path d="M32 30C30 24 20 22 18 28C17 31 22 35 32 40C42 35 47 31 46 28C44 22 34 24 32 30Z" fill="#e3a36e" opacity="0.5" />
        </svg>
      </motion.div>

      {/* Main Center Content */}
      <motion.div
        style={{
          textAlign: 'center',
          maxWidth: '850px',
          padding: '0 24px',
          zIndex: 5,
          y: textY,
          x: mousePosition.x * 0.3,
          y: mousePosition.y * 0.3
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <motion.span
          style={{
            display: 'inline-block',
            fontSize: '1.1rem',
            letterSpacing: '5px',
            textTransform: 'uppercase',
            color: 'var(--color-earth)',
            fontWeight: 700,
            marginBottom: '16px',
            opacity: 0.8
          }}
        >
          A Return To Earth
        </motion.span>

        <h1
          style={{
            fontSize: 'clamp(3.8rem, 8.5vw, 7.5rem)',
            color: 'var(--color-cream)',
            lineHeight: 1.05,
            textShadow: '0 4px 16px rgba(87,61,33,0.15)',
            marginBottom: '24px'
          }}
        >
          It’s Natural
        </h1>

        <p
          style={{
            fontSize: 'clamp(1.15rem, 2.5vw, 1.45rem)',
            color: 'var(--color-cream)',
            maxWidth: '680px',
            margin: '0 auto 40px auto',
            opacity: 0.95,
            textShadow: '0 2px 8px rgba(87,61,33,0.1)'
          }}
        >
          Promoting sustainable living and conscious food choices for a healthier, more balanced planet.
        </p>

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <a href="#why-vegan" className="btn btn-primary">
            Explore
          </a>
          <a href="#impact" className="btn btn-secondary" style={{ borderColor: 'var(--color-cream)', color: 'var(--color-cream)' }}>
            Learn More
          </a>
        </div>
      </motion.div>

      {/* Layers of Mountain/Ocean Smooth Organic Curves (Parallax layered dividers) */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          lineHeight: 0,
          zIndex: 6
        }}
      >
        {/* Mountain layer 1 (Background clay curve) */}
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{
            position: 'absolute',
            bottom: '25px',
            width: '100%',
            height: '70px',
            fill: 'rgba(225, 198, 171, 0.4)',
            transform: 'scaleY(0.7)'
          }}
        >
          <path d="M0,0 C150,90 350,10 600,70 C850,130 1050,40 1200,10 L1200,120 L0,120 Z" />
        </svg>

        {/* Mountain layer 2 (Foreground main background-matched cream curve) */}
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{
            position: 'relative',
            width: '100%',
            height: '90px',
            fill: 'var(--bg-color)',
            display: 'block'
          }}
        >
          <path d="M0,40 C200,110 450,10 700,80 C950,150 1100,50 1200,30 L1200,120 L0,120 Z" />
        </svg>
      </div>

      {/* Scroll Down Indicator */}
      <motion.a
        href="#why-vegan"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          bottom: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          textDecoration: 'none',
          color: 'var(--color-earth)',
          fontSize: '0.85rem',
          fontWeight: 700,
          letterSpacing: '2px',
          textTransform: 'uppercase'
        }}
      >
        <span>Scroll</span>
        <FaArrowDown style={{ fontSize: '1rem', color: 'var(--color-earth)' }} />
      </motion.a>
    </section>
  );
}
