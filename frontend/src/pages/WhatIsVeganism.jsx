import { Link } from 'react-router-dom';
import ContentPage from './ContentPage';
import { Callout, ReferenceList } from '../components/ui';
import { ROUTES } from '../constants/routes';
import styles from './ContentPage.module.css';

const REFS = [
  { org: 'The Vegan Society', title: 'Definition of veganism', link: 'https://www.vegansociety.com/go-vegan/definition-veganism' },
  { org: 'Academy of Nutrition and Dietetics', title: 'Position paper: vegetarian diets', link: 'https://pubmed.ncbi.nlm.nih.gov/27886704/' },
  { org: 'NHS', title: 'The vegan diet', link: 'https://www.nhs.uk/live-well/eat-well/how-to-eat-a-balanced-diet/the-vegan-diet/' },
  { org: 'Harvard T.H. Chan School of Public Health', title: 'The Nutrition Source: vegetarian diet', link: 'https://nutritionsource.hsph.harvard.edu/healthy-weight/diet-reviews/vegetarian-diet/' },
];

export default function WhatIsVeganism() {
  return (
    <ContentPage
      seoTitle="What Is Veganism? A Plain-English Guide"
      description="What veganism means, how it differs from vegetarianism, what vegans eat and avoid, and where to read more."
      path={ROUTES.whatIsVeganism}
      crumb="What is veganism?"
      eyebrow="Learn"
      title="What is veganism?"
      lead="Veganism is a way of living that seeks to avoid, as far as is practicable, the use of animals for food, clothing and other purposes."
    >
      <div className={styles.prose}>
        <h2>The definition</h2>
        <p>
          The Vegan Society, which coined the term in 1944, describes veganism as a philosophy and way of
          living that seeks to exclude, as far as is possible and practicable, all forms of exploitation of
          and cruelty to animals. People come to it for different reasons: animal welfare, the environment,
          health, or a mix of all three.
        </p>

        <h2>What vegans eat</h2>
        <p>
          A vegan diet is built on vegetables, fruit, legumes (beans, lentils, chickpeas), whole grains,
          nuts, seeds and foods made from them, such as tofu, tempeh and plant milks. Vegans do not eat meat,
          fish, dairy, eggs or honey. Many also check for less obvious animal ingredients, such as gelatin,
          casein or certain food colourings.
        </p>

        <h2>Vegan versus vegetarian</h2>
        <p>
          Vegetarians exclude meat and fish but often still eat dairy and eggs. Vegans exclude all animal
          products. Veganism also commonly extends beyond food to leather, wool, silk and products tested
          on animals, where alternatives exist.
        </p>

        <h2>Is it healthy?</h2>
        <p>
          Dietetic associations, including the Academy of Nutrition and Dietetics, state that well-planned
          vegan diets can be nutritionally adequate at all stages of life. “Well-planned” matters. Vitamin
          B12 is not reliably available from plant foods and is usually supplemented or taken from fortified
          foods. Depending on your circumstances you may also need to pay attention to vitamin D, iodine,
          iron, calcium, zinc and omega-3 fats.
        </p>
      </div>

      <div className={styles.ctaRow}>
        <Link to={ROUTES.whyVeganism} className="btn btn-primary">Why people choose it</Link>
        <Link to={ROUTES.getStarted} className="btn btn-outline">How to get started</Link>
      </div>

      <div className={styles.stack} style={{ marginTop: 'var(--space-xl)' }}>
        <Callout variant="note" title="General information">
          This page is educational and is not personal medical or dietary advice. If you have a health
          condition, are pregnant, or are planning for children, speak with a doctor or registered dietitian.
        </Callout>
        <ReferenceList panel title="Sources & further reading" refs={REFS} />
      </div>
    </ContentPage>
  );
}
