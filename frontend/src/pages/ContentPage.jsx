import BackButton from '../components/ui/BackButton';
import { PageHeader } from '../components/ui';
import { Seo } from '../components/seo';
import { ROUTES } from '../constants/routes';
import styles from './ContentPage.module.css';

/**
 * Shared frame for text-led pages: SEO tags, back button, breadcrumb trail and
 * the single H1. Page bodies are passed as children.
 */
export default function ContentPage({ seoTitle, description, path, crumb, eyebrow, title, lead, noindex, children }) {
  return (
    <section className={styles.section}>
      <Seo title={seoTitle || title} description={description} path={path} noindex={noindex} />
      <BackButton />
      <div className={styles.container}>
        <PageHeader
          eyebrow={eyebrow}
          title={title}
          lead={lead}
          trail={[
            { name: 'Home', path: ROUTES.home },
            { name: crumb || title, path },
          ]}
        />
        {children}
      </div>
    </section>
  );
}
