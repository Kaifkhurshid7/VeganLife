import { useParams, Link } from 'react-router-dom';
import ContentPage from './ContentPage';
import { Callout, ReferenceList } from '../components/ui';
import { blogs } from '../data/blogs';
import { ROUTES } from '../constants/routes';
import styles from './ContentPage.module.css';

export default function ArticleDetail() {
  const { slug } = useParams();
  const post = blogs.find((b) => String(b.id) === String(slug));

  if (!post) {
    return (
      <ContentPage
        seoTitle="Article not found"
        path={ROUTES.articles}
        crumb="Articles"
        title="Article not found"
        lead="We couldn’t find that article. It may have moved."
        noindex
      >
        <Link to={ROUTES.articles} className="btn btn-primary">Back to articles</Link>
      </ContentPage>
    );
  }

  return (
    <ContentPage
      seoTitle={post.title}
      description={post.summary}
      path={`${ROUTES.articles}/${post.id}`}
      crumb={post.title}
      eyebrow={post.category}
      title={post.title}
      lead={post.summary}
    >
      <div className={styles.meta} style={{ marginBottom: 'var(--space-lg)' }}>
        <span>By {post.author}</span>
        <span>{post.readTime}</span>
        <span>{post.date}</span>
      </div>
      {post.image && (
        <img
          src={post.image}
          alt=""
          className={styles.cardImg}
          style={{ maxWidth: 'var(--max-width-text)', marginBottom: 'var(--space-xl)' }}
        />
      )}
      <div className={styles.prose}>
        <p>{post.desc}</p>
      </div>

      <div className={styles.stack} style={{ marginTop: 'var(--space-xl)' }}>
        <Callout variant="note" title="General information">
          Articles are educational and are not personal medical or dietary advice.
        </Callout>
        <ReferenceList panel title="Sources & further reading" refs={post.references} />
        <Link to={ROUTES.articles} className="btn btn-outline">More articles</Link>
      </div>
    </ContentPage>
  );
}
