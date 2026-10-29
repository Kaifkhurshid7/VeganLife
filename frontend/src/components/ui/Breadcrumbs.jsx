import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

/**
 * Accessible breadcrumb trail.
 *
 * `trail` is root-first: [{ name, path }]. The last entry is rendered as plain
 * text with aria-current="page" rather than a link to the page you are already
 * on. Pair this with breadcrumbSchema() from components/seo so the visible trail
 * and the structured data always describe the same path.
 */
export default function Breadcrumbs({ trail = [] }) {
  if (trail.length < 2) return null;

  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          listStyle: 'none',
          padding: 0,
          margin: 0,
        }}
      >
        {trail.map((crumb, i) => {
          const isLast = i === trail.length - 1;
          return (
            <li key={crumb.path} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isLast ? (
                <span aria-current="page">{crumb.name}</span>
              ) : (
                <>
                  <Link to={crumb.path}>{crumb.name}</Link>
                  <FiChevronRight className="breadcrumbs-sep" aria-hidden="true" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
