import { Link } from 'react-router-dom';
import ContentPage from './ContentPage';
import { Callout, ReferenceList } from '../components/ui';
import { ROUTES } from '../constants/routes';
import styles from './ContentPage.module.css';

const STEPS = [
  { title: 'Start with what you already eat', body: 'Dal, rajma, chana, poha, idli and vegetable curries are often vegan already. Build on meals you know before looking for substitutes.' },
  { title: 'Swap gradually', body: 'Replace one meal or one ingredient a week: plant milk in tea, tofu or paneer-free curries, oil instead of ghee. A gradual shift is easier to keep.' },
  { title: 'Cover the nutrients', body: 'Take or eat fortified sources of vitamin B12. Include legumes, nuts and seeds, leafy greens, and calcium-set tofu or fortified plant milk. Pair iron-rich foods with vitamin C.' },
  { title: 'Plan a few staple meals', body: 'Pick three or four meals you enjoy and can cook quickly. The meal planner and recipes pages have budget-friendly ideas.' },
  { title: 'Read labels, not too anxiously', body: 'Look for gelatin, casein, whey and honey. Perfection is not the point; most people improve over time.' },
];

const REFS = [
  { org: 'NIH Office of Dietary Supplements', title: 'Vitamin B12 fact sheet for consumers', link: 'https://ods.od.nih.gov/factsheets/VitaminB12-Consumer/' },
  { org: 'NHS', title: 'The vegan diet', link: 'https://www.nhs.uk/live-well/eat-well/how-to-eat-a-balanced-diet/the-vegan-diet/' },
  { org: 'Academy of Nutrition and Dietetics', title: 'Position paper: vegetarian diets', link: 'https://pubmed.ncbi.nlm.nih.gov/27886704/' },
  { org: 'Harvard T.H. Chan School of Public Health', title: 'The Nutrition Source: protein', link: 'https://nutritionsource.hsph.harvard.edu/what-should-you-eat/protein/' },
];

export default function GetStarted() {
  return (
    <ContentPage
      seoTitle="How to Start a Vegan Diet: A Beginner’s Guide"
      description="A practical five-step guide to eating vegan: start with what you know, swap gradually, cover key nutrients and plan simple meals."
      path={ROUTES.getStarted}
      crumb="Get started"
      eyebrow="Beginner’s guide"
      title="How to get started"
      lead="You do not need to change everything overnight. Five steps that make the first weeks easier."
    >
      <ol className={styles.steps}>
        {STEPS.map((step) => (
          <li key={step.title}>
            <h2 style={{ fontSize: 'var(--text-h4)' }}>{step.title}</h2>
            <p>{step.body}</p>
          </li>
        ))}
      </ol>

      <div className={styles.ctaRow}>
        <Link to={ROUTES.recipes} className="btn btn-primary">Browse recipes</Link>
        <Link to={ROUTES.planner} className="btn btn-outline">Meal planner</Link>
        <Link to={ROUTES.seasonal} className="btn btn-outline">Seasonal produce</Link>
      </div>

      <div className={styles.stack} style={{ marginTop: 'var(--space-xl)' }}>
        <Callout variant="info" title="Talk to a professional if needed">
          Pregnancy, childhood, chronic conditions and heavy training all change nutritional needs. A doctor or
          registered dietitian can tailor advice to you.
        </Callout>
        <ReferenceList panel title="Sources & further reading" refs={REFS} />
      </div>
    </ContentPage>
  );
}
