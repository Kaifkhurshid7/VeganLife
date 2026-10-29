import { Link } from 'react-router-dom';
import ContentPage from './ContentPage';
import { LegalDocument } from '../components/ui';
import { ROUTES } from '../constants/routes';
import { SITE } from '../constants/site';

const sections = [
  {
    id: 'what',
    title: 'What cookies are',
    body: (
      <p>
        Cookies are small text files a website stores in your browser. Similar technologies, such as
        <code> sessionStorage</code>, hold small pieces of data for the current visit. {SITE.name} uses them
        only where needed to run the Platform. This policy supplements our
        {' '}<Link to={ROUTES.privacy}>Privacy Policy</Link>.
      </p>
    ),
  },
  {
    id: 'used',
    title: 'What we use',
    body: (
      <>
        <table>
          <thead>
            <tr><th>Name</th><th>Type</th><th>Purpose</th><th>Duration</th></tr>
          </thead>
          <tbody>
            <tr><td>accessToken</td><td>Strictly necessary, first party, httpOnly, Secure</td><td>Proves you are signed in on each request</td><td>15 minutes</td></tr>
            <tr><td>refreshToken</td><td>Strictly necessary, first party, httpOnly, Secure</td><td>Renews your session so you are not logged out every 15 minutes</td><td>Up to 7 days, or until you sign out</td></tr>
            <tr><td>Offline cache (service worker)</td><td>Functionality</td><td>Stores copies of site files in your browser so pages load faster and work offline. Holds no personal data</td><td>Until updated or you clear site data</td></tr>
            <tr><td>Intro screen flag (sessionStorage)</td><td>Functionality</td><td>Remembers you have seen the welcome splash so it does not repeat</td><td>Until the tab is closed</td></tr>
          </tbody>
        </table>
        <p>
          Authentication cookies are marked <code>httpOnly</code>, so scripts running on a page, including
          malicious ones, cannot read them.
        </p>
      </>
    ),
  },
  {
    id: 'not-used',
    title: 'What we do not use',
    body: (
      <p>
        We do not set advertising, cross-site tracking or behavioural-profiling cookies, and we do not
        participate in ad networks. If we add analytics that is not strictly necessary we will update this
        page and ask for your consent first.
      </p>
    ),
  },
  {
    id: 'third',
    title: 'Third-party cookies',
    body: (
      <p>
        Embedded or linked third-party content (such as media and external sites) may set their own cookies
        under their own policies. We do not control these. Your browser lets you block them.
      </p>
    ),
  },
  {
    id: 'control',
    title: 'Your choices',
    body: (
      <>
        <p>
          Strictly necessary cookies are needed to keep you signed in, so they are not optional while you
          use an account. You can control all cookies in your browser settings: block, delete or get alerts
          for them. If you block the authentication cookies you will not be able to sign in or post.
        </p>
        <p>
          Where consent is required for optional technologies, you can withdraw it at any time as described in
          section 10 of the <Link to={ROUTES.privacy}>Privacy Policy</Link>.
        </p>
      </>
    ),
  },
  {
    id: 'updates',
    title: 'Updates',
    body: (
      <p>
        We will revise this policy when we change the cookies we use. Questions can be sent through the
        {' '}<Link to={ROUTES.contact}>Contact</Link> page.
      </p>
    ),
  },
];

export default function Cookies() {
  return (
    <ContentPage
      seoTitle="Cookie Policy"
      description="Which cookies Vegan Life uses, why, how long they last, and how to control them."
      path={ROUTES.cookies}
      crumb="Cookies"
      eyebrow="Legal"
      title="Cookie policy"
      lead="The few cookies we set, and what each one does."
    >
      <LegalDocument sections={sections} current={ROUTES.cookies} />
    </ContentPage>
  );
}
