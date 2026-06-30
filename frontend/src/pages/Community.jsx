import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowUp, FiMessageCircle, FiShare2, FiBookmark, FiPlus, FiTrendingUp, FiClock, FiUsers, FiAward, FiX, FiImage, FiSend, FiHeart, FiSearch, FiTrash2, FiHash, FiEdit2, FiCornerDownRight, FiMapPin, FiBarChart2 } from 'react-icons/fi';
import { FaLeaf, FaSeedling, FaFire, FaDroplet, FaEarthAmericas, FaHandHoldingHeart, FaLightbulb, FaXTwitter, FaFacebook, FaWhatsapp } from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import BackButton from '../components/ui/BackButton';
import RichTextEditor from '../components/ui/RichTextEditor';
import UserSearch from '../components/ui/UserSearch';
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
  const toast = useToast();
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('latest');
  const [showComposer, setShowComposer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'General', image: '' });
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchPosts(); }, [activeTab]);

  const filteredPosts = searchQuery
    ? posts.filter((p) => p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || p.content?.toLowerCase().includes(searchQuery.toLowerCase()))
    : posts;

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
    if (!accessToken) { toast.warning('Login to upvote'); return; }
    try {
      await fetch(`${API_URL}/posts/${postId}/upvote`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      fetchPosts();
    } catch { toast.error('Failed to upvote'); }
  }

  async function handleComment(postId, text) {
    if (!accessToken || !text.trim()) return;
    try {
      await fetch(`${API_URL}/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ text }),
      });
      toast.success('Comment added');
      fetchPosts();
    } catch { toast.error('Failed to comment'); }
  }

  async function handleDeletePost(postId) {
    if (!confirm('Delete this post?')) return;
    try {
      const res = await fetch(`${API_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) { toast.success('Post deleted'); fetchPosts(); }
      else toast.error('Cannot delete this post');
    } catch { toast.error('Network error'); }
  }

  async function handleBookmark(postId) {
    if (!accessToken) { toast.warning('Login to bookmark'); return; }
    try {
      const res = await fetch(`${API_URL}/users/bookmarks/${postId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const json = await res.json();
        toast.success(json.isBookmarked ? 'Saved to bookmarks' : 'Removed from bookmarks');
      }
    } catch { toast.error('Failed to bookmark'); }
  }

  async function handlePinPost(postId) {
    if (!accessToken) { toast.warning('Login to pin'); return; }
    try {
      const res = await fetch(`${API_URL}/posts/${postId}/pin`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const json = await res.json();
        toast.success(json.isPinned ? 'Post pinned!' : 'Post unpinned');
        fetchPosts();
      }
    } catch { toast.error('Failed to pin'); }
  }

  async function handleReplyComment(postId, commentId, text) {
    if (!accessToken || !text.trim()) return;
    try {
      const res = await fetch(`${API_URL}/posts/${postId}/comments/${commentId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ text }),
      });
      if (res.ok) { toast.success('Reply added'); fetchPosts(); }
    } catch { toast.error('Failed to reply'); }
  }

  async function handleReactComment(postId, commentId, emoji) {
    if (!accessToken) { toast.warning('Login to react'); return; }
    try {
      await fetch(`${API_URL}/posts/${postId}/comments/${commentId}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ emoji }),
      });
      fetchPosts();
    } catch { toast.error('Failed to react'); }
  }

  async function handleEditComment(postId, commentId, text) {
    if (!accessToken || !text.trim()) return;
    try {
      const res = await fetch(`${API_URL}/posts/${postId}/comments/${commentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ text }),
      });
      if (res.ok) { toast.success('Comment updated'); fetchPosts(); }
    } catch { toast.error('Failed to edit'); }
  }

  async function handleDeleteComment(postId, commentId) {
    if (!confirm('Delete this comment?')) return;
    try {
      const res = await fetch(`${API_URL}/posts/${postId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) { toast.success('Comment deleted'); fetchPosts(); }
    } catch { toast.error('Failed to delete'); }
  }

  async function handlePinComment(postId, commentId) {
    if (!accessToken) return;
    try {
      const res = await fetch(`${API_URL}/posts/${postId}/comments/${commentId}/pin`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) { toast.success('Comment pin toggled'); fetchPosts(); }
    } catch { toast.error('Failed to pin comment'); }
  }

  async function handleVotePoll(postId, pollId, optionIndex) {
    if (!accessToken) { toast.warning('Login to vote'); return; }
    try {
      const res = await fetch(`${API_URL}/posts/${postId}/polls/${pollId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ optionIndex }),
      });
      if (res.ok) { toast.success('Vote recorded!'); fetchPosts(); }
    } catch { toast.error('Failed to vote'); }
  }

  async function handleCreatePost(e) {
    e.preventDefault();
    if (!accessToken || !newPost.title || !newPost.content) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', newPost.title);
      formData.append('content', newPost.content);
      formData.append('category', newPost.category);
      
      // If there's a file, append it
      if (imagePreview && imagePreview.file) {
        formData.append('image', imagePreview.file);
      }

      const res = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });
      
      if (res.ok) {
        setShowComposer(false);
        setNewPost({ title: '', content: '', category: 'General', image: '' });
        setImagePreview(null);
        toast.success('Post published!');
        fetchPosts();
      } else {
        const error = await res.json();
        toast.error(error.message || 'Failed to publish post');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setUploading(false);
    }
  }

  function handleImageSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      toast.error('Only JPEG, PNG, GIF, and WebP images are allowed');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview({
        file,
        preview: e.target.result,
      });
    };
    reader.readAsDataURL(file);
  }

  function clearImagePreview() {
    setImagePreview(null);
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

          {/* Search */}
          <div className={styles.searchBar}>
            <UserSearch />
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
                    
                    <RichTextEditor 
                      value={newPost.content}
                      onChange={(content) => setNewPost({ ...newPost, content })}
                      placeholder="Share your thoughts, recipes, or sustainability tips... Use #hashtags and @mentions"
                    />
                    
                    {/* Image Preview */}
                    {imagePreview && (
                      <div className={styles.imagePreviewContainer}>
                        <img src={imagePreview.preview} alt="Preview" className={styles.imagePreview} />
                        <button type="button" className={styles.removeImageBtn} onClick={clearImagePreview}><FiX /></button>
                      </div>
                    )}

                    {/* Hidden file input */}
                    <input
                      type="file"
                      id="imageInput"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleImageSelect}
                      style={{ display: 'none' }}
                    />

                    <div className={styles.composerFooter}>
                      <div className={styles.composerTools}>
                        <select value={newPost.category} onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}>
                          <option>General</option><option>Sustainability</option><option>Fitness</option><option>Student Life</option><option>Climate</option><option>Nutrition</option><option>Recipes</option>
                        </select>
                        <button type="button" className={styles.toolBtn} onClick={() => document.getElementById('imageInput').click()}><FiImage /></button>
                      </div>
                      <button type="submit" className={styles.publishBtn} disabled={uploading}><FiSend /> {uploading ? 'Publishing...' : 'Publish'}</button>
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
              {[1, 2, 3].map((i) => (
                <div key={i} className={styles.skeleton}>
                  <div className={styles.skeletonHeader}><div className={styles.skeletonAvatar} /><div className={styles.skeletonLines}><div className={styles.skeletonLine} /><div className={styles.skeletonLineShort} /></div></div>
                  <div className={styles.skeletonBody}><div className={styles.skeletonLine} /><div className={styles.skeletonLine} /><div className={styles.skeletonLineShort} /></div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <motion.div className={styles.emptyState} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <FaSeedling className={styles.emptyIcon} />
              <h3>No posts yet</h3>
              <p>Every movement begins with one voice. Share your sustainable journey with the community.</p>
              {isAuthenticated && <button className="btn btn-primary" onClick={() => setShowComposer(true)}>Create First Post</button>}
            </motion.div>
          ) : (
            <div className={styles.feed}>
              {filteredPosts.map((post, idx) => (
                <PostCard 
                  key={post._id} 
                  post={post} 
                  idx={idx} 
                  user={user} 
                  onUpvote={handleUpvote} 
                  onComment={handleComment} 
                  onDelete={handleDeletePost}
                  onBookmark={handleBookmark}
                  onPin={handlePinPost}
                  onReply={handleReplyComment}
                  onReact={handleReactComment}
                  onEditComment={handleEditComment}
                  onDeleteComment={handleDeleteComment}
                  onPinComment={handlePinComment}
                  onVotePoll={handleVotePoll}
                  accessToken={accessToken}
                />
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

function PostCard({ post, idx, user, onUpvote, onComment, onDelete, onBookmark, onPin, onReply, onReact, onEditComment, onDeleteComment, onPinComment, onVotePoll, accessToken }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showReactions, setShowReactions] = useState(null);
  const hasUpvoted = user && post.upvotes?.includes(user.id);
  const isPinned = post.pinnedBy?.includes(user?.id);

  const COMMENT_REACTIONS = ['👍', '❤️', '🌱', '🔥', '😂', '👏'];

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onComment(post._id, commentText);
    setCommentText('');
  };

  const handleSubmitReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !replyingTo) return;
    onReply(post._id, replyingTo, replyText);
    setReplyText('');
    setReplyingTo(null);
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    if (!editText.trim() || !editingComment) return;
    onEditComment(post._id, editingComment, editText);
    setEditText('');
    setEditingComment(null);
  };

  const shareUrl = `${window.location.origin}/community#post-${post._id}`;
  const shareText = `${post.title} - VeganLife Community`;

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
  };

  // Sort comments: pinned first
  const sortedComments = [...(post.comments || [])].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  return (
    <motion.article
      className={styles.postCard}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: idx * 0.05 }}
      id={`post-${post._id}`}
    >
      <div className={styles.postHeader}>
        <div className={styles.postAuthor}>
          <Link to={`/profile/${post.author?.username}`} className={styles.postAvatar}>
            {post.author?.name?.charAt(0) || '?'}
          </Link>
          <div>
            <Link to={`/profile/${post.author?.username}`} className={styles.postAuthorName}>
              {post.author?.name || 'Anonymous'}
            </Link>
            <span className={styles.postTime}>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
        <div className={styles.postHeaderActions}>
          {post.isPinned && <span className={styles.pinnedBadge}><FiMapPin /> Pinned</span>}
          <span className={styles.postCategory}>{post.category}</span>
          {user && (post.author?._id === user.id || user.role === 'admin') && (
            <button className={styles.postDeleteBtn} onClick={() => onDelete(post._id)}><FiTrash2 /></button>
          )}
        </div>
      </div>

      <h3 className={styles.postTitle}>{post.title}</h3>
      <p className={styles.postContent}>{post.content}</p>

      {/* Hashtags */}
      {post.hashtags && post.hashtags.length > 0 && (
        <div className={styles.hashtagsContainer}>
          {post.hashtags.map(tag => (
            <Link key={tag} to={`/hashtag/${tag}`} className={styles.hashtag}>
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {/* Image */}
      {post.image && (
        <div className={styles.postImageContainer}>
          <img src={post.image} alt={post.title} className={styles.postImage} />
        </div>
      )}

      {/* Polls */}
      {post.polls && post.polls.length > 0 && (
        <div className={styles.pollsContainer}>
          {post.polls.map((poll) => (
            <PollWidget key={poll._id} poll={poll} postId={post._id} user={user} onVote={onVotePoll} />
          ))}
        </div>
      )}

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
        {post.pinnedBy?.length > 0 && (
          <span className={styles.pinCount}><FiMapPin /> {post.pinnedBy.length}</span>
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
        <div className={styles.shareWrapper}>
          <button className={styles.actionBtn} onClick={() => setShowShareMenu(!showShareMenu)}>
            <FiShare2 /> <span>Share</span>
          </button>
          {showShareMenu && (
            <div className={styles.shareMenu}>
              <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className={styles.shareLink}>
                <FaXTwitter /> Twitter
              </a>
              <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className={styles.shareLink}>
                <FaFacebook /> Facebook
              </a>
              <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className={styles.shareLink}>
                <FaWhatsapp /> WhatsApp
              </a>
              <button className={styles.shareLink} onClick={() => { navigator.clipboard.writeText(shareUrl); setShowShareMenu(false); }}>
                📋 Copy Link
              </button>
            </div>
          )}
        </div>
        <button className={`${styles.actionBtn} ${isPinned ? styles.actionActive : ''}`} onClick={() => onPin(post._id)}>
          <FiMapPin /> <span>Pin</span>
        </button>
        <button className={styles.actionBtn} onClick={() => onBookmark(post._id)}>
          <FiBookmark /> <span>Save</span>
        </button>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div className={styles.commentsSection} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            {sortedComments.map((c) => (
              <div key={c._id} className={`${styles.comment} ${c.isPinned ? styles.pinnedComment : ''}`}>
                {c.isPinned && <div className={styles.pinnedLabel}><FiMapPin /> Pinned</div>}
                <div className={styles.commentMain}>
                  <div className={styles.commentAvatar}>{c.user?.name?.charAt(0) || '?'}</div>
                  <div className={styles.commentBody}>
                    {editingComment === c._id ? (
                      <form onSubmit={handleSubmitEdit} className={styles.editForm}>
                        <input value={editText} onChange={(e) => setEditText(e.target.value)} autoFocus />
                        <button type="submit"><FiSend /></button>
                        <button type="button" onClick={() => setEditingComment(null)}><FiX /></button>
                      </form>
                    ) : (
                      <>
                        <strong>{c.user?.name || 'User'}</strong>
                        <p>{c.text}</p>
                      </>
                    )}

                    {/* Comment Reactions */}
                    {c.reactions && c.reactions.length > 0 && (
                      <div className={styles.commentReactions}>
                        {Object.entries(c.reactions.reduce((acc, r) => {
                          acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                          return acc;
                        }, {})).map(([emoji, count]) => (
                          <span key={emoji} className={styles.reactionChip}>{emoji} {count}</span>
                        ))}
                      </div>
                    )}

                    {/* Comment Actions */}
                    <div className={styles.commentActions}>
                      <button onClick={() => { setReplyingTo(c._id); setReplyText(''); }}><FiCornerDownRight /> Reply</button>
                      <button onClick={() => setShowReactions(showReactions === c._id ? null : c._id)}>😊 React</button>
                      {user && c.user?._id === user.id && (
                        <>
                          <button onClick={() => { setEditingComment(c._id); setEditText(c.text); }}><FiEdit2 /> Edit</button>
                          <button onClick={() => onDeleteComment(post._id, c._id)}><FiTrash2 /> Delete</button>
                        </>
                      )}
                      {user && (post.author?._id === user.id || user.role === 'admin') && (
                        <button onClick={() => onPinComment(post._id, c._id)}><FiMapPin /> {c.isPinned ? 'Unpin' : 'Pin'}</button>
                      )}
                    </div>

                    {/* Reaction Picker */}
                    {showReactions === c._id && (
                      <div className={styles.reactionPicker}>
                        {COMMENT_REACTIONS.map(emoji => (
                          <button key={emoji} onClick={() => { onReact(post._id, c._id, emoji); setShowReactions(null); }}>
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Reply Form */}
                    {replyingTo === c._id && (
                      <form onSubmit={handleSubmitReply} className={styles.replyForm}>
                        <input placeholder={`Reply to ${c.user?.name}...`} value={replyText} onChange={(e) => setReplyText(e.target.value)} autoFocus />
                        <button type="submit" disabled={!replyText.trim()}><FiSend /></button>
                        <button type="button" onClick={() => setReplyingTo(null)}><FiX /></button>
                      </form>
                    )}

                    {/* Nested Replies */}
                    {c.replies && c.replies.length > 0 && (
                      <div className={styles.replies}>
                        {c.replies.map((reply, rIdx) => (
                          <div key={rIdx} className={styles.reply}>
                            <div className={styles.replyAvatar}>{reply.user?.name?.charAt(0) || '?'}</div>
                            <div className={styles.replyBody}>
                              <strong>{reply.user?.name || 'User'}</strong>
                              <p>{reply.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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

function PollWidget({ poll, postId, user, onVote }) {
  const totalVotes = poll.options.reduce((sum, opt) => sum + (opt.votes?.length || 0), 0);
  const userVotedIndex = user ? poll.options.findIndex(opt => opt.votes?.includes(user.id)) : -1;

  return (
    <div className={styles.poll}>
      <div className={styles.pollHeader}>
        <FiBarChart2 />
        <span className={styles.pollQuestion}>{poll.question}</span>
      </div>
      <div className={styles.pollOptions}>
        {poll.options.map((option, idx) => {
          const voteCount = option.votes?.length || 0;
          const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
          const isSelected = userVotedIndex === idx;

          return (
            <button
              key={option._id || idx}
              className={`${styles.pollOption} ${isSelected ? styles.pollOptionSelected : ''}`}
              onClick={() => onVote(postId, poll._id, idx)}
            >
              <div className={styles.pollBar} style={{ width: `${percentage}%` }} />
              <span className={styles.pollOptionText}>{option.text}</span>
              <span className={styles.pollOptionPercent}>{percentage}%</span>
            </button>
          );
        })}
      </div>
      <div className={styles.pollMeta}>{totalVotes} vote{totalVotes !== 1 ? 's' : ''}</div>
    </div>
  );
}
