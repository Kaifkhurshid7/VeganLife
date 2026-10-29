import { Link } from 'react-router-dom';
import ContentPage from './ContentPage';
import { Callout, LegalDocument } from '../components/ui';
import { ROUTES } from '../constants/routes';
import { SITE } from '../constants/site';

const sections = [
  {
    id: 'not-advice',
    title: 'Not medical or professional advice',
    body: (
      <>
        <p>
          {SITE.name} provides general information about plant-based living, nutrition, food systems and the
          environment for <strong>educational purposes only</strong>. Nothing on the Platform is medical,
          dietetic, nutritional, psychological, legal or financial advice, or a substitute for the judgement of
          a qualified professional who knows your circumstances. Reading or using our content does not create a
          professional relationship with us.
        </p>
      </>
    ),
  },
  {
    id: 'consult',
    title: 'Speak to a professional first',
    body: (
      <>
        <p>Consult a registered medical practitioner or qualified dietitian before you change your diet, especially if you:</p>
        <ul>
          <li>are pregnant, trying to conceive or breastfeeding;</li>
          <li>are planning a diet for an infant, child or teenager;</li>
          <li>are elderly, underweight, or have a history of an eating disorder;</li>
          <li>have diabetes, kidney, liver, heart or thyroid conditions, anaemia, or any chronic illness;</li>
          <li>take prescription medicines or supplements, or have food allergies or intolerances.</li>
        </ul>
        <p>
          Any plant-based diet should be planned to cover energy, protein, iron, calcium, iodine, zinc, omega-3
          and vitamin D. Vitamin B12 is not reliably available from plant foods and is usually obtained from
          fortified foods or supplements. Ask your doctor about testing and dosage. Never stop or delay medical
          care because of something you read here.
        </p>
      </>
    ),
  },
  {
    id: 'tools',
    title: 'Calculators, planners and estimates',
    body: (
      <p>
        The nutrition calculator, meal planner, impact-per-meal and comparison tools give rough estimates from
        published averages and simplifying assumptions. They are not diagnoses, prescriptions or guarantees
        and do not account for your health, activity, region or the exact food you eat. Treat the figures as a
        starting point. Sources are listed on the <Link to={ROUTES.sources}>sources page</Link>.
      </p>
    ),
  },
  {
    id: 'community',
    title: 'Community content',
    body: (
      <p>
        Posts, comments and chat messages reflect the personal experience and opinions of their authors. We do
        not verify them, they are not our advice, and they may be wrong or unsuitable for you. Do not rely on
        them for health decisions.
      </p>
    ),
  },
  {
    id: 'environment',
    title: 'Environmental and statistical claims',
    body: (
      <p>
        Figures on water, land, emissions and food systems come from third-party studies that use different
        methods, boundaries and years, and can change as research develops. We aim to cite them accurately but
        do not guarantee they are current or complete.
      </p>
    ),
  },
  {
    id: 'emergency',
    title: 'Emergencies',
    body: (
      <p>
        The Platform is not an emergency service. If you think you have a medical emergency, call your local
        emergency number (in India, <strong>112</strong>) or go to the nearest hospital immediately.
      </p>
    ),
  },
  {
    id: 'liability',
    title: 'No liability for reliance',
    body: (
      <p>
        You use the information at your own risk. To the fullest extent permitted by law we accept no
        responsibility for any loss, injury or harm resulting from reliance on it. See the
        {' '}<Link to={ROUTES.terms}>Terms of Use</Link> for the full limitation of liability.
      </p>
    ),
  },
];

export default function Disclaimer() {
  return (
    <ContentPage
      seoTitle="Health Disclaimer"
      description="Vegan Life provides educational information only. It is not medical, nutritional or professional advice."
      path={ROUTES.disclaimer}
      crumb="Health Disclaimer"
      eyebrow="Legal"
      title="Health disclaimer"
      lead="General information, not personal medical advice."
    >
      <LegalDocument sections={sections} current={ROUTES.disclaimer} />

      <div style={{ marginTop: 'var(--space-xl)' }}>
        <Callout variant="note" title="In short">
          Use this site to learn and to prepare good questions, then take them to a qualified professional.
        </Callout>
      </div>
    </ContentPage>
  );
}
