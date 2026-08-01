import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowUp, FiMessageCircle, FiHash, FiTrendingUp, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaLeaf, FaSeedling } from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import BackButton from '../components/ui/BackButton';
import { apiFetch } from '../utils/api';
import styles from './Hashtag.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Hashtag() {
  const { tag } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    fetchHashtagPosts();
    fetchTrendingHashtags();
  }, [tag, page]);

  async function fetchHashtagPosts() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/posts/hashtag/${tag}?page=${page}&limit=20`);
      if (res.ok) {
        const json = await res.json();
        setPosts(json.data || []);
        setPagination(json.pagination);
      }
    } catch (err) {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  }

  async function fetchTrendingHashtags() {
    try {
      const res = await fetch(`${API_URL}/posts/trending/hashtags?limit=5`);
      if (res.ok) {
        const json = await res.json();
        setTrending(json.data || []);
      }
    } catch (err) {
      console.error('Failed to load trending:', err);
    }
  }

  async function handleUpvote(postId) {
    if (!isAuthenticated) {
      toast.warning('Login to upvote');
      return;
    }
    try {
      await apiFetch(`/posts/${postId}/upvote`, { method: 'POST' });
      fetchHashtagPosts();
    } catch {
      toast.error('Failed to upvote');
    }
  }

  return (
    <section className={styles.section}>
      <BackButton />

      <div className={styles.container}>
        {/* Header */}
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={styles.hashtagHeader}>
            <FiHash className={styles.hashIcon} />
            <h1 className={styles.title}>{tag}</h1>
          </div>
          <p className={styles.description}>Explore posts about {tag}</p>
        </motion.div>

        <div className={styles.layout}>
          {/* Main Feed */}
          <main className={styles.feed}>
            {loading ? (
              <div className={styles.loading}>Loading posts...</div>
            ) : posts.length > 0 ? (
              <>
                <div className={styles.posts}>
                  {posts.map((post, idx) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      idx={idx}
                      user={user}
                      onUpvote={handleUpvote}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                  <div className={styles.pagination}>
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      className={styles.paginationBtn}
                    >
                      <FiChevronLeft /> Previous
                    </button>
                    <span className={styles.pageInfo}>
                      Page {pagination.page} of {pagination.pages}
                    </span>
                    <button
                      disabled={page === pagination.pages}
                      onClick={() => setPage(page + 1)}
                      className={styles.paginationBtn}
                    >
                      Next <FiChevronRight />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className={styles.empty}>
                <FaSeedling className={styles.emptyIcon} />
                <h3>No posts yet</h3>
                <p>Be the first to post about #{tag}</p>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <motion.div
              className={styles.trendingCard}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className={styles.cardHeader}>
                <FiTrendingUp />
                <h3>Trending Hashtags</h3>
              </div>
              <div className={styles.trendingList}>
                {trending.length > 0 ? (
                  trending.map((item, idx) => (
                    <motion.button
                      key={item.tag}
                      className={styles.trendingItem}
                      onClick={() => navigate(`/hashtag/${item.tag}`)}
                      whileHover={{ x: 4 }}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: idx * 0.06 }}
                    >
                      <span className={styles.trendingRank}>#{idx + 1}</span>
                      <span className={styles.trendingTag}>#{item.tag}</span>
                      <span className={styles.trendingCount}>{item.count} posts</span>
                    </motion.button>
                  ))
                ) : (
                  <p className={styles.empty}>No trending hashtags</p>
                )}
              </div>
            </motion.div>

            <motion.div
              className={styles.infoCard}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h4>About Hashtags</h4>
              <p>
                Use hashtags to categorize posts and make them discoverable. Click on any hashtag to explore related content.
              </p>
            </motion.div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function PostCard({ post, idx, user, onUpvote }) {
  const hasUpvoted = user && post.hasUpvoted;

  return (
    <motion.article
      className={styles.postCard}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: idx * 0.05 }}
    >
      <div className={styles.postHeader}>
        <div className={styles.author}>
          <div className={styles.avatar}>{post.author?.name?.charAt(0) || '?'}</div>
          <div>
            <span className={styles.name}>{post.author?.name || 'Anonymous'}</span>
            <span className={styles.username}>@{post.author?.username}</span>
          </div>
        </div>
        <span className={styles.category}>{post.category}</span>
      </div>

      <h3 className={styles.postTitle}>{post.title}</h3>
      <p className={styles.postContent}>{post.content}</p>

      {post.hashtags && post.hashtags.length > 0 && (
        <div className={styles.hashtags}>
          {post.hashtags.map(tag => (
            <span key={tag} className={styles.hashtag}>#{tag}</span>
          ))}
        </div>
      )}

      {post.image && (
        <div className={styles.postImage}>
          <img src={post.image} alt={post.title} />
        </div>
      )}

      <div className={styles.actions}>
        <motion.button
          className={`${styles.actionBtn} ${hasUpvoted ? styles.active : ''}`}
          onClick={() => onUpvote(post._id)}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiArrowUp /> Upvote ({post.upvoteCount || 0})
        </motion.button>
        <motion.button className={styles.actionBtn} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
          <FiMessageCircle /> Comments ({post.commentCount || 0})
        </motion.button>
      </div>
    </motion.article>
  );
}
