import ContentPage from './ContentPage';
import { ReferenceList, Callout } from '../components/ui';
import { ROUTES } from '../constants/routes';

const GROUPS = [
  {
    title: 'Environment',
    refs: [
      { org: 'Science (Poore & Nemecek, 2018)', title: 'Reducing food’s environmental impacts through producers and consumers', link: 'https://www.science.org/doi/10.1126/science.aaq0216' },
      { org: 'Our World in Data', title: 'Environmental impacts of food production', link: 'https://ourworldindata.org/environmental-impacts-of-food' },
      { org: 'Our World in Data', title: 'Drivers of deforestation', link: 'https://ourworldindata.org/drivers-of-deforestation' },
      { org: 'FAO', title: 'Global Livestock Environmental Assessment Model', link: 'https://www.fao.org/gleam/results/en/' },
      { org: 'Water Footprint Network', title: 'Product water footprints', link: 'https://www.waterfootprint.org/' },
      { org: 'Climatic Change (Scarborough et al., 2014)', title: 'Dietary greenhouse gas emissions of meat-eaters, fish-eaters, vegetarians and vegans in the UK', link: 'https://link.springer.com/article/10.1007/s10584-014-1169-1' },
    ],
  },
  {
    title: 'Nutrition and health',
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
    refs: [
      { org: 'The Vegan Society', title: 'Definition of veganism', link: 'https://www.vegansociety.com/go-vegan/definition-veganism' },
    ],
  },
];

export default function Sources() {
  return (
    <ContentPage
      seoTitle="Sources and References"
      description="Every study, agency and organisation Vegan Life draws on for its environmental, nutrition and health content."
      path={ROUTES.sources}
      crumb="Sources"
      eyebrow="Organisation"
      title="Sources and references"
      lead="Where our numbers come from, grouped by topic. If a link has moved or a figure looks off, please tell us."
    >
      <div style={{ display: 'grid', gap: 'var(--space-xl)' }}>
        <Callout variant="note" title="How we use sources">
          We prefer peer-reviewed research and international agencies. Figures are often rounded, and global
          averages hide large differences between countries and diets.
        </Callout>
        {GROUPS.map((g) => (
          <ReferenceList key={g.title} panel title={g.title} refs={g.refs} />
        ))}
      </div>
    </ContentPage>
  );
}
