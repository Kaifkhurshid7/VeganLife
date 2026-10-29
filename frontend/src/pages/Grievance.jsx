import { Link } from 'react-router-dom';
import ContentPage from './ContentPage';
import { Callout, LegalDocument } from '../components/ui';
import { ROUTES } from '../constants/routes';
import { SITE, CONTACT, LEGAL } from '../constants/site';

const officer = LEGAL.grievanceOfficer;

const sections = [
  {
    id: 'purpose',
    title: 'Purpose',
    body: (
      <p>
        This page sets out how to raise a complaint with {SITE.name} about your personal data, content on the
        Platform or our handling of your account. It meets the grievance-redressal requirements of Section 13 of
        the Digital Personal Data Protection Act, 2023 and Rule 3(2) of the IT (Intermediary Guidelines and
        Digital Media Ethics Code) Rules, 2021.
      </p>
    ),
  },
  {
    id: 'officer',
    title: 'Grievance Officer',
    body: (
      <>
        <table>
          <tbody>
            <tr><th>Name</th><td>{officer.name || 'Grievance Officer, ' + (LEGAL.operatorName || SITE.legalName)}</td></tr>
            <tr><th>Email</th><td>{officer.email || CONTACT.email || 'To be published before launch'}</td></tr>
            {officer.address || LEGAL.registeredAddress ? (
              <tr><th>Address</th><td>{officer.address || LEGAL.registeredAddress}</td></tr>
            ) : null}
            <tr><th>In the app</th><td>Use the report option on any post or message to flag content</td></tr>
          </tbody>
        </table>
      </>
    ),
  },
  {
    id: 'what',
    title: 'What you can complain about',
    body: (
      <ul>
        <li>Any act or omission of ours concerning your rights as a Data Principal: access, correction, erasure, consent withdrawal or nomination.</li>
        <li>A suspected personal data breach.</li>
        <li>Content on the Platform that is unlawful or breaches our <Link to={ROUTES.terms}>Terms</Link>, including harassment, impersonation, intimate images shared without consent, or copyright infringement.</li>
        <li>A moderation decision you believe was wrong, such as removal of your content or suspension of your account.</li>
      </ul>
    ),
  },
  {
    id: 'how',
    title: 'How to file',
    body: (
      <>
        <p>Send us the following so we can act quickly:</p>
        <ol>
          <li>Your name, username and the email registered with your account.</li>
          <li>A clear description of the issue and the outcome you want.</li>
          <li>For content complaints, the link (URL) to the content and why it is unlawful or objectionable.</li>
          <li>Any supporting documents, and your signature or electronic confirmation of the complaint.</li>
        </ol>
        <p>
          We may ask you to verify your identity before sharing or changing personal data. Please file in good
          faith: Section 15 of the DPDP Act asks Data Principals not to register false or frivolous complaints.
        </p>
      </>
    ),
  },
  {
    id: 'timelines',
    title: 'Our timelines',
    body: (
      <table>
        <thead>
          <tr><th>Stage</th><th>Target time</th></tr>
        </thead>
        <tbody>
          <tr><td>Acknowledge your complaint</td><td>Within 24 hours</td></tr>
          <tr><td>Remove or disable content that exposes private areas of a person or shows nudity or sexual acts, or is an impersonation, once reported by the person affected</td><td>Within 24 hours</td></tr>
          <tr><td>Act on other content complaints</td><td>Within 15 days</td></tr>
          <tr><td>Resolve data-rights and other complaints</td><td>We aim for 30 days, and in any event within the time the DPDP Rules prescribe</td></tr>
        </tbody>
      </table>
    ),
  },
  {
    id: 'escalation',
    title: 'If you are not satisfied',
    body: (
      <>
        <p>
          If we do not resolve your complaint within the period above, or you are unhappy with the outcome, you
          may:
        </p>
        <ul>
          <li>complain to the <strong>Data Protection Board of India</strong> on matters under the DPDP Act, after first using this process;</li>
          <li>appeal to the Grievance Appellate Committee under the IT Rules, 2021 for content and account decisions, as available;</li>
          <li>approach a court or consumer commission, or report cybercrime at <strong>cybercrime.gov.in</strong> or the helpline <strong>1930</strong>.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'nominate',
    title: 'Nominating a representative',
    body: (
      <p>
        Under Section 14 of the DPDP Act you may nominate a person to exercise your rights if you die or become
        unable to do so. Send the nominee’s name and contact details to the Grievance Officer.
      </p>
    ),
  },
];

export default function Grievance() {
  return (
    <ContentPage
      seoTitle="Grievance Redressal"
      description="How to contact the Grievance Officer at Vegan Life, what we handle, our response timelines and how to escalate under the DPDP Act and the IT Rules."
      path={ROUTES.grievance}
      crumb="Grievance Redressal"
      eyebrow="Legal"
      title="Grievance redressal"
      lead="Who to write to, how fast we respond, and where to escalate."
    >
      <LegalDocument sections={sections} current={ROUTES.grievance} />

      <div style={{ marginTop: 'var(--space-xl)' }}>
        <Callout variant="info" title="Fill in before launch">
          Set the Grievance Officer’s name, email and address in <code>constants/site.js</code>. The law
          requires a named, reachable officer to be published.
        </Callout>
      </div>
    </ContentPage>
  );
}
