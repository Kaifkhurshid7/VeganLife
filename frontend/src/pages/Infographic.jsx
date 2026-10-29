import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaDroplet, FaTree, FaCloud, FaSeedling, FaHeart, FaEarthAmericas } from 'react-icons/fa6';
import BackButton from '../components/ui/BackButton';
import { PageHeader, ReferenceList, Callout } from '../components/ui';
import { Seo } from '../components/seo';
import { ROUTES } from '../constants/routes';
import styles from './Infographic.module.css';

const STORY_SECTIONS = [
  {
    icon: <FaEarthAmericas />,
    stat: '14.5%',
    title: 'Global emissions from livestock',
    desc: 'The FAO estimates that livestock supply chains cause about 14.5% of human-made greenhouse gas emissions, a share comparable to the exhaust emissions of every car, truck, ship and plane combined.',
    color: 'var(--color-orange)',
    source: { org: 'FAO', link: 'https://www.fao.org/gleam/results/en/' },
  },
  {
    icon: <FaDroplet />,
    stat: '15,400 L',
    title: 'Water for 1 kg of beef',
    desc: 'The global average water footprint of beef is roughly 15,400 liters per kilogram. Vegetables average about 320 liters per kilogram, nearly fifty times less.',
    color: 'var(--color-sage)',
    source: { org: 'Mekonnen & Hoekstra', link: 'https://www.waterfootprint.org/' },
  },
  {
    icon: <FaTree />,
    stat: '~75%',
    title: 'Cleared Amazon land used for pasture',
    desc: 'Cattle pasture is the largest single use of land cleared in the Brazilian Amazon. Estimates put it at roughly three-quarters of deforested area, far ahead of crops.',
    color: 'var(--color-earth)',
    source: { org: 'Our World in Data', link: 'https://ourworldindata.org/drivers-of-deforestation' },
  },
  {
    icon: <FaCloud />,
    stat: 'Up to 73%',
    title: 'Lower food carbon footprint',
    desc: 'In a study of nearly 40,000 farms, researchers found that an individual who swaps animal products for plant-based foods could cut their food-related emissions by as much as 73%, depending on what they eat now.',
    color: 'var(--color-purple)',
    source: { org: 'Science, 2018', link: 'https://www.science.org/doi/10.1126/science.aaq0216' },
  },
  {
    icon: <FaSeedling />,
    stat: '76%',
    title: 'Less farmland required',
    desc: 'The same study estimated that a global shift to plant-based diets could reduce food-related land use by about 76%, an area comparable to the US, China, the EU and Australia combined.',
    color: 'var(--color-sage)',
    source: { org: 'Science, 2018', link: 'https://www.science.org/doi/10.1126/science.aaq0216' },
  },
  {
    icon: <FaHeart />,
    stat: '25%',
    title: 'Lower heart disease risk in vegetarians',
    desc: 'A 2017 meta-analysis linked vegetarian diets to about 25% lower risk of heart disease, and vegan diets to about 15% lower risk of cancer. These are associations, not guarantees, and results depend on diet quality.',
    color: 'var(--color-orange)',
    source: { org: 'Dinu et al., 2017', link: 'https://pubmed.ncbi.nlm.nih.gov/26853923/' },
  },
];

const REFS = [
  { org: 'FAO', title: 'Global Livestock Environmental Assessment Model (GLEAM) results', link: 'https://www.fao.org/gleam/results/en/' },
  { org: 'Science (Poore & Nemecek, 2018)', title: 'Reducing food’s environmental impacts through producers and consumers', link: 'https://www.science.org/doi/10.1126/science.aaq0216' },
  { org: 'Water Footprint Network', title: 'The water footprint of farm animals and animal products', link: 'https://www.waterfootprint.org/' },
  { org: 'Our World in Data', title: 'Drivers of deforestation', link: 'https://ourworldindata.org/drivers-of-deforestation' },
  { org: 'Critical Reviews in Food Science and Nutrition', title: 'Vegetarian, vegan diets and multiple health outcomes: a systematic review with meta-analysis (Dinu et al., 2017)', link: 'https://pubmed.ncbi.nlm.nih.gov/26853923/' },
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
      <div
        className={`${styles.storyIcon} animate-bob`}
        style={{ color: section.color, animationDelay: `${index * -1.3}s` }}
      >
        {section.icon}
      </div>
      <div className={styles.storyContent}>
        <span className={styles.storyStat} style={{ color: section.color }}>
          {section.stat}
        </span>
        <h2 className={styles.storyTitle}>{section.title}</h2>
        <p className={styles.storyDesc}>{section.desc}</p>
        <ReferenceList compact refs={[section.source]} />
      </div>
      <div className={styles.storyIndex}>{String(index + 1).padStart(2, '0')}</div>
    </motion.div>
  );
}

export default function Infographic() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const lineScale = useTransform(scrollYProgress, [0.05, 0.95], [0, 1]);

  return (
    <section className={styles.section} ref={containerRef}>
      <Seo
        title="The Story of Our Food: Climate, Water, Land and Health"
        description="A scroll-driven infographic on how food choices affect emissions, water, deforestation and health, with a source for every statistic."
        path={ROUTES.infographic}
      />
      <BackButton />
      {/* Scroll progress bar */}
      <motion.div className={styles.progressBar} style={{ width: progressWidth }} />

      <div className={styles.container}>
        <PageHeader
          align="center"
          eyebrow="Scroll to discover"
          title="The story of our food"
          lead="A scroll-driven look at what the research says about how food choices affect climate, water, land and health."
          trail={[
            { name: 'Home', path: ROUTES.home },
            { name: 'Story of our food', path: ROUTES.infographic },
          ]}
        />

        <div className={styles.timeline}>
          <motion.div className={styles.timelineLine} style={{ scaleY: lineScale, originY: 0 }} />
          {STORY_SECTIONS.map((section, idx) => (
            <StoryBlock key={section.title} section={section} index={idx} />
          ))}
        </div>

        <Callout variant="note" title="About these figures">
          Statistics are global averages from peer-reviewed studies and UN agencies. Local numbers differ, and
          health findings describe population-level associations. For personal dietary advice, speak with a
          qualified health professional.
        </Callout>

        <ReferenceList panel title="Sources & further reading" refs={REFS} />

        <motion.div
          className={styles.conclusion}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h2>Small choices add up</h2>
          <p>Every plant-based meal is a step toward a lighter footprint.</p>
          <Link to={ROUTES.home} className="btn btn-primary">Back to home</Link>
        </motion.div>
      </div>
    </section>
  );
}
