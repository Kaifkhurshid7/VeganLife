import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaUsers, FaScaleBalanced, FaBug, FaArrowRight } from 'react-icons/fa6';
import LearnLayout, { BlockHead } from './LearnLayout';
import { Callout } from '../components/ui';
import { ROUTES } from '../constants/routes';
import { CONTACT, LEGAL, SITE, activeSocialProfiles } from '../constants/site';
import { IMG } from '../constants/images';
import styles from './Learn.module.css';

const mail = (subject) => `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}`;

export default function Contact() {
  const socials = activeSocialProfiles();
  const hasEmail = Boolean(CONTACT.email);
  const officerEmail = LEGAL.grievanceOfficer.email || CONTACT.email;

  // Each channel degrades gracefully: with no public email it points at the
  // community or grievance page instead of showing a dead mailto link.
  const channels = [
    {
      icon: <FaBug />,
      color: '#e3a36e',
      title: 'Report an error',
      text: 'A wrong figure, a broken link or a source we should add. Corrections make the site better for everyone.',
      action: hasEmail
        ? { href: mail('Correction for Vegan Life'), label: 'Email a correction', external: true }
        : { to: ROUTES.community, label: 'Post it in the community' },
    },
    {
      icon: <FaEnvelope />,
      color: '#7f9a5f',
      title: 'General questions',
      text: 'Questions about the site, partnerships or anything that doesn’t fit elsewhere.',
      action: hasEmail
        ? { href: mail('Question about Vegan Life'), label: CONTACT.email, external: true }
        : { to: ROUTES.community, label: 'Ask the community' },
    },
    {
      icon: <FaScaleBalanced />,
      color: '#9d82ab',
      title: 'Privacy and complaints',
      text: 'Access, correct or erase your data, withdraw consent, or raise a complaint. Complaints are acknowledged within 24 hours.',
      action: { to: ROUTES.grievance, label: 'Grievance Redressal' },
    },
    {
      icon: <FaUsers />,
      color: '#6f9a9a',
      title: 'Talk to members',
      text: 'Ask for recipe ideas, swap tips and meet people at every stage of eating plant-based.',
      action: { to: ROUTES.community, label: 'Visit the community' },
    },
  ];

  const facts = [
    { label: 'Complaints', value: 'Acknowledged within 24 hours' },
    { label: 'Best for fixes', value: 'Tell us the page and the figure' },
    { label: 'Medical advice', value: 'We can’t give it' },
    { label: 'Cost', value: 'Free to use' },
  ];

  return (
    <LearnLayout
      seoTitle="Contact Vegan Life"
      description="How to reach the Vegan Life team with questions, corrections or source suggestions."
      path={ROUTES.contact}
      crumb="Contact"
      eyebrow="Organisation"
      title="Contact us"
      lead={
        <>
          Questions, corrections and source suggestions are all welcome. Pick the route below that{' '}
          <mark>fits what you need</mark>, so it reaches the right person first time.
        </>
      }
      images={{
        main: { src: IMG.gHostelMeals, alt: 'A shared plant-based meal' },
        small: { src: IMG.iPeanuts, alt: 'A fresh salad' },
      }}
      chip={{ big: '24h', text: 'To acknowledge a complaint' }}
      ring="HELLO • QUESTIONS • FIXES • "
      facts={facts}
    >
      <section className={styles.block}>
        <BlockHead kicker="Get in touch" title="Four ways to reach us" />
        <div className={styles.threeUp} style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
          {channels.map((c, i) => (
            <motion.article
              key={c.title}
              className={styles.plateItem}
              style={{ '--accent': c.color }}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
            >
              <span className={styles.plateIcon} aria-hidden="true">{c.icon}</span>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
              {c.action.to ? (
                <Link to={c.action.to} className={styles.cardLink}>
                  {c.action.label} <FaArrowRight aria-hidden="true" />
                </Link>
              ) : (
                <a href={c.action.href} className={styles.cardLink}>
                  {c.action.label} <FaArrowRight aria-hidden="true" />
                </a>
              )}
            </motion.article>
          ))}
        </div>
      </section>

      {(!hasEmail || socials.length > 0 || LEGAL.registeredAddress) && (
        <section className={styles.block}>
          <BlockHead kicker="Details" title="Where to find us" />
          <ul className={styles.audience}>
            {!hasEmail && <li>No public email yet. The community is the quickest route</li>}
            {hasEmail && officerEmail && <li>Grievance Officer: {officerEmail}</li>}
            {LEGAL.registeredAddress && <li>{LEGAL.registeredAddress}</li>}
            {socials.map((s) => (
              <li key={s.platform}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Callout variant="info" title="Medical questions">
        We can’t give personal medical or dietary advice. For health concerns, please speak to a doctor or
        registered dietitian. {SITE.name} is educational only.
      </Callout>
    </LearnLayout>
  );
}
