import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowUp, FiMessageCircle, FiShare2, FiBookmark, FiPlus, FiTrendingUp, FiClock, FiUsers, FiAward, FiX, FiImage, FiSend, FiHeart } from 'react-icons/fi';
import { FaLeaf, FaSeedling, FaFire, FaDroplet, FaEarthAmericas, FaHandHoldingHeart, FaLightbulb } from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/ui/BackButton';
import styles from './Community.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const FEED_TABS = [
  { id: 'trending', label: 'Trending', icon: <FiTrendingUp /> },
  { id: 'latest', label: 'Latest', icon: <FiClock /> },
  { id: 'challenges', label: 'Challenges', icon: <FaFire /> },
  { id: 'recipes', label: 'Recipes', icon: <FaSeedling /> },
];

const REACTIONS = [
  { icon: <FaSeedling />, label: 'Inspired' },
  { icon: <FiHeart />, label: 'Helpful' },
  { icon: <FaFire />, label: 'Motivating' },
  { icon: <FaEarthAmericas />, label: 'Sustainable' },
];

const BADGES = [
  { level: 0, name: 'Seedling', icon: <FaSeedling style={{ color: '#a6b48f' }} /> },
  { level: 50, name: 'Conscious Eater', icon: <FaLeaf style={{ color: '#8fa67a' }} /> },
  { level: 150, name: 'Eco Warrior', icon: <FaSeedling style={{ color: '#2ecc71' }} /> },
  { level: 300, name: 'Planet Guardian', icon: <FaEarthAmericas style={{ color: '#9d82ab' }} /> },
  { level: 500, name: 'Sustainability Mentor', icon: <FaHandHoldingHeart style={{ color: '#e3a36e' }} /> },
];

function getUserBadge(score) {
  return [...BADGES].reverse().find((b) => score >= b.level) || BADGES[0];
}

export default function Community() {
  const { user, accessToken, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('latest');
  const [showComposer, setShowComposer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'General', image: '' });

  useEffect(() => { fetchPosts(); }, [activeTab]);

  async function fetchPosts() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/posts`);
      if (res.ok) {
        const json = await res.json();
        let data = Array.isArray(json) ? json : (json.data || []);
        if (activeTab === 'trending') data.sort((a, b) => (b.upvotes?.length || 0) - (a.upvotes?.length || 0));
        if (activeTab === 'challenges') data = data.filter((p) => p.category === 'Sustainability' || p.category === 'Fitness');
        if (activeTab === 'recipes') data = data.filter((p) => p.category === 'Recipes' || p.category === 'Nutrition');
        setPosts(data);
      }
    } catch {}
    finally { setLoading(false); }
  }

  async function handleUpvote(postId) {
    if (!accessToken) return;
    try {
      await fetch(`${API_URL}/posts/${postId}/upvote`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      fetchPosts();
    } catch {}
  }

  async function handleComment(postId, text) {
    if (!accessToken || !text.trim()) return;
    try {
      await fetch(`${API_URL}/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ text }),
      });
      fetchPosts();
    } catch {}
  }

  async function handleCreatePost(e) {
    e.preventDefault();
    if (!accessToken || !newPost.title || !newPost.content) return;
    try {
      const res = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(newPost),
      });
      if (res.ok) {
        setShowComposer(false);
        setNewPost({ title: '', content: '', category: 'General', image: '' });
        fetchPosts();
      }
    } catch {}
  }

  return (
    <section className={styles.section}>
      <BackButton />
      <div className={styles.layout}>
        {/* Left Sidebar */}
        <aside className={styles.leftSidebar}>
          {isAuthenticated ? (
            <div className={styles.profileCard}>
              <div className={styles.profileAvatar}>{user.name.charAt(0)}</div>
              <h4 className={styles.profileName}>{user.name}</h4>
              <span className={styles.profileUsername}>@{user.username}</span>
              <div className={styles.profileBadge}>
                <span>{getUserBadge(user.sustainabilityScore || 0).icon}</span>
                <span>{getUserBadge(user.sustainabilityScore || 0).name}</span>
              </div>
              <div className={styles.profileStats}>
                <div><FaFire className={styles.statIcon} /><span>{user.streak || 0} day streak</span></div>
                <div><FaSeedling className={styles.statIcon} /><span>{user.sustainabilityScore || 0} XP</span></div>
              </div>
            </div>
          ) : (
            <div className={styles.loginPrompt}>
              <FaLeaf className={styles.loginIcon} />
              <p>Join the community to post, react, and earn badges.</p>
              <Link to="/auth" className="btn btn-primary" style={{ width: '100%', fontSize: '0.85rem', padding: '12px' }}>
                Get Started
              </Link>
            </div>
          )}

          <nav className={styles.sideNav}>
            <span className={styles.sideNavLabel}>Quick Links</span>
            <Link to="/calculator" className={styles.sideNavLink}><FiAward /> BMI Calculator</Link>
            <Link to="/seasonal" className={styles.sideNavLink}><FaSeedling /> Seasonal Produce</Link>
            <Link to="/compare" className={styles.sideNavLink}><FiTrendingUp /> Compare Diets</Link>
            <Link to="/savings" className={styles.sideNavLink}><FaDroplet /> Carbon Savings</Link>
          </nav>

          <div className={styles.trendingTags}>
            <span className={styles.sideNavLabel}>Trending Tags</span>
            <div className={styles.tagList}>
              {['#PlantBased', '#MealPrep', '#EcoWarrior', '#VeganFitness', '#ZeroWaste', '#StudentVegan'].map((tag) => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Feed */}
        <main className={styles.mainFeed}>
          <div className={styles.feedHeader}>
            <h1 className={styles.feedTitle}>Community</h1>
            {isAuthenticated && (
              <button className={styles.composeBtn} onClick={() => setShowComposer(true)}>
                <FiPlus /> New Post
              </button>
            )}
          </div>

          {/* Feed Tabs */}
          <div className={styles.feedTabs}>
            {FEED_TABS.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.feedTab} ${activeTab === tab.id ? styles.feedTabActive : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Composer Modal */}
          <AnimatePresence>
            {showComposer && (
              <motion.div className={styles.composerOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowComposer(false)}>
                <motion.div className={styles.composer} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
                  <div className={styles.composerHeader}>
                    <h3>Create Post</h3>
                    <button className={styles.composerClose} onClick={() => setShowComposer(false)}><FiX /></button>
                  </div>
                  <form onSubmit={handleCreatePost} className={styles.composerForm}>
                    <input type="text" placeholder="Post title" value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} required />
                    <textarea placeholder="Share your thoughts, recipes, or sustainability tips..." value={newPost.content} onChange={(e) => setNewPost({ ...newPost, content: e.target.value })} required rows={5} />
                    <div className={styles.composerFooter}>
                      <div className={styles.composerTools}>
                        <select value={newPost.category} onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}>
                          <option>General</option><option>Sustainability</option><option>Fitness</option><option>Student Life</option><option>Climate</option><option>Nutrition</option><option>Recipes</option>
                        </select>
                        <button type="button" className={styles.toolBtn}><FiImage /></button>
                      </div>
                      <button type="submit" className={styles.publishBtn}><FiSend /> Publish</button>
                    </div>
                    <p className={styles.composerNote}>Posts are reviewed before appearing publicly.</p>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Feed */}
          {loading ? (
            <div className={styles.skeletons}>
              {[1, 2, 3].map((i) => <div key={i} className={styles.skeleton} />)}
            </div>
          ) : posts.length === 0 ? (
            <motion.div className={styles.emptyState} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <FaSeedling className={styles.emptyIcon} />
              <h3>No posts yet</h3>
              <p>Every movement begins with one voice. Share your sustainable journey with the community.</p>
              {isAuthenticated && <button className="btn btn-primary" onClick={() => setShowComposer(true)}>Create First Post</button>}
            </motion.div>
          ) : (
            <div className={styles.feed}>
              {posts.map((post, idx) => (
                <PostCard key={post._id} post={post} idx={idx} user={user} onUpvote={handleUpvote} onComment={handleComment} />
              ))}
            </div>
          )}
        </main>

        {/* Right Sidebar */}
        <aside className={styles.rightSidebar}>
          <div className={styles.communityStats}>
            <h4>Community Impact</h4>
            <div className={styles.impactGrid}>
              <div className={styles.impactItem}><FaEarthAmericas /><span>2,400 kg</span><small>CO₂ Saved</small></div>
              <div className={styles.impactItem}><FaDroplet /><span>180K L</span><small>Water Saved</small></div>
              <div className={styles.impactItem}><FiUsers /><span>342</span><small>Members</small></div>
              <div className={styles.impactItem}><FaFire /><span>89</span><small>Active Today</small></div>
            </div>
          </div>

          <div className={styles.topContributors}>
            <h4>Top Contributors</h4>
            <div className={styles.contributorList}>
              {['Sabrina J.', 'Daniel C.', 'Clara V.', 'Alex M.'].map((name, i) => (
                <div key={name} className={styles.contributor}>
                  <span className={styles.contributorRank}>#{i + 1}</span>
                  <div className={styles.contributorAvatar}>{name.charAt(0)}</div>
                  <span className={styles.contributorName}>{name}</span>
                  <span className={styles.contributorXP}>{500 - i * 80} XP</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.activeChallenges}>
            <h4>Active Challenges</h4>
            <div className={styles.challengeList}>
              <div className={styles.challengeItem}>
                <FaFire style={{ color: 'var(--color-orange)' }} />
                <div><strong>7-Day Vegan</strong><small>23 participants</small></div>
              </div>
              <div className={styles.challengeItem}>
                <FaSeedling style={{ color: 'var(--color-sage)' }} />
                <div><strong>Zero Waste Week</strong><small>15 participants</small></div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile FAB */}
      {isAuthenticated && (
        <button className={styles.fab} onClick={() => setShowComposer(true)}>
          <FiPlus />
        </button>
      )}
    </section>
  );
}

function PostCard({ post, idx, user, onUpvote, onComment }) {
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
    <motion.article
      className={styles.postCard}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: idx * 0.05 }}
    >
      <div className={styles.postHeader}>
        <div className={styles.postAuthor}>
          <div className={styles.postAvatar}>{post.author?.name?.charAt(0) || '?'}</div>
          <div>
            <span className={styles.postAuthorName}>{post.author?.name || 'Anonymous'}</span>
            <span className={styles.postTime}>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
        <span className={styles.postCategory}>{post.category}</span>
      </div>

      <h3 className={styles.postTitle}>{post.title}</h3>
      <p className={styles.postContent}>{post.content}</p>

      {/* Reactions bar */}
      <div className={styles.reactionsBar}>
        {post.upvotes?.length > 0 && (
          <div className={styles.reactionSummary}>
            <span className={styles.reactionIcons}><FaSeedling /><FiHeart /></span>
            <span>{post.upvotes.length} reaction{post.upvotes.length > 1 ? 's' : ''}</span>
          </div>
        )}
        {post.comments?.length > 0 && (
          <span className={styles.commentCount}>{post.comments.length} comment{post.comments.length > 1 ? 's' : ''}</span>
        )}
      </div>

      {/* Action buttons */}
      <div className={styles.postActions}>
        <button className={`${styles.actionBtn} ${hasUpvoted ? styles.actionActive : ''}`} onClick={() => onUpvote(post._id)}>
          <FiArrowUp /> <span>Upvote</span>
        </button>
        <button className={styles.actionBtn} onClick={() => setShowComments(!showComments)}>
          <FiMessageCircle /> <span>Comment</span>
        </button>
        <button className={styles.actionBtn} onClick={() => { navigator.clipboard.writeText(window.location.href); }}>
          <FiShare2 /> <span>Share</span>
        </button>
        <button className={styles.actionBtn}>
          <FiBookmark /> <span>Save</span>
        </button>
      </div>

      {/* Comments */}
      <AnimatePresence>
        {showComments && (
          <motion.div className={styles.commentsSection} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            {post.comments?.map((c) => (
              <div key={c._id} className={styles.comment}>
                <div className={styles.commentAvatar}>{c.user?.name?.charAt(0) || '?'}</div>
                <div className={styles.commentBody}>
                  <strong>{c.user?.name || 'User'}</strong>
                  <p>{c.text}</p>
                </div>
              </div>
            ))}
            {user && (
              <form onSubmit={handleSubmitComment} className={styles.commentForm}>
                <div className={styles.commentInputAvatar}>{user.name.charAt(0)}</div>
                <input type="text" placeholder="Write a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)} />
                <button type="submit" disabled={!commentText.trim()}><FiSend /></button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
