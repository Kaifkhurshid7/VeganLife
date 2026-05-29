import React from 'react';
import { FaLeaf, FaInstagram, FaTwitter, FaYoutube, FaPinterest } from 'react-icons/fa6';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: 'linear-gradient(to bottom, var(--color-clay) 0%, var(--color-earth) 100%)',
        color: 'var(--color-cream)',
        padding: '100px 8% 40px 8%',
        position: 'relative',
        zIndex: 2,
        overflow: 'hidden'
      }}
    >
      {/* Wave divider to transition organically into deep earth footer */}
      <div className="organic-divider divider-top" style={{ zIndex: 3 }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79-22.2,103.59-32.17,158-29.45,70.36,3.53,136.46,28.81,200.63,55.22,84,34.56,168.17,65,257.5,60.67,84.18-4.12,163.53-29.62,236.42-66C932.32,27.18,1022.61,1.52,1108.62,11.23c29,3.27,57,11.43,84.4,24.12V0Z" style={{ fill: 'var(--color-clay)' }}></path>
        </svg>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '50px',
          maxWidth: '1200px',
          margin: '0 auto 60px auto',
          position: 'relative',
          zIndex: 4
        }}
      >
        {/* Brand block */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaLeaf style={{ color: 'var(--color-sage)', fontSize: '2rem' }} />
            <h2 style={{ fontSize: '2.4rem', fontFamily: 'var(--font-headings)', color: 'var(--color-cream)' }}>
              Green Earth
            </h2>
          </div>
          
          <p style={{ color: 'var(--color-cream)', opacity: 0.8, fontSize: '0.98rem', maxWidth: '340px' }}>
            A cinematic, non-profit student awareness movement dedicated to sustainable living, conscious nutrition, and restoring planetary health.
          </p>

          {/* Social connections */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
            {[
              { icon: <FaInstagram />, href: '#instagram' },
              { icon: <FaTwitter />, href: '#twitter' },
              { icon: <FaYoutube />, href: '#youtube' },
              { icon: <FaPinterest />, href: '#pinterest' }
            ].map((soc, idx) => (
              <a
                key={idx}
                href={soc.href}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(247, 240, 230, 0.1)',
                  border: '1px solid rgba(247, 240, 230, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-cream)',
                  fontSize: '1.2rem',
                  textDecoration: 'none',
                  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-sage)';
                  e.currentTarget.style.color = 'var(--color-earth)';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(247, 240, 230, 0.1)';
                  e.currentTarget.style.color = 'var(--color-cream)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {soc.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Links Navigation Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--color-cream)', letterSpacing: '1px' }}>
            Navigation
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { name: 'Home', href: '#' },
              { name: 'Why Vegan', href: '#why-vegan' },
              { name: 'Impact Tracker', href: '#impact' },
              { name: 'Nutrition Guide', href: '#nutrition' },
              { name: 'Recipes Carousel', href: '#recipes' },
              { name: 'Myths Busted', href: '#myths' },
              { name: 'Challenges', href: '#challenge' },
              { name: 'Blogs & Articles', href: '#blogs' }
            ].map((link) => (
              <a
                key={link.name}
                href={link.href}
                style={{
                  color: 'var(--color-cream)',
                  opacity: 0.8,
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.opacity = 1;
                  e.target.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = 0.8;
                  e.target.style.transform = 'translateX(0)';
                }}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>

        {/* Eco Inspiration Quote Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--color-cream)', letterSpacing: '1px' }}>
            Green Promise
          </h3>
          
          <blockquote
            style={{
              borderLeft: '3px solid var(--color-sage)',
              paddingLeft: '16px',
              fontStyle: 'italic',
              fontSize: '1rem',
              lineHeight: 1.6,
              color: 'var(--color-cream)',
              opacity: 0.85
            }}
          >
            "The greatest threat to our planet is the belief that someone else will save it."
            <cite style={{ display: 'block', fontSize: '0.8rem', marginTop: '8px', fontStyle: 'normal', fontWeight: 700, color: 'var(--color-sage)' }}>
              — Robert Swan OBE
            </cite>
          </blockquote>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid rgba(247, 240, 230, 0.1)', margin: '40px auto 30px auto', maxWidth: '1200px' }} />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px',
          maxWidth: '1200px',
          margin: '0 auto',
          fontSize: '0.88rem',
          opacity: 0.7,
          color: 'var(--color-cream)'
        }}
      >
        <span>&copy; {currentYear} Green Earth Awareness. Built for the future.</span>
        <div style={{ display: 'flex', gap: '20px' }}>
          <a href="#privacy" style={{ color: 'var(--color-cream)', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="#terms" style={{ color: 'var(--color-cream)', textDecoration: 'none' }}>Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
