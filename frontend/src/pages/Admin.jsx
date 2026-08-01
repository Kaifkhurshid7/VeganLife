import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCounter } from '../hooks';
import BackButton from '../components/ui/BackButton';
import { apiFetch } from '../utils/api';
import styles from './Admin.module.css';

function StatNumber({ value }) {
  const { ref, count } = useCounter(String(value), 1.2);
  return <span className={styles.statNum} ref={ref}>{count}</span>;
}

export default function Admin() {
  const { user, isAdmin } = useAuth();
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (isAdmin) fetchPosts(); }, [isAdmin]);

  if (!user) return <Navigate to="/auth" />;
  if (!isAdmin) return <Navigate to="/" />;

  async function fetchPosts() {
    try {
      const res = await apiFetch('/posts/admin/all');
      if (res.ok) setPosts(await res.json());
    } catch {}
    finally { setLoading(false); }
  }

  async function updateStatus(postId, status) {
    try {
      await apiFetch(`/posts/${postId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchPosts();
    } catch {}
  }

  async function deletePost(postId) {
    if (!confirm('Delete this post permanently?')) return;
    try {
      await apiFetch(`/posts/${postId}`, { method: 'DELETE' });
      fetchPosts();
    } catch {}
  }

  const filtered = posts.filter((p) => filter === 'all' || p.status === filter);

  return (
    <section className={styles.section}>
      <BackButton />
      <div className={styles.container}>
        <motion.div className={styles.header} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <h1 className={styles.title}>Admin Panel</h1>
          <p className={styles.subtitle}>Manage community posts, approve or reject submissions.</p>
        </motion.div>

        <div className={styles.stats}>
          {[
            { label: 'Pending', value: posts.filter((p) => p.status === 'pending').length },
            { label: 'Approved', value: posts.filter((p) => p.status === 'approved').length },
            { label: 'Total', value: posts.length },
          ].map((s, idx) => (
            <motion.div
              key={s.label}
              className={styles.statCard}
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
            >
              <StatNumber value={s.value} />
              <span className={styles.statLabel}>{s.label}</span>
            </motion.div>
          ))}
        </div>

        <div className={styles.filters}>
          {['pending', 'approved', 'rejected', 'all'].map((f) => (
            <motion.button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
              onClick={() => setFilter(f)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </motion.button>
          ))}
        </div>

        {loading && <p className={styles.loading}>Loading...</p>}

        <div className={styles.postList}>
        <AnimatePresence mode="popLayout">
          {filtered.map((post, idx) => (
            <motion.div
              key={post._id}
              className={`glass-card ${styles.postItem}`}
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              layout
              transition={{ duration: 0.4, delay: idx * 0.04 }}
              whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 24 } }}
            >
              <div className={styles.postHeader}>
                <div>
                  <h3 className={styles.postTitle}>{post.title}</h3>
                  <p className={styles.postMeta}>
                    by {post.author?.name || 'Unknown'} · {post.category} · {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`${styles.statusBadge} ${styles[post.status]}`}>{post.status}</span>
              </div>
              <p className={styles.postContent}>{post.content.slice(0, 200)}{post.content.length > 200 ? '...' : ''}</p>
              <div className={styles.postStats}>
                <span>{post.upvoteCount || 0} upvotes</span>
                <span>{post.commentCount || 0} comments</span>
              </div>
              <div className={styles.actions}>
                {post.status === 'pending' && (
                  <>
                    <button className={styles.approveBtn} onClick={() => updateStatus(post._id, 'approved')}><FiCheck /> Approve</button>
                    <button className={styles.rejectBtn} onClick={() => updateStatus(post._id, 'rejected')}><FiX /> Reject</button>
                  </>
                )}
                <button className={styles.deleteBtn} onClick={() => deletePost(post._id)}><FiTrash2 /> Delete</button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {!loading && filtered.length === 0 && <p className={styles.empty}>No posts in this category.</p>}
        </div>
      </div>
    </section>
  );
}
