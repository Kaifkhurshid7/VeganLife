import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { FaQuoteLeft, FaCircleCheck } from 'react-icons/fa6';
import { SectionHeader, WaveDivider } from '../../ui';
import styles from './Testimonials.module.css';

const STORIES = [
  {
    name: 'Sabrina Jenkins',
    role: 'Sophomore, Environmental Sciences',
    achievement: 'Water Footprint Reducer',
    story: 'Tracking my ecological footprint with Green Earth changed my perspective. Checking off the 7-day challenge was addictive! I saved thousands of liters of water, felt incredibly energized, and realized plant-based food is actually cheap and fun to cook in a dorm.',
    color: 'var(--color-sage)',
  },
  {
    name: 'Daniel Cho',
    role: 'Senior, Competitive Athletics',
    achievement: 'Enhanced Recovery Rate',
    story: "I swapped to a fully vegan lifestyle to accelerate muscle recovery. Thanks to the Nutrition Guide's high-protein tempeh and hemp seeds layout, I hit my macro targets easily. My joint inflammation dropped, and I set a personal best record in my half-marathon.",
    color: 'var(--color-orange)',
  },
  {
    name: 'Clara Vance',
    role: 'Graduate Student, Literature',
    achievement: 'Reduced Grocery Cost by 30%',
    story: 'College budget was my main bottleneck. Swapping beef and processed cheese for dry lentils, black beans, sweet potatoes, and peanut-hummus wraps literally cut my weekly food budget down to under $40. My body feels lighter, and my skin cleared up completely!',
    color: 'var(--color-purple)',
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className={styles.section}>
      <WaveDivider variant="default" />

      <SectionHeader
        label="Transformations"
        title="Student Stories"
        description="Hear how active university students are changing their athletic recovery, saving massive budgets, and healing the planet."
      />

      <div className={styles.swiperContainer}>
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true, el: '.testimonials-pagination' }}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          style={{ paddingBottom: '50px' }}
        >
          {STORIES.map((story) => (
            <SwiperSlide key={story.name}>
              <motion.div className={`glass-card ${styles.card}`}>
                <FaQuoteLeft className={styles.quoteIcon} style={{ color: story.color }} />
                <p className={styles.storyText}>"{story.story}"</p>
                <hr className={styles.divider} style={{ borderColor: story.color }} />
                <div className={styles.author}>
                  <h4>{story.name}</h4>
                  <p className={styles.role}>{story.role}</p>
                  <span className={styles.badge} style={{ borderColor: story.color }}>
                    <FaCircleCheck style={{ color: story.color }} /> {story.achievement}
                  </span>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className={`testimonials-pagination ${styles.pagination}`} />
      </div>
    </section>
  );
}
