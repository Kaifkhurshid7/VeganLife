import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowUp, FiMessageCircle, FiShare2, FiPlus } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/ui/BackButton';
import styles from './Community.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Community() {
  const { user, token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'General', image: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPosts(); }, []);

  async function fetchPosts() {
    try {
      const res = await fetch(`${API_URL}/posts`);
      const data = await res.json();
      setPosts(data);
    } catch { /* offline fallback */ }
    finally { setLoading(false); }
  }

  async function handleUpvote(postId) {
    if (!token) return alert('Please login to upvote');
    try {
      const res = await fetch(`${API_URL}/posts/${postId}/upvote`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchPosts();
    } catch {}
  }

  async function handleCreatePost(e) {
    e.preventDefault();
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newPost),
      });
      if (res.ok) {
        setShowCreate(false);
        setNewPost({ title: '', content: '', category: 'General', image: '' });
        fetchPosts();
      }
    } catch {}
  }

  async function handleComment(postId, text) {
    if (!token) return alert('Please login to comment');
    try {
      await fetch(`${API_URL}/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text }),
      });
      fetchPosts();
    } catch {}
  }

  function handleShare(post) {
    if (navigator.share) {
      navigator.share({ title: post.title, text: post.content.slice(0, 100), url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied!');
    }
  }

  return (
    <section className={styles.section}>
      <BackButton />
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Community</h1>
            <p className={styles.subtitle}>Share your vegan journey, tips, and stories.</p>
          </div>
          {user && (
            <button className={`btn btn-primary ${styles.createBtn}`} onClick={() => setShowCreate(!showCreate)}>
              <FiPlus /> New Post
            </button>
          )}
          {!user && (
            <Link to="/auth" className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '10px 20px' }}>
              Login to Post
            </Link>
          )}
        </div>

        {showCreate && (
          <motion.form
            className={`glass-card ${styles.createForm}`}
            onSubmit={handleCreatePost}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <input type="text" placeholder="Post title" value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} required className={styles.input} />
            <textarea placeholder="Share your thoughts..." value={newPost.content} onChange={(e) => setNewPost({ ...newPost, content: e.target.value })} required className={styles.textarea} rows={4} />
            <div className={styles.createRow}>
              <select value={newPost.category} onChange={(e) => setNewPost({ ...newPost, category: e.target.value })} className={styles.select}>
                <option>General</option>
                <option>Sustainability</option>
                <option>Fitness</option>
                <option>Student Life</option>
                <option>Climate</option>
                <option>Nutrition</option>
                <option>Recipes</option>
              </select>
              <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '0.85rem' }}>Submit</button>
            </div>
            <p className={styles.note}>Posts are reviewed by admin before appearing publicly.</p>
          </motion.form>
        )}

        {loading && <p className={styles.loading}>Loading posts...</p>}

        <div className={styles.feed}>
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onUpvote={handleUpvote} onComment={handleComment} onShare={handleShare} user={user} />
          ))}
          {!loading && posts.length === 0 && (
            <p className={styles.empty}>No posts yet. Be the first to share!</p>
          )}
        </div>
      </div>
    </section>
  );
}

function PostCard({ post, onUpvote, onComment, onShare, user }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const hasUpvoted = user && post.upvotes?.includes(user.id);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onComment(post._id, commentText);
    setCommentText('');
  };

  return (
    <motion.div className={`glass-card ${styles.postCard}`} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
      <div className={styles.postHeader}>
        <div className={styles.postAuthor}>
          <div className={styles.avatar}>{post.author?.name?.charAt(0) || '?'}</div>
          <div>
            <span className={styles.authorName}>{post.author?.name || 'Anonymous'}</span>
            <span className={styles.postDate}>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <span className={styles.categoryBadge}>{post.category}</span>
      </div>

      <h3 className={styles.postTitle}>{post.title}</h3>
      <p className={styles.postContent}>{post.content}</p>

      <div className={styles.postActions}>
        <button className={`${styles.actionBtn} ${hasUpvoted ? styles.upvoted : ''}`} onClick={() => onUpvote(post._id)}>
          <FiArrowUp /> {post.upvotes?.length || 0}
        </button>
        <button className={styles.actionBtn} onClick={() => setShowComments(!showComments)}>
          <FiMessageCircle /> {post.comments?.length || 0}
        </button>
        <button className={styles.actionBtn} onClick={() => onShare(post)}>
          <FiShare2 />
        </button>
      </div>

      {showComments && (
        <div className={styles.commentsSection}>
          {post.comments?.map((c) => (
            <div key={c._id} className={styles.comment}>
              <strong>{c.user?.name || 'User'}</strong>
              <p>{c.text}</p>
            </div>
          ))}
          {user && (
            <form onSubmit={handleSubmitComment} className={styles.commentForm}>
              <input type="text" placeholder="Write a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)} className={styles.commentInput} />
              <button type="submit" className={styles.commentSubmit}>Post</button>
            </form>
          )}
        </div>
      )}
    </motion.div>
  );
}
