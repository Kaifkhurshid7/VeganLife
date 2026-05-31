import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheck, FiX, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/ui/BackButton';
import styles from './Admin.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Admin() {
  const { user, token, isAdmin } = useAuth();
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (isAdmin) fetchPosts(); }, [isAdmin]);

  if (!user) return <Navigate to="/auth" />;
  if (!isAdmin) return <Navigate to="/" />;

  async function fetchPosts() {
    try {
      const res = await fetch(`${API_URL}/posts/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setPosts(await res.json());
    } catch {}
    finally { setLoading(false); }
  }

  async function updateStatus(postId, status) {
    try {
      await fetch(`${API_URL}/posts/${postId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      fetchPosts();
    } catch {}
  }

  async function deletePost(postId) {
    if (!confirm('Delete this post permanently?')) return;
    try {
      await fetch(`${API_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPosts();
    } catch {}
  }

  const filtered = posts.filter((p) => filter === 'all' || p.status === filter);

  return (
    <section className={styles.section}>
      <BackButton />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Admin Panel</h1>
          <p className={styles.subtitle}>Manage community posts, approve or reject submissions.</p>
        </div>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statNum}>{posts.filter((p) => p.status === 'pending').length}</span>
            <span className={styles.statLabel}>Pending</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNum}>{posts.filter((p) => p.status === 'approved').length}</span>
            <span className={styles.statLabel}>Approved</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNum}>{posts.length}</span>
            <span className={styles.statLabel}>Total</span>
          </div>
        </div>

        <div className={styles.filters}>
          {['pending', 'approved', 'rejected', 'all'].map((f) => (
            <button key={f} className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading && <p className={styles.loading}>Loading...</p>}

        <div className={styles.postList}>
          {filtered.map((post) => (
            <motion.div key={post._id} className={`glass-card ${styles.postItem}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
                <span>{post.upvotes?.length || 0} upvotes</span>
                <span>{post.comments?.length || 0} comments</span>
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
          {!loading && filtered.length === 0 && <p className={styles.empty}>No posts in this category.</p>}
        </div>
      </div>
    </section>
  );
}
