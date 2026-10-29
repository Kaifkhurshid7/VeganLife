import { Seo, organizationSchema, webSiteSchema, faqSchema } from '../components/seo';
import { SITE } from '../constants/site';
import {
  Hero,
  WhatIsVeganismIntro,
  WhyVegan,
  Impact,
  Nutrition,
  Meals,
  Myths,
  Challenge,
  Blog,
  JoinCommunity,
} from '../components/sections';

/*
  Homepage FAQ. These four questions are the ones people actually type into a
  search box before they know anything about veganism, and each answer is also
  rendered on the page (in WhatIsVeganismIntro / Myths) — a requirement for
  FAQPage structured data, which must never describe hidden content.
*/
const HOME_FAQ = [
  {
    question: 'What is veganism?',
    answer:
      'Veganism is a way of living that seeks to avoid, as far as is practicable, the use of animals for food, clothing and other purposes. In everyday terms that usually means eating plants rather than meat, fish, dairy, eggs and honey, and choosing animal-free materials and products where reasonable alternatives exist.',
  },
  {
    question: 'What is the difference between vegan and vegetarian?',
    answer:
      'Vegetarian diets exclude meat and fish but often still include dairy and eggs. A vegan diet excludes all animal-derived foods, including dairy, eggs and honey. Veganism also commonly extends beyond food to clothing and household products.',
  },
  {
    question: 'Do I have to go vegan all at once?',
    answer:
      'No. Many people move gradually — swapping a few meals a week, then building up as they find foods and recipes they enjoy. There is no single correct pace, and partial changes still count.',
  },
  {
    question: 'Is a vegan diet nutritionally adequate?',
    answer:
      'Well-planned vegan diets can meet nutritional needs at most stages of life, according to positions published by dietetic associations. Attention is usually needed for vitamin B12, and depending on circumstances also vitamin D, iodine, iron, calcium, zinc and omega-3 fatty acids. Individual needs vary, so speak with a qualified healthcare professional about your own situation.',
  },
];

export default function Home() {
  return (
    <>
      <Seo
        // No page-name prefix: the homepage title is the brand + positioning.
        title={`${SITE.name} | ${SITE.tagline}`}
        description={SITE.description}
        path="/"
        schema={[organizationSchema(), webSiteSchema(), faqSchema(HOME_FAQ)]}
      />

      <Hero />
      <WhatIsVeganismIntro />
      <WhyVegan />
      <Impact />
      <Nutrition />
      <Meals />
      <Myths faq={HOME_FAQ} />
      <Challenge />
      <Blog />
      <JoinCommunity />
    </>
  );
}
