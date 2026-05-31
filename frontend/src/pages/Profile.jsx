import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEdit2, FiSave, FiX, FiCalendar, FiAward } from 'react-icons/fi';
import { FaSeedling, FaFire, FaLeaf } from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import BackButton from '../components/ui/BackButton';
import styles from './Profile.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Profile() {
  const { user, accessToken, updateProfile, isAuthenticated } = useAuth();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', username: '', bio: '' });
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, username: user.username, bio: user.bio || '' });
      fetchMyPosts();
    }
  }, [user]);

  if (!isAuthenticated) return <Navigate to="/auth" />;

  async function fetchMyPosts() {
    try {
      const res = await fetch(`${API_URL}/posts`);
      if (res.ok) {
        const json = await res.json();
        const data = Array.isArray(json) ? json : (json.data || []);
        setMyPosts(data.filter((p) => p.author?._id === user.id || p.author?.id === user.id));
      }
    } catch {}
  }

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(form);
      toast.success('Profile updated');
      setEditing(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletePost(postId) {
    if (!confirm('Delete this post?')) return;
    try {
      const res = await fetch(`${API_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        toast.success('Post deleted');
        setMyPosts((prev) => prev.filter((p) => p._id !== postId));
      } else {
        toast.error('Could not delete post');
      }
    } catch {
      toast.error('Network error');
    }
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <section className={styles.section}>
      <BackButton />
      <div className={styles.container}>
        <motion.div className={styles.profileCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>{user.name.charAt(0)}</div>
            {!editing && (
              <button className={styles.editBtn} onClick={() => setEditing(true)}><FiEdit2 /> Edit Profile</button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSave} className={styles.editForm}>
              <div className={styles.field}>
                <label>Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className={styles.field}>
                <label>Username</label>
                <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
              </div>
              <div className={styles.field}>
                <label>Bio</label>
                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} maxLength={300} placeholder="Tell us about your vegan journey..." />
              </div>
              <div className={styles.editActions}>
                <button type="submit" className={styles.saveBtn} disabled={loading}><FiSave /> Save</button>
                <button type="button" className={styles.cancelBtn} onClick={() => setEditing(false)}><FiX /> Cancel</button>
              </div>
            </form>
          ) : (
            <div className={styles.profileInfo}>
              <h1 className={styles.name}>{user.name}</h1>
              <p className={styles.username}>@{user.username}</p>
              {user.bio && <p className={styles.bio}>{user.bio}</p>}
            </div>
          )}

          <div className={styles.statsRow}>
            <div className={styles.stat}><FaSeedling className={styles.statIcon} /><span>{user.sustainabilityScore || 0}</span><small>XP</small></div>
            <div className={styles.stat}><FaFire className={styles.statIcon} /><span>{user.streak || 0}</span><small>Day Streak</small></div>
            <div className={styles.stat}><FaLeaf className={styles.statIcon} /><span>{myPosts.length}</span><small>Posts</small></div>
            <div className={styles.stat}><FiCalendar className={styles.statIcon} /><span>{memberSince}</span><small>Joined</small></div>
          </div>
        </motion.div>

        <div className={styles.postsSection}>
          <h2 className={styles.postsTitle}>My Posts</h2>
          {myPosts.length === 0 ? (
            <p className={styles.noPosts}>You haven't posted anything yet.</p>
          ) : (
            <div className={styles.postsList}>
              {myPosts.map((post) => (
                <div key={post._id} className={styles.postItem}>
                  <div className={styles.postContent}>
                    <h3>{post.title}</h3>
                    <p>{post.content.slice(0, 120)}{post.content.length > 120 ? '...' : ''}</p>
                    <div className={styles.postMeta}>
                      <span>{post.upvotes?.length || 0} upvotes</span>
                      <span>{post.comments?.length || 0} comments</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button className={styles.deleteBtn} onClick={() => handleDeletePost(post._id)}><FiX /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
