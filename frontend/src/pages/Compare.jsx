import { motion } from 'framer-motion';
import { FaCloud, FaDroplet, FaMountain } from 'react-icons/fa6';
import { ReferenceList, Callout } from '../components/ui';
import ToolFrame from '../components/ui/ToolFrame';
import styles from './Compare.module.css';

/*
  Rounded, illustrative figures for a high-meat diet versus a vegan diet.
  Real values vary by country, food mix and the study used, so the page says so
  in a callout rather than presenting these as exact.
*/
const COMPARISONS = [
  {
    metric: 'Food carbon footprint',
    unit: 'kg CO₂e per person per year',
    vegan: 1050,
    omnivore: 2600,
    icon: <FaCloud />,
    note: 'Based on dietary emissions in a UK study of about 55,000 people (Scarborough et al., 2014).',
  },
  {
    metric: 'Water footprint of food',
    unit: 'liters per person per day',
    vegan: 2500,
    omnivore: 5000,
    icon: <FaDroplet />,
    note: 'Order-of-magnitude estimate. Animal products carry a much larger water footprint per kilogram than most plant foods.',
  },
  {
    metric: 'Farmland needed for food',
    unit: 'sq. m per person per year',
    vegan: 650,
    omnivore: 3200,
    icon: <FaMountain />,
    note: 'Poore & Nemecek (2018) estimate that a global shift to plant-based diets could cut food-related land use by about three-quarters.',
  },
];

const REFS = [
  {
    org: 'Science (Poore & Nemecek, 2018)',
    title: 'Reducing food’s environmental impacts through producers and consumers',
    link: 'https://www.science.org/doi/10.1126/science.aaq0216',
  },
  {
    org: 'Our World in Data',
    title: 'Environmental impacts of food production',
    link: 'https://ourworldindata.org/environmental-impacts-of-food',
  },
  {
    org: 'Climatic Change (Scarborough et al., 2014)',
    title: 'Dietary greenhouse gas emissions of meat-eaters, fish-eaters, vegetarians and vegans in the UK',
    link: 'https://link.springer.com/article/10.1007/s10584-014-1169-1',
  },
  {
    org: 'Water Footprint Network',
    title: 'Product water footprints (Mekonnen & Hoekstra)',
    link: 'https://www.waterfootprint.org/',
  },
];

function ComparisonCard({ data }) {
  const max = Math.max(data.vegan, data.omnivore);
  const saving = Math.round(((data.omnivore - data.vegan) / data.omnivore) * 100);

  const rows = [
    { key: 'vegan', label: 'Vegan', value: data.vegan, className: styles.barVegan },
    { key: 'omnivore', label: 'High-meat', value: data.omnivore, className: styles.barOmnivore },
  ];

  return (
    <article className={styles.comparisonCard}>
      <div className={styles.comparisonHeader}>
        <span className={styles.comparisonIcon} aria-hidden="true">{data.icon}</span>
        <h2>{data.metric}</h2>
      </div>
      <p className={styles.unit}>{data.unit}</p>

      <div className={styles.bars}>
        {rows.map((row, i) => (
          <div key={row.key} className={styles.barRow}>
            <div className={styles.barMeta}>
              <span className={styles.barLabel}>{row.label}</span>
              <span className={styles.barValue}>{row.value.toLocaleString()}</span>
            </div>
            <div
              className={styles.barTrack}
              role="img"
              aria-label={`${row.label}: ${row.value.toLocaleString()} ${data.unit}`}
            >
              <motion.div
                className={`${styles.bar} ${row.className}`}
                initial={{ width: 0 }}
                whileInView={{ width: `${(row.value / max) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 + i * 0.15 }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className={styles.saving}>
        About <strong>{saving}% lower</strong> on a vegan diet
      </p>
      <p className={styles.note}>{data.note}</p>
    </article>
  );
}

export default function Compare() {
  return (
    <ToolFrame tool="compare" seoTitle="Vegan vs High-Meat Diets: Environmental Comparison" description="Compare the carbon, water and land footprint of vegan and high-meat diets side by side, with sources." eyebrow="Side by side" title="Vegan vs high-meat diets" lead="How much carbon, water and land does a plate of food take? A plain comparison of the two ends of the spectrum, with the studies behind it.">
      <div className={styles.container}>

        <div className={styles.grid}>
          {COMPARISONS.map((comp) => (
            <ComparisonCard key={comp.metric} data={comp} />
          ))}
        </div>

        <Callout variant="note" title="How to read these numbers">
          Figures are rounded and meant to show scale, not to predict your own footprint. Results differ by
          country, how food is grown and transported, and what a “vegan” or “high-meat” diet actually contains.
          Most studies agree on the direction and rough size of the gap.
        </Callout>

        <ReferenceList panel title="Sources & further reading" refs={REFS} />
      </div>
    </ToolFrame>
  );
}
