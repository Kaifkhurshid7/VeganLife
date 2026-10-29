import { Link } from 'react-router-dom';
import ContentPage from './ContentPage';
import { Callout, LegalDocument } from '../components/ui';
import { ROUTES } from '../constants/routes';
import { SITE, LEGAL } from '../constants/site';

const operator = LEGAL.operatorName || SITE.legalName;

const sections = [
  {
    id: 'acceptance',
    title: 'Acceptance of these terms',
    body: (
      <>
        <p>
          These Terms of Use (“<strong>Terms</strong>”) form a binding agreement between you and {operator}
          (“<strong>{SITE.name}</strong>”, “we”, “us”) governing your access to and use of our website, web
          application, community, chat rooms and related services (the “<strong>Platform</strong>”).
        </p>
        <p>
          By accessing the Platform, creating an account or posting content you confirm that you have read and
          agree to these Terms, our <Link to={ROUTES.privacy}>Privacy Policy</Link>, our
          {' '}<Link to={ROUTES.cookies}>Cookie Policy</Link> and our <Link to={ROUTES.disclaimer}>Health
          Disclaimer</Link>, all of which are incorporated by reference. This is an electronic record under the
          Information Technology Act, 2000 and needs no physical or digital signature. If you do not agree, do
          not use the Platform.
        </p>
      </>
    ),
  },
  {
    id: 'eligibility',
    title: 'Eligibility and accounts',
    body: (
      <>
        <ul>
          <li>You must be at least <strong>18 years old</strong> and capable of entering a binding contract under the Indian Contract Act, 1872 to register or post.</li>
          <li>You must give accurate information and keep it up to date. One person may not run accounts to evade a ban or to manipulate discussions.</li>
          <li>You are responsible for keeping your password confidential and for all activity under your account. Tell us promptly if you suspect unauthorised use.</li>
          <li>You may not transfer or sell your account or username.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'educational-content',
    title: 'Educational content only; no professional advice',
    body: (
      <>
        <p>
          Everything on the Platform, including articles, recipes, the nutrition calculator, meal planner,
          impact estimates and community posts, is general information for education. It is
          <strong> not medical, dietetic, nutritional, legal or financial advice</strong> and creates no
          doctor–patient or other professional relationship. Always consult a registered medical practitioner or
          qualified dietitian before changing your diet, particularly if you are pregnant or breastfeeding, a
          child, elderly, have a medical condition, or take medication. See the
          {' '}<Link to={ROUTES.disclaimer}>Health Disclaimer</Link> for the full statement.
        </p>
      </>
    ),
  },
  {
    id: 'community-conduct',
    title: 'Community conduct and prohibited content',
    body: (
      <>
        <p>
          In line with Rule 3(1)(b) of the IT (Intermediary Guidelines and Digital Media Ethics Code) Rules,
          2021, you agree not to host, upload, display, publish, transmit or share content that:
        </p>
        <ul>
          <li>belongs to another person and to which you have no right, or infringes any patent, trademark, copyright or other proprietary right;</li>
          <li>is defamatory, obscene, pornographic, paedophilic, invasive of another’s privacy, or insulting or harassing on the basis of gender, or racially or ethnically objectionable, or promotes hatred or violence against any person or group, including on grounds of religion, caste, community, diet or lifestyle;</li>
          <li>is harmful to children, threatens the unity, integrity, defence, security or sovereignty of India, public order, or incites any offence;</li>
          <li>impersonates another person or misleads the recipient about its origin, or knowingly communicates false or misleading information;</li>
          <li>contains software viruses or code designed to disrupt, destroy or limit any computer resource;</li>
          <li>violates any law in force, including the Bharatiya Nyaya Sanhita, 2023.</li>
        </ul>
        <p>You further agree that you will not:</p>
        <ul>
          <li>post spam, unsolicited promotion, referral schemes or commercial advertising without our written permission;</li>
          <li>present personal opinion or anecdote as medical fact, promote dangerous diets or discourage anyone from seeking medical care;</li>
          <li>harass, dox or target other users, including those who eat differently from you. Disagreement is welcome, contempt is not;</li>
          <li>scrape, crawl or harvest data, probe or test the Platform’s security, overload it, or bypass rate limits or access controls;</li>
          <li>use the Platform to train machine-learning models without our prior written consent;</li>
          <li>share another person’s personal data, including photographs, without their consent.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'user-content',
    title: 'Your content and the licence you grant',
    body: (
      <>
        <p>
          You keep ownership of content you post. You are solely responsible for it and promise that you own
          it or have the necessary rights and that it does not breach these Terms or any law.
        </p>
        <p>
          You grant us a non-exclusive, worldwide, royalty-free, sub-licensable licence to host, store,
          reproduce, display, adapt (for formatting and thumbnails only) and distribute your content on and in
          connection with the Platform, for as long as it remains on the Platform and for a reasonable period
          afterwards in backups. We will not use your content in paid advertising without asking you. This
          licence ends when content is deleted, except for copies already shared by other users, quoted in
          replies, or retained for legal reasons.
        </p>
      </>
    ),
  },
  {
    id: 'moderation',
    title: 'Moderation, reports and enforcement',
    body: (
      <>
        <p>
          We act as an <strong>intermediary</strong> within the meaning of Section 2(1)(w) of the Information
          Technology Act, 2000. We do not pre-screen user content and are not its publisher, but we may review,
          restrict or remove content and suspend or terminate accounts that breach these Terms or the law.
        </p>
        <ul>
          <li>Use the report button on content or use the <Link to={ROUTES.grievance}>Grievance Redressal</Link> process to flag anything unlawful or abusive.</li>
          <li>On receiving actual knowledge through a court order or a notification from an appropriate government authority, or on a valid complaint, we will act within the time the IT Rules require and preserve relevant records.</li>
          <li>Where we remove your content or restrict your account we will aim to tell you why and, except for serious or unlawful conduct, let you reply. Decisions can be contested through our <Link to={ROUTES.grievance}>Grievance Redressal</Link> process.</li>
          <li>Repeat or severe breaches can lead to permanent termination without notice. We may report unlawful activity to the authorities.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'ip',
    title: 'Intellectual property',
    body: (
      <>
        <p>
          The Platform’s design, text, graphics, logos, code, data compilations and original articles are owned
          by or licensed to us and protected by the Copyright Act, 1957, the Trade Marks Act, 1999 and other
          laws. You may view and use them for personal, non-commercial purposes. You may not copy, modify,
          distribute, sell or create derivative works from them without written permission, except for fair
          dealing permitted by law, such as quoting for criticism, review or reporting with attribution.
        </p>
        <p>
          <strong>Copyright complaints.</strong> If you believe content on the Platform infringes your
          copyright, send us the work concerned, the location (URL) of the allegedly infringing material, your
          contact details, and a statement that you are the owner or authorised to act. We will review it
          promptly and may remove the material and notify the poster.
        </p>
      </>
    ),
  },
  {
    id: 'accuracy',
    title: 'Accuracy, estimates and tools',
    body: (
      <>
        <p>
          We cite sources and try to keep figures current, but we do not warrant that content is complete,
          current or error-free. Values from the nutrition, savings and comparison tools are
          <strong> estimates</strong> based on published averages and simplifying assumptions. Real results vary
          with your food, region, body and circumstances. See the <Link to={ROUTES.sources}>sources page</Link>.
        </p>
      </>
    ),
  },
  {
    id: 'third-party',
    title: 'Third-party links and services',
    body: (
      <p>
        The Platform may link to third-party sites, products or services. We do not endorse or control them and
        accept no responsibility for their content, accuracy, availability or practices. Your dealings with
        them are your own risk and subject to their terms.
      </p>
    ),
  },
  {
    id: 'privacy-data',
    title: 'Privacy and personal data',
    body: (
      <p>
        We process personal data as set out in the <Link to={ROUTES.privacy}>Privacy Policy</Link>, in
        compliance with the Digital Personal Data Protection Act, 2023. By using the Platform you agree to that
        processing, and you can withdraw consent as the policy explains, subject to our ability to keep
        providing the features that depend on it.
      </p>
    ),
  },
  {
    id: 'availability',
    title: 'Availability and changes to the Platform',
    body: (
      <p>
        The Platform is provided free of charge. We may modify, suspend or discontinue any feature at any time,
        with or without notice, including for maintenance, security or legal reasons. We do not guarantee
        uninterrupted or error-free access.
      </p>
    ),
  },
  {
    id: 'disclaimer-warranty',
    title: 'Disclaimer of warranties',
    body: (
      <p style={{ textTransform: 'uppercase', fontSize: 'var(--text-sm)' }}>
        To the fullest extent permitted by law, the Platform and all content are provided “as is” and “as
        available”, without warranties of any kind, express or implied, including merchantability, fitness for
        a particular purpose, accuracy, non-infringement and uninterrupted availability. User content reflects
        its authors’ views only, not ours.
      </p>
    ),
  },
  {
    id: 'liability',
    title: 'Limitation of liability',
    body: (
      <>
        <p>
          To the fullest extent permitted by law, we and our volunteers, contributors and service providers
          are not liable for any indirect, incidental, special, consequential or punitive loss, or any loss of
          profit, data, goodwill or opportunity, arising from your use of or inability to use the Platform,
          reliance on its content or tools, dealings with other users, or unauthorised access to your account
          that was not caused by our wilful default.
        </p>
        <p>
          Where liability cannot be excluded, our total liability to you for all claims is limited to
          <strong> ₹1,000</strong>. Nothing in these Terms limits liability that cannot lawfully be limited,
          including for fraud or wilful misconduct, or affects your statutory rights as a consumer.
        </p>
      </>
    ),
  },
  {
    id: 'indemnity',
    title: 'Indemnity',
    body: (
      <p>
        You agree to indemnify and hold harmless {operator} and its volunteers, contributors and service
        providers from claims, losses, liabilities and reasonable expenses (including legal fees) arising from
        your content, your breach of these Terms or the law, or your infringement of any person’s rights.
      </p>
    ),
  },
  {
    id: 'termination',
    title: 'Suspension and termination',
    body: (
      <>
        <p>
          You may stop using the Platform and delete your account at any time. We may suspend or terminate your
          access immediately where you breach these Terms, where required by law, or where your use creates risk
          for others or the Platform.
        </p>
        <p>
          Sections that by nature should survive termination (content licence for retained copies, intellectual
          property, disclaimers, limitation of liability, indemnity, governing law and dispute resolution)
          continue to apply.
        </p>
      </>
    ),
  },
  {
    id: 'law-disputes',
    title: 'Governing law and dispute resolution',
    body: (
      <>
        <p>
          These Terms are governed by the laws of India. Please raise any complaint with us first through the
          {' '}<Link to={ROUTES.grievance}>Grievance Redressal</Link> process so we can try to resolve it
          amicably within 30 days.
        </p>
        <p>
          Unresolved disputes may be referred to arbitration by a sole arbitrator appointed by mutual consent,
          under the Arbitration and Conciliation Act, 1996. The seat and venue will be
          {' '}{LEGAL.governingCity || 'the city of our registered office'}, the language English. Subject to that,
          the courts at {LEGAL.governingCity || 'that city'} have exclusive jurisdiction. This clause does not
          limit rights you may have under the Consumer Protection Act, 2019 or any right to approach the Data
          Protection Board of India.
        </p>
      </>
    ),
  },
  {
    id: 'general',
    title: 'General',
    body: (
      <ul>
        <li><strong>Entire agreement:</strong> these Terms and the documents they reference are the whole agreement between us on this subject.</li>
        <li><strong>Severability:</strong> if a provision is held invalid, the rest remains in force.</li>
        <li><strong>No waiver:</strong> failure to enforce a right is not a waiver of it.</li>
        <li><strong>Assignment:</strong> you may not assign your rights; we may assign ours to a successor.</li>
        <li><strong>Force majeure:</strong> we are not liable for failure caused by events beyond our reasonable control.</li>
        <li><strong>Notices:</strong> we may notify you on the Platform.</li>
        <li><strong>Changes:</strong> we may update these Terms. We will change the date above and give notice of material changes. Continued use after the effective date means acceptance.</li>
      </ul>
    ),
  },
  {
    id: 'contact',
    title: 'Contact',
    body: (
      <p>
        Questions about these Terms? See the <Link to={ROUTES.contact}>Contact</Link> page. Complaints about
        content or data handling go to our Grievance Officer through
        {' '}<Link to={ROUTES.grievance}>Grievance Redressal</Link>.
      </p>
    ),
  },
];

export default function Terms() {
  return (
    <ContentPage
      seoTitle="Terms of Use"
      description="The terms governing use of Vegan Life: eligibility, community conduct under the IT Rules 2021, content licence, disclaimers, liability and dispute resolution."
      path={ROUTES.terms}
      crumb="Terms"
      eyebrow="Legal"
      title="Terms of use"
      lead="The rules for using the site, what you can expect from us, and what we expect from you."
    >
      <LegalDocument sections={sections} current={ROUTES.terms} />

      <div style={{ marginTop: 'var(--space-xl)' }}>
        <Callout variant="info" title="Review before launch">
          Complete the operator name and governing city in <code>constants/site.js</code>. This is a thorough
          template, not legal advice. Have a qualified Indian lawyer confirm the liability cap, arbitration seat
          and intermediary clauses before launch.
        </Callout>
      </div>
    </ContentPage>
  );
}
