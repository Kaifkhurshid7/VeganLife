import { Link } from 'react-router-dom';
import ContentPage from './ContentPage';
import { Callout, ReferenceList } from '../components/ui';
import { ROUTES } from '../constants/routes';
import styles from './ContentPage.module.css';

const REASONS = [
  {
    title: 'Environment',
    body: 'Food systems cause roughly a quarter of global greenhouse gas emissions, and animal products account for well over half of that. A 2018 study of nearly 40,000 farms estimated that a global shift to plant-based diets could cut food-related land use by about three-quarters.',
    link: { to: ROUTES.compare, label: 'See the comparison' },
  },
  {
    title: 'Health',
    body: 'A 2017 meta-analysis linked vegetarian diets to about 25% lower risk of heart disease and vegan diets to about 15% lower cancer risk. These are associations, and results depend on diet quality: chips and soda are vegan too.',
    link: { to: ROUTES.calculator, label: 'Try the calculator' },
  },
  {
    title: 'Animals',
    body: 'Many people go vegan because they do not want animals to be raised and killed for food. This is an ethical position rather than a scientific one, and it is the original motivation behind the movement.',
    link: { to: ROUTES.whatIsVeganism, label: 'What veganism means' },
  },
];

const REFS = [
  { org: 'Science (Poore & Nemecek, 2018)', title: 'Reducing food’s environmental impacts through producers and consumers', link: 'https://www.science.org/doi/10.1126/science.aaq0216' },
  { org: 'Our World in Data', title: 'Environmental impacts of food production', link: 'https://ourworldindata.org/environmental-impacts-of-food' },
  { org: 'Critical Reviews in Food Science and Nutrition', title: 'Vegetarian, vegan diets and multiple health outcomes (Dinu et al., 2017)', link: 'https://pubmed.ncbi.nlm.nih.gov/26853923/' },
  { org: 'FAO', title: 'Global Livestock Environmental Assessment Model', link: 'https://www.fao.org/gleam/results/en/' },
  { org: 'The Vegan Society', title: 'Definition of veganism', link: 'https://www.vegansociety.com/go-vegan/definition-veganism' },
];

export default function WhyVeganism() {
  return (
    <ContentPage
      seoTitle="Why Go Vegan? Environment, Health and Animals"
      description="The main reasons people choose veganism, with the research behind the environmental and health claims."
      path={ROUTES.whyVeganism}
      crumb="Why veganism?"
      eyebrow="Learn"
      title="Why people choose veganism"
      lead="Three reasons come up again and again. Here is what the evidence says about each, and where it is less certain."
    >
      <div className={styles.cardGrid}>
        {REASONS.map((r) => (
          <article key={r.title} className={styles.card}>
            <h2>{r.title}</h2>
            <p>{r.body}</p>
            <Link to={r.link.to} className="btn btn-outline" style={{ alignSelf: 'flex-start', marginTop: 'auto' }}>
              {r.link.label}
            </Link>
          </article>
        ))}
      </div>

      <div className={styles.stack} style={{ marginTop: 'var(--space-xl)' }}>
        <Callout variant="note" title="An honest note">
          Averages hide a lot. A badly planned vegan diet can be low in key nutrients, and a thoughtful
          low-meat diet can have a smaller footprint than a processed vegan one. Use these figures to
          understand scale, not to judge anyone’s plate.
        </Callout>
        <ReferenceList panel title="Sources & further reading" refs={REFS} />
      </div>
    </ContentPage>
  );
}
