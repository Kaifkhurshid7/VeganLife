import { Link } from 'react-router-dom';
import ContentPage from './ContentPage';
import { Callout, LegalDocument } from '../components/ui';
import { ROUTES } from '../constants/routes';
import { SITE, CONTACT, LEGAL } from '../constants/site';

const operator = LEGAL.operatorName || SITE.legalName;

const sections = [
  {
    id: 'introduction',
    title: 'Introduction and scope',
    body: (
      <>
        <p>
          This Privacy Policy explains how {operator} (“<strong>{SITE.name}</strong>”, “we”, “us”, “our”)
          collects, uses, stores, shares and protects your personal data when you use our website, web
          application, community, chat rooms and related services (together, the “<strong>Platform</strong>”).
        </p>
        <p>
          We are committed to handling personal data lawfully, fairly and transparently, in line with the
          <strong> Digital Personal Data Protection Act, 2023</strong> (“<strong>DPDP Act</strong>”), the
          <strong> Information Technology Act, 2000</strong> and the rules made under it (including the
          Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or
          Information) Rules, 2011 and the Information Technology (Intermediary Guidelines and Digital Media
          Ethics Code) Rules, 2021), and other applicable Indian law.
        </p>
        <p>
          For the purposes of the DPDP Act, {operator} is the <strong>Data Fiduciary</strong> and you are the
          <strong> Data Principal</strong>. By creating an account or otherwise using the Platform after
          reading the notice in this policy, you acknowledge it. Where the law requires your consent we ask for
          it separately and you can withdraw it (see section 10).
        </p>
        <p>
          The Digital Personal Data Protection Rules, 2025 bring the DPDP Act into force in phases, with most
          obligations on Data Fiduciaries applying from 13 May 2027. We follow the Act’s standards now and will
          update this policy as each provision commences.
        </p>
      </>
    ),
  },
  {
    id: 'data-we-collect',
    title: 'Personal data we collect',
    body: (
      <>
        <p>We collect only the data needed to run the Platform. This falls into three groups.</p>
        <h3>2.1 Data you give us</h3>
        <ul>
          <li><strong>Account data:</strong> username, email address, password (stored only as a salted one-way hash, never in readable form), and profile details you choose to add such as display name, bio and avatar.</li>
          <li><strong>Content you create:</strong> posts, comments, hashtags, images, chat messages, reactions and reports. Community content is visible to other users as described in section 6.</li>
          <li><strong>Activity and social data:</strong> your sustainability score, streak, badges and completed challenges, bookmarks and collections, who you follow and who follows you, accounts you block or mute, and which chat rooms you have read up to (used to show unread counts).</li>
          <li><strong>Messages to us:</strong> anything you send us, including a grievance, with your contact details and the content of your message.</li>
        </ul>
        <h3>2.2 Data collected automatically</h3>
        <ul>
          <li><strong>Technical data:</strong> IP address, browser type and version, device and operating system, language, screen size, referring page and the pages and features you use.</li>
          <li><strong>Session and security data:</strong> authentication tokens held in cookies, login timestamps and records used to detect abuse, such as request rates.</li>
          <li><strong>Diagnostics:</strong> error reports and performance data sent to our error-monitoring provider when something breaks.</li>
          <li><strong>Notification data:</strong> if you opt in to push notifications, a browser push subscription identifier that lets us send you alerts.</li>
        </ul>
        <h3>2.3 Data we do not seek</h3>
        <p>
          We do not ask for government identifiers, financial or payment details, precise location, biometric
          data, or information about your health, religion, caste, political opinion or sexual orientation.
          The nutrition and impact tools run on the values you type into them and we do not need to store those
          inputs against your identity. Please do not post sensitive information about yourself or others in
          public areas of the Platform.
        </p>
      </>
    ),
  },
  {
    id: 'purposes',
    title: 'Why we use your data and our legal basis',
    body: (
      <>
        <p>
          Under the DPDP Act we process personal data on the basis of your consent, or for the “certain
          legitimate uses” the Act recognises. The table below maps each purpose to its basis.
        </p>
        <table>
          <thead>
            <tr><th>Purpose</th><th>Data used</th><th>Basis</th></tr>
          </thead>
          <tbody>
            <tr><td>Create and maintain your account; sign you in</td><td>Account data, session data</td><td>Consent; performance of the service you asked for</td></tr>
            <tr><td>Display your posts, profile and chat messages to others</td><td>Content, profile data</td><td>Consent (you choose to post)</td></tr>
            <tr><td>Moderate content, prevent spam, fraud and abuse, enforce our <Link to={ROUTES.terms}>Terms</Link></td><td>Content, technical and session data, reports</td><td>Legitimate use; compliance with law</td></tr>
            <tr><td>Keep the Platform secure and working; diagnose errors</td><td>Technical data, diagnostics</td><td>Legitimate use</td></tr>
            <tr><td>Send push notifications you have opted into</td><td>Push subscription identifier</td><td>Consent</td></tr>
            <tr><td>Run community features: scores, streaks, badges, follows, bookmarks, unread counts</td><td>Activity and social data</td><td>Consent; performance of the service you asked for</td></tr>
            <tr><td>Respond to your enquiries and grievances</td><td>Contact details, message content</td><td>Consent; legitimate use</td></tr>
            <tr><td>Comply with legal obligations and lawful requests from authorities</td><td>As required</td><td>Compliance with law</td></tr>
            <tr><td>Understand how the Platform is used so we can improve it</td><td>Aggregated technical data</td><td>Consent where required; otherwise legitimate use</td></tr>
          </tbody>
        </table>
        <p>
          We do not sell your personal data, we do not use it to build advertising profiles, and we do not make
          decisions about you based solely on automated processing that has legal or similarly significant
          effects.
        </p>
      </>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies and similar technologies',
    body: (
      <>
        <p>
          We use a small number of cookies and browser storage items that are needed for the Platform to work,
          chiefly to keep you signed in securely. Details, durations and your options are in our
          <Link to={ROUTES.cookies}> Cookie Policy</Link>, which forms part of this Privacy Policy.
        </p>
      </>
    ),
  },
  {
    id: 'sharing',
    title: 'Who we share data with',
    body: (
      <>
        <p>
          We share personal data only where necessary and only with the categories of recipient below. Each is
          bound by contract or by law to protect it and to use it only for the stated purpose.
        </p>
        <table>
          <thead>
            <tr><th>Recipient</th><th>Why</th></tr>
          </thead>
          <tbody>
            <tr><td>Cloud hosting and database providers</td><td>To host the Platform and store accounts and content</td></tr>
            <tr><td>Media storage and delivery provider</td><td>To store and serve images and avatars you upload</td></tr>
            <tr><td>Error-monitoring provider</td><td>To detect and fix faults; reports may include technical details such as page addresses, error traces and request metadata</td></tr>
            <tr><td>Push-notification services of your browser vendor</td><td>To deliver notifications you opted into</td></tr>
            <tr><td>Professional advisers (lawyers, auditors)</td><td>Under duties of confidentiality, where needed</td></tr>
            <tr><td>Courts, law-enforcement or government bodies</td><td>Only when required by law, court order or a lawful request, or to protect rights, safety and the Platform</td></tr>
            <tr><td>A successor entity</td><td>If the Platform is transferred or restructured, on terms that keep this policy’s protections</td></tr>
          </tbody>
        </table>
        <p>
          Where a recipient acts on our behalf it is a <strong>Data Processor</strong> and may process the data
          only on our documented instructions.
        </p>
      </>
    ),
  },
  {
    id: 'public-content',
    title: 'Public content and chat',
    body: (
      <>
        <p>
          Posts, comments, hashtags, profile details and messages in open chat rooms are visible to other users
          and, for public pages, to anyone on the internet. They may be copied, indexed or archived by third
          parties outside our control, and deleting content from the Platform does not remove copies made
          elsewhere. Think carefully before posting anything that identifies you or someone else.
        </p>
        <p>
          Chat messages are processed in real time through our servers and stored so that rooms keep their
          history. We may review reported content and, where necessary, access messages to enforce our rules or
          comply with law.
        </p>
      </>
    ),
  },
  {
    id: 'transfers',
    title: 'Storage location and cross-border transfers',
    body: (
      <>
        <p>
          Our service providers may store and process data on servers located in India or outside it. Section
          16 of the DPDP Act permits transfer of personal data outside India except to countries the Central
          Government restricts by notification. We will not transfer personal data to a restricted country and
          we require providers to apply security safeguards comparable to those described here.
        </p>
      </>
    ),
  },
  {
    id: 'retention',
    title: 'How long we keep data',
    body: (
      <>
        <p>
          We keep personal data only as long as the purpose requires or the law obliges us to. After that we
          erase it or make it irreversibly anonymous.
        </p>
        <table>
          <thead>
            <tr><th>Data</th><th>Retention</th></tr>
          </thead>
          <tbody>
            <tr><td>Account and profile data</td><td>While your account is active. When an account is deleted, the account record is removed; see the note on content below</td></tr>
            <tr><td>Posts, comments and chat messages</td><td>Until you or a moderator delete them, or we erase them on your valid request</td></tr>
            <tr><td>Authentication cookies</td><td>Access cookie 15 minutes; refresh cookie up to 7 days</td></tr>
            <tr><td>Server and security logs (including IP address)</td><td>For a limited period needed for security and diagnosis, and for any longer period that law requires</td></tr>
            <tr><td>Grievance and legal records</td><td>For as long as needed to show how a complaint was handled and to meet legal duties</td></tr>
            <tr><td>Backups</td><td>Until overwritten in the ordinary backup cycle of our hosting providers</td></tr>
          </tbody>
        </table>
        <p>
          Deleting an account removes the account record. Posts, comments and messages you made are not
          automatically removed with it, so ask us to erase them as well through the
          {' '}<Link to={ROUTES.grievance}>grievance process</Link> or delete them yourself first.
          We may keep data longer where needed to establish, exercise or defend legal claims, to resolve
          disputes, to prevent abuse by banned accounts, or to meet a legal retention duty. Under the DPDP Act we
          also erase data when you withdraw consent, unless law requires us to keep it.
        </p>
      </>
    ),
  },
  {
    id: 'security',
    title: 'Security',
    body: (
      <>
        <p>
          We apply reasonable security safeguards to protect personal data against unauthorised access, loss,
          alteration and disclosure, as required by Section 8(5) of the DPDP Act. They include:
        </p>
        <ul>
          <li>Passwords stored only as salted hashes.</li>
          <li>Authentication tokens kept in <code>httpOnly</code>, <code>Secure</code> cookies that page scripts cannot read.</li>
          <li>Encrypted connections (HTTPS/TLS) for data in transit.</li>
          <li>Request-rate limiting, input validation and standard security headers.</li>
          <li>Separate user and administrator roles, so administrative functions are available only to administrators.</li>
        </ul>
        <p>
          No system is perfectly secure. If a personal data breach occurs we will, as Section 8(6) of the DPDP
          Act and the DPDP Rules, 2025 require, inform the Data Protection Board of India and each affected Data
          Principal, describing the nature of the breach, its likely consequences, what we have done and what
          you can do to protect yourself.
        </p>
      </>
    ),
  },
  {
    id: 'your-rights',
    title: 'Your rights as a Data Principal',
    body: (
      <>
        <p>Under Chapter III of the DPDP Act you have the following rights, which you can exercise free of charge:</p>
        <ul>
          <li><strong>Right to information (s.11):</strong> to know what personal data we process, the processing activities, and the identities of other fiduciaries and processors we have shared it with.</li>
          <li><strong>Right to correction, completion and updating (s.12):</strong> to have inaccurate or incomplete data fixed. You can edit your name, username, bio and avatar in your profile settings and change your password there.</li>
          <li><strong>Right to erasure (s.12):</strong> to have data erased when it is no longer needed for the purpose or you withdraw consent, unless the law requires us to keep it.</li>
          <li><strong>Right to withdraw consent (s.6(4)):</strong> at any time, as easily as it was given. Withdrawal does not affect processing done before it. We may need to close features, or your account, that cannot work without that data.</li>
          <li><strong>Right of grievance redressal (s.13):</strong> to have a complaint handled by our Grievance Officer before you approach the Board. See our <Link to={ROUTES.grievance}>Grievance Redressal</Link> page.</li>
          <li><strong>Right to nominate (s.14):</strong> to nominate another individual to exercise your rights if you die or become incapacitated.</li>
        </ul>
        <p>
          To exercise a right, follow the <Link to={ROUTES.grievance}>Grievance Redressal</Link> process
          {LEGAL.grievanceOfficer.email || CONTACT.email ? <> or write to {LEGAL.grievanceOfficer.email || CONTACT.email}</> : null}.
          We may ask you to verify your identity first. We aim to respond within 30 days and in any event
          within the time the DPDP Rules prescribe. If you are not satisfied you may complain to the
          <strong> Data Protection Board of India</strong> after first using our grievance process.
        </p>
        <h3>Your duties</h3>
        <p>
          Section 15 of the DPDP Act asks Data Principals to comply with applicable law, not to impersonate
          anyone, not to suppress material information when providing data, not to register false or frivolous
          grievances, and to furnish only verifiably authentic information when exercising a right.
        </p>
      </>
    ),
  },
  {
    id: 'children',
    title: 'Children and minors',
    body: (
      <>
        <p>
          The Platform is intended for people aged <strong>18 and over</strong>. Under the DPDP Act a “child” is
          anyone below 18, and we may not process a child’s personal data without verifiable consent from a
          parent or lawful guardian, nor track or behaviourally monitor children or direct targeted advertising
          at them.
        </p>
        <p>
          We do not knowingly collect data from children. If you believe a child has registered, tell us through
          the <Link to={ROUTES.grievance}>Grievance Officer</Link> and we will take steps to verify and erase the
          account and its data. If the Platform later offers features for younger users we will update this
          policy and implement verifiable parental consent before enabling them.
        </p>
      </>
    ),
  },
  {
    id: 'third-party',
    title: 'Third-party links and embedded content',
    body: (
      <p>
        Articles and the <Link to={ROUTES.sources}>sources page</Link> link to external websites. We do not
        control their content or privacy practices and this policy does not apply to them. Review their policies
        before sharing personal data.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    body: (
      <p>
        We may revise this policy as the law, our practices or the Platform change. We will update the “last
        updated” date and, for material changes, give notice on the Platform. Where a change needs
        fresh consent we will ask for it before applying the change to you.
      </p>
    ),
  },
  {
    id: 'contact',
    title: 'Contact and grievances',
    body: (
      <>
        <p>
          <strong>Data Fiduciary:</strong> {operator}
          {LEGAL.registeredAddress ? <><br /><strong>Address:</strong> {LEGAL.registeredAddress}</> : null}
        </p>
        <p>
          <strong>Grievance Officer:</strong>{' '}
          {LEGAL.grievanceOfficer.name || 'Designated Grievance Officer'}
          {LEGAL.grievanceOfficer.email ? <> · {LEGAL.grievanceOfficer.email}</> : null}
          <br />
          Follow the process on the <Link to={ROUTES.grievance}>Grievance Redressal</Link> page, or see the
          {' '}<Link to={ROUTES.contact}>Contact</Link> page for other ways to reach us.
        </p>
      </>
    ),
  },
];

export default function Privacy() {
  return (
    <ContentPage
      seoTitle="Privacy Policy"
      description="How Vegan Life collects, uses, shares and protects personal data under India's Digital Personal Data Protection Act, 2023, and the rights you have."
      path={ROUTES.privacy}
      crumb="Privacy"
      eyebrow="Legal"
      title="Privacy policy"
      lead="What personal data we collect, why, who sees it, how long we keep it, and the rights you hold under the DPDP Act, 2023."
    >
      <LegalDocument sections={sections} current={ROUTES.privacy} />

      <div style={{ marginTop: 'var(--space-xl)' }}>
        <Callout variant="info" title="Review before launch">
          The operator name, address and Grievance Officer details in <code>constants/site.js</code> are blank and
          must be completed. This document is a thorough template, not legal advice. Have it checked by a
          qualified Indian lawyer against how the site actually stores and processes data, and against the
          final DPDP Rules in force on the day you go live.
        </Callout>
      </div>
    </ContentPage>
  );
}
