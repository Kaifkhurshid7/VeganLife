import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiExternalLink, FiX } from 'react-icons/fi';
import LearnLayout, { BlockHead } from './LearnLayout';
import { Callout } from '../components/ui';
import { ROUTES } from '../constants/routes';
import { IMG } from '../constants/images';
import styles from './Learn.module.css';
import src from './Sources.module.css';

const GROUPS = [
  {
    title: 'Environment',
    color: '#7f9a5f',
    refs: [
      { org: 'Science (Poore & Nemecek, 2018)', title: 'Reducing food’s environmental impacts through producers and consumers', link: 'https://www.science.org/doi/10.1126/science.aaq0216' },
      { org: 'Our World in Data', title: 'Environmental impacts of food production', link: 'https://ourworldindata.org/environmental-impacts-of-food' },
      { org: 'Our World in Data', title: 'Drivers of deforestation', link: 'https://ourworldindata.org/drivers-of-deforestation' },
      { org: 'FAO', title: 'Global Livestock Environmental Assessment Model', link: 'https://www.fao.org/gleam/results/en/' },
      { org: 'Water Footprint Network', title: 'Product water footprints', link: 'https://www.waterfootprint.org/' },
      { org: 'Climatic Change (Scarborough et al., 2014)', title: 'Dietary greenhouse gas emissions of meat-eaters, fish-eaters, vegetarians and vegans in the UK', link: 'https://link.springer.com/article/10.1007/s10584-014-1169-1' },
      { org: 'PNAS (Bar-On et al., 2018)', title: 'The biomass distribution on Earth', link: 'https://www.pnas.org/doi/10.1073/pnas.1711842115' },
    ],
  },
  {
    title: 'Nutrition and health',
    color: '#e3a36e',
    refs: [
      { org: 'Academy of Nutrition and Dietetics', title: 'Position paper: vegetarian diets', link: 'https://pubmed.ncbi.nlm.nih.gov/27886704/' },
      { org: 'Critical Reviews in Food Science and Nutrition', title: 'Vegetarian, vegan diets and multiple health outcomes (Dinu et al., 2017)', link: 'https://pubmed.ncbi.nlm.nih.gov/26853923/' },
      { org: 'NIH Office of Dietary Supplements', title: 'Vitamin B12 fact sheet for consumers', link: 'https://ods.od.nih.gov/factsheets/VitaminB12-Consumer/' },
      { org: 'Harvard T.H. Chan School of Public Health', title: 'The Nutrition Source', link: 'https://nutritionsource.hsph.harvard.edu/' },
      { org: 'NHS', title: 'The vegan diet', link: 'https://www.nhs.uk/live-well/eat-well/how-to-eat-a-balanced-diet/the-vegan-diet/' },
      { org: 'World Health Organization', title: 'Obesity and overweight', link: 'https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight' },
      { org: 'ICMR–NIN India', title: 'Dietary Guidelines for Indians', link: 'https://www.nin.res.in/' },
    ],
  },
  {
    title: 'Definition and background',
    color: '#9d82ab',
    refs: [
      { org: 'The Vegan Society', title: 'Definition of veganism', link: 'https://www.vegansociety.com/go-vegan/definition-veganism' },
      { org: 'Our World in Data', title: 'How many animals are slaughtered each year?', link: 'https://ourworldindata.org/animal-slaughtered' },
    ],
  },
];

const ALL = GROUPS.flatMap((g) => g.refs.map((r) => ({ ...r, group: g.title, color: g.color })));

export default function Sources() {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('All');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL.filter(
      (r) =>
        (group === 'All' || r.group === group) &&
        (!q || `${r.org} ${r.title}`.toLowerCase().includes(q))
    );
  }, [query, group]);

  const facts = [
    { label: 'References', value: `${ALL.length} and counting` },
    { label: 'Topics', value: `${GROUPS.length} groups` },
    { label: 'Prefer', value: 'Peer-reviewed and agencies' },
    { label: 'Spot a dead link?', value: 'Tell us' },
  ];

  return (
    <LearnLayout
      seoTitle="Sources and References"
      description="Every study, agency and organisation Vegan Life draws on for its environmental, nutrition and health content."
      path={ROUTES.sources}
      crumb="Sources"
      eyebrow="Organisation"
      title="Sources and references"
      lead={
        <>
          Where our numbers come from, grouped by topic. We prefer peer-reviewed research and international
          agencies, and <mark>every link opens in a new tab</mark> so you can check for yourself.
        </>
      }
      images={{
        main: { src: IMG.bVeganMyths, alt: 'Fresh greens' },
        small: { src: IMG.iSesame, alt: 'A colourful salad' },
      }}
      chip={{ big: ALL.length, text: 'Linked references' }}
      ring="CHECK • VERIFY • QUESTION • "
      facts={facts}
    >
      <section className={styles.block}>
        <BlockHead kicker="Find a source" title="Search the library" />

        <div className={src.tools}>
          <div className={src.search}>
            <label htmlFor="sources-search" className="sr-only">Search sources</label>
            <FiSearch aria-hidden="true" />
            <input
              id="sources-search"
              type="search"
              placeholder="Search by organisation or title…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} aria-label="Clear search">
                <FiX aria-hidden="true" />
              </button>
            )}
          </div>

          <div className={src.chips} role="group" aria-label="Filter by topic">
            {['All', ...GROUPS.map((g) => g.title)].map((g) => (
              <button
                key={g}
                type="button"
                aria-pressed={group === g}
                className={`${src.chip} ${group === g ? src.chipOn : ''}`}
                onClick={() => setGroup(g)}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <p className={src.count} role="status" aria-live="polite">
          Showing <strong>{results.length}</strong> of {ALL.length} references
        </p>

        {results.length === 0 ? (
          <p className={src.empty}>No sources match that search. Try a shorter word.</p>
        ) : (
          <ul className={src.grid}>
            {results.map((r, i) => (
              <motion.li
                key={r.link + r.title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(i, 8) * 0.03 }}
              >
                <a
                  href={r.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={src.card}
                  style={{ '--accent': r.color }}
                >
                  <span className={src.tag}>{r.group}</span>
                  <span className={src.org}>{r.org}</span>
                  <span className={src.title}>{r.title}</span>
                  <span className={src.go}>
                    Open source <FiExternalLink aria-hidden="true" />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </span>
                </a>
              </motion.li>
            ))}
          </ul>
        )}
      </section>

      <Callout variant="note" title="How we use sources">
        Figures are often rounded, and global averages hide large differences between countries and diets. If a
        link has moved or a figure looks off, please tell us on the contact page.
      </Callout>
    </LearnLayout>
  );
}
