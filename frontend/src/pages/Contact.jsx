import { Link } from 'react-router-dom';
import ContentPage from './ContentPage';
import { Callout } from '../components/ui';
import { ROUTES } from '../constants/routes';
import { CONTACT, activeSocialProfiles } from '../constants/site';
import styles from './ContentPage.module.css';

export default function Contact() {
  const socials = activeSocialProfiles();

  return (
    <ContentPage
      seoTitle="Contact Vegan Life"
      description="How to reach the Vegan Life team with questions, corrections or source suggestions."
      path={ROUTES.contact}
      crumb="Contact"
      eyebrow="Organisation"
      title="Contact us"
      lead="Questions, corrections and source suggestions are all welcome."
    >
      <div className={styles.prose}>
        {CONTACT.email ? (
          <p>
            Email us at <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
            {CONTACT.responseTime && ` ${CONTACT.responseTime}`}
          </p>
        ) : (
          <p>
            We don’t publish a public email address yet. The quickest way to reach us is through the{' '}
            <Link to={ROUTES.community}>community</Link>, where you can post a question or report an error.
          </p>
        )}
        {CONTACT.location && <p>{CONTACT.location}</p>}
        {socials.length > 0 && (
          <ul>
            {socials.map((s) => (
              <li key={s.platform}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginTop: 'var(--space-xl)' }}>
        <Callout variant="info" title="Medical questions">
          We can’t give personal medical or dietary advice. For health concerns, please contact a doctor or
          registered dietitian.
        </Callout>
      </div>
    </ContentPage>
  );
}
