import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaDroplet, FaTree, FaCloud, FaSeedling, FaHeart, FaEarthAmericas } from 'react-icons/fa6';
import BackButton from '../components/ui/BackButton';
import styles from './Infographic.module.css';

const STORY_SECTIONS = [
  {
    icon: <FaEarthAmericas />,
    stat: '14.5%',
    title: 'Global Emissions from Livestock',
    desc: 'Animal agriculture produces more greenhouse gases than all transportation combined — cars, planes, ships, and trains.',
    color: 'var(--color-orange)',
  },
  {
    icon: <FaDroplet />,
    stat: '15,400L',
    title: 'Water for 1kg of Beef',
    desc: 'Producing a single kilogram of beef requires 15,400 liters of water. The same water could grow 50kg of vegetables.',
    color: 'var(--color-sage)',
  },
  {
    icon: <FaTree />,
    stat: '80%',
    title: 'Amazon Deforestation',
    desc: '80% of Amazon rainforest destruction is driven by cattle ranching. Every minute, an area the size of a football field is cleared.',
    color: 'var(--color-earth)',
  },
  {
    icon: <FaCloud />,
    stat: '73%',
    title: 'Carbon Footprint Reduction',
    desc: 'Switching to a plant-based diet reduces your food carbon footprint by up to 73% — the single biggest action an individual can take.',
    color: 'var(--color-purple)',
  },
  {
    icon: <FaSeedling />,
    stat: '76%',
    title: 'Less Land Required',
    desc: 'If the world went vegan, we could reduce farmland use by 76% — an area the size of the US, China, EU, and Australia combined.',
    color: 'var(--color-sage)',
  },
  {
    icon: <FaHeart />,
    stat: '32%',
    title: 'Lower Heart Disease Risk',
    desc: 'Plant-based diets reduce the risk of heart disease by 32%, type 2 diabetes by 23%, and certain cancers by up to 15%.',
    color: 'var(--color-orange)',
  },
];

function StoryBlock({ section, index }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);

  return (
    <motion.div ref={ref} className={styles.storyBlock} style={{ opacity, y, scale }}>
      <div className={styles.storyIcon} style={{ color: section.color }}>
        {section.icon}
      </div>
      <div className={styles.storyContent}>
        <span className={styles.storyStat} style={{ color: section.color }}>
          {section.stat}
        </span>
        <h2 className={styles.storyTitle}>{section.title}</h2>
        <p className={styles.storyDesc}>{section.desc}</p>
      </div>
      <div className={styles.storyIndex}>{String(index + 1).padStart(2, '0')}</div>
    </motion.div>
  );
}

export default function Infographic() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section className={styles.section} ref={containerRef}>
      <BackButton />
      {/* Scroll progress bar */}
      <motion.div className={styles.progressBar} style={{ width: progressWidth }} />

      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <span className={styles.label}>Scroll to Discover</span>
          <h1 className={styles.mainTitle}>The Story of Our Food</h1>
          <p className={styles.mainSubtitle}>
            A scroll-driven journey through the environmental impact of what we eat — and how one choice can change everything.
          </p>
        </motion.div>

        <div className={styles.timeline}>
          <div className={styles.timelineLine} />
          {STORY_SECTIONS.map((section, idx) => (
            <StoryBlock key={section.title} section={section} index={idx} />
          ))}
        </div>

        <motion.div
          className={styles.conclusion}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h2>Every Meal Is a Vote</h2>
          <p>Choose plants. Choose the planet. Choose compassion.</p>
          <a href="/" className="btn btn-primary">Back to Home</a>
        </motion.div>
      </div>
    </section>
  );
}
