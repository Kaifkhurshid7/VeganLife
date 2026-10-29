import { Link } from 'react-router-dom';
import ContentPage from './ContentPage';
import { ROUTES } from '../constants/routes';
import { SITE } from '../constants/site';
import styles from './ContentPage.module.css';

export default function About() {
  return (
    <ContentPage
      seoTitle="About Vegan Life"
      description={SITE.description}
      path={ROUTES.about}
      crumb="About"
      eyebrow="Organisation"
      title={`About ${SITE.name}`}
      lead="A community platform for learning what veganism means, exploring practical resources and connecting with people moving toward more compassionate, sustainable living."
    >
      <div className={styles.prose}>
        <h2>What we do</h2>
        <p>
          We publish plain-language guides, recipes and interactive tools on food, health and the
          environment, and we host a community where people can ask questions and share what works.
        </p>

        <h2>How we handle facts</h2>
        <ul>
          <li>Statistics link to a peer-reviewed study or an international agency wherever possible.</li>
          <li>Where figures are rounded or illustrative, the page says so.</li>
          <li>Health content is educational and never a substitute for professional advice.</li>
          <li>All references are collected on the <Link to={ROUTES.sources}>sources page</Link>.</li>
        </ul>

        <h2>Get in touch</h2>
        <p>
          Spotted an error or want to suggest a source? Use the <Link to={ROUTES.contact}>contact page</Link>.
        </p>
      </div>
    </ContentPage>
  );
}
