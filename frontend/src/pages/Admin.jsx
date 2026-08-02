import { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGrid, FiFileText, FiUsers, FiMessageSquare, FiSearch, FiTrash2,
  FiCheck, FiX, FiShield, FiUserX, FiAlertTriangle, FiMessageCircle,
  FiArrowUp, FiClock, FiUser, FiFlag,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import BackButton from '../components/ui/BackButton';
import { apiFetch } from '../utils/api';
import { resolveIcon } from '../utils/iconMap';
import styles from './Admin.module.css';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: <FiGrid /> },
  { id: 'posts', label: 'Posts', icon: <FiFileText /> },
  { id: 'comments', label: 'Comments', icon: <FiMessageCircle /> },
  { id: 'reports', label: 'Reports', icon: <FiFlag /> },
  { id: 'users', label: 'Users', icon: <FiUsers /> },
  { id: 'rooms', label: 'Rooms', icon: <FiMessageSquare /> },
];

const REPORT_FILTERS = ['open', 'dismissed', 'actioned'];

const POST_FILTERS = ['pending', 'approved', 'rejected', 'all'];

// Admin stats must be accurate at a glance — render the raw value instead of a
// viewport-triggered count-up (which can linger at 0 for below-the-fold cards).
function StatNumber({ value }) {
  return <span className={styles.statNum}>{value}</span>;
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Admin() {
  const { user, isAdmin } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('dashboard');

  // Dashboard
  const [stats, setStats] = useState(null);

  // Posts
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postFilter, setPostFilter] = useState('pending');
  const [postSearch, setPostSearch] = useState('');

  // Users
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [usersPage, setUsersPage] = useState(1);
  const [usersPagination, setUsersPagination] = useState(null);

  // Rooms
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);

  // Comments
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentSearch, setCommentSearch] = useState('');
  const [commentSearchTerm, setCommentSearchTerm] = useState('');
  const [commentsPage, setCommentsPage] = useState(1);
  const [commentsPagination, setCommentsPagination] = useState(null);

  // Reports
  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsFilter, setReportsFilter] = useState('open');
  const [reportsPage, setReportsPage] = useState(1);
  const [reportsPagination, setReportsPagination] = useState(null);

  // Destructive-action confirm dialog
  const [confirm, setConfirm] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await apiFetch('/admin/stats');
      if (res.ok) setStats((await res.json()).data);
    } catch {}
  }, []);

  const fetchPosts = useCallback(async () => {
    setPostsLoading(true);
    try {
      const res = await apiFetch('/posts/admin/all');
      if (res.ok) setPosts((await res.json()).data || []);
    } catch {}
    finally { setPostsLoading(false); }
  }, []);

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const params = new URLSearchParams({ page: String(usersPage), limit: '10' });
      if (userSearchTerm) params.set('q', userSearchTerm);
      const res = await apiFetch(`/admin/users?${params}`);
      if (res.ok) {
        const json = await res.json();
        setUsers(json.data || []);
        setUsersPagination(json.pagination);
      }
    } catch {}
    finally { setUsersLoading(false); }
  }, [usersPage, userSearchTerm]);

  const fetchRooms = useCallback(async () => {
    setRoomsLoading(true);
    try {
      const res = await apiFetch('/admin/rooms');
      if (res.ok) setRooms((await res.json()).data || []);
    } catch {}
    finally { setRoomsLoading(false); }
  }, []);

  const fetchComments = useCallback(async () => {
    setCommentsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(commentsPage), limit: '20' });
      if (commentSearchTerm) params.set('q', commentSearchTerm);
      const res = await apiFetch(`/admin/comments?${params}`);
      if (res.ok) {
        const json = await res.json();
        setComments(json.data || []);
        setCommentsPagination(json.pagination);
      }
    } catch {}
    finally { setCommentsLoading(false); }
  }, [commentsPage, commentSearchTerm]);

  const fetchReports = useCallback(async () => {
    setReportsLoading(true);
    try {
      const params = new URLSearchParams({ status: reportsFilter, page: String(reportsPage), limit: '10' });
      const res = await apiFetch(`/admin/reports?${params}`);
      if (res.ok) {
        const json = await res.json();
        setReports(json.data || []);
        setReportsPagination(json.pagination);
      }
    } catch {}
    finally { setReportsLoading(false); }
  }, [reportsFilter, reportsPage]);

  // Boot: stats + posts feed the dashboard and posts tabs
  useEffect(() => {
    if (!isAdmin) return;
    fetchStats();
    fetchPosts();
  }, [isAdmin, fetchStats, fetchPosts]);

  // Debounce user search and reset to page 1
  useEffect(() => {
    const t = setTimeout(() => {
      setUserSearchTerm(userSearch);
      setUsersPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [userSearch]);

  // Users list loads when the tab is active
  useEffect(() => {
    if (!isAdmin || activeTab !== 'users') return;
    fetchUsers();
  }, [activeTab, isAdmin, fetchUsers]);

  // Rooms list loads when the tab is active
  useEffect(() => {
    if (!isAdmin || activeTab !== 'rooms') return;
    fetchRooms();
  }, [activeTab, isAdmin, fetchRooms]);

  // Debounce comment search and reset to page 1
  useEffect(() => {
    const t = setTimeout(() => {
      setCommentSearchTerm(commentSearch);
      setCommentsPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [commentSearch]);

  // Comments list loads when the tab is active
  useEffect(() => {
    if (!isAdmin || activeTab !== 'comments') return;
    fetchComments();
  }, [activeTab, isAdmin, fetchComments]);

  // Reports list loads when the tab is active (re-fetches on filter/page change)
  useEffect(() => {
    if (!isAdmin || activeTab !== 'reports') return;
    fetchReports();
  }, [activeTab, isAdmin, fetchReports]);

  const askConfirm = (title, message, onConfirm) => setConfirm({ title, message, onConfirm });

  // ——— Post actions ———
  async function setPostStatus(id, status, label) {
    try {
      const res = await apiFetch(`/posts/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error((await res.json()).message || `Failed to ${label.toLowerCase()}`);
      toast.success(`Post ${label.toLowerCase()}`);
      fetchPosts(); fetchStats();
    } catch (err) { toast.error(err.message); }
  }

  function deletePost(post) {
    askConfirm(
      'Delete post?',
      `"${post.title}" by ${post.author?.name || 'Unknown'} and all of its comments and votes will be permanently removed. This cannot be undone.`,
      async () => {
        try {
          const res = await apiFetch(`/posts/${post._id}`, { method: 'DELETE' });
          if (!res.ok) throw new Error((await res.json()).message || 'Failed to delete post');
          toast.success('Post deleted');
          fetchPosts(); fetchStats();
        } catch (err) { toast.error(err.message); }
      },
    );
  }

  // ——— User actions ———
  async function setUserRole(target, role) {
    try {
      const res = await apiFetch(`/admin/users/${target._id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to update role');
      toast.success(role === 'admin' ? `${target.name} is now an admin` : `${target.name} is no longer an admin`);
      fetchUsers(); fetchStats();
    } catch (err) { toast.error(err.message); }
  }

  function deleteUser(target) {
    askConfirm(
      'Delete user?',
      `${target.name} (@${target.username}) and ALL of their data will be permanently removed: posts, comments, votes, chat messages, and social connections. This cannot be undone.`,
      async () => {
        try {
          const res = await apiFetch(`/admin/users/${target._id}`, { method: 'DELETE' });
          if (!res.ok) throw new Error((await res.json()).message || 'Failed to delete user');
          toast.success(`${target.name} deleted`);
          fetchUsers(); fetchStats(); fetchPosts();
        } catch (err) { toast.error(err.message); }
      },
    );
  }

  // ——— Report actions ———
  async function setReportStatus(report, status) {
    try {
      const res = await apiFetch(`/admin/reports/${report._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to update report');
      toast.success(status === 'dismissed' ? 'Report dismissed' : 'Report actioned');
      fetchReports(); fetchStats();
    } catch (err) { toast.error(err.message); }
  }

  // ——— Room actions ———
  function deleteRoom(room) {
    askConfirm(
      'Delete room?',
      `The "#${room.name}" channel and all of its ${room.messageCount || 0} messages will be permanently removed.`,
      async () => {
        try {
          const res = await apiFetch(`/admin/rooms/${room._id}`, { method: 'DELETE' });
          if (!res.ok) throw new Error((await res.json()).message || 'Failed to delete room');
          toast.success('Room deleted');
          fetchRooms(); fetchStats();
        } catch (err) { toast.error(err.message); }
      },
    );
  }

  // ——— Comment actions ———
  function deleteComment(comment) {
    const author = comment.user?.name || 'Unknown';
    const postTitle = comment.post?.title ? `"${comment.post.title}"` : 'a deleted post';
    askConfirm(
      'Delete comment?',
      `The comment by ${author} on ${postTitle} and all of its replies will be permanently removed. This cannot be undone.`,
      async () => {
        try {
          const res = await apiFetch(`/admin/comments/${comment._id}`, { method: 'DELETE' });
          if (!res.ok) throw new Error((await res.json()).message || 'Failed to delete comment');
          toast.success('Comment deleted');
          fetchComments(); fetchStats();
        } catch (err) { toast.error(err.message); }
      },
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  const pendingPosts = posts.filter((p) => p.status === 'pending');
  const filteredPosts = posts.filter((p) => {
    const matchesStatus = postFilter === 'all' || p.status === postFilter;
    if (!matchesStatus) return false;
    const q = postSearch.toLowerCase();
    if (!q) return true;
    return (
      p.title?.toLowerCase().includes(q)
      || p.content?.toLowerCase().includes(q)
      || p.author?.name?.toLowerCase().includes(q)
      || p.author?.username?.toLowerCase().includes(q)
    );
  });

  return (
    <section className={styles.section}>
      <BackButton />
      <div className={styles.container}>
        <motion.div className={styles.header} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <h1 className={styles.title}>Admin Panel</h1>
          <p className={styles.subtitle}>Moderate posts, manage users, and keep the community healthy.</p>
        </motion.div>

        {/* Tabs */}
        <div className={styles.tabs} role="tablist" aria-label="Admin sections">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className={styles.panel}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {activeTab === 'dashboard' && (
                <DashboardTab stats={stats} pendingPosts={pendingPosts} postsLoading={postsLoading}
                  onApprove={(id) => setPostStatus(id, 'approved', 'Approved')}
                  onReject={(id) => setPostStatus(id, 'rejected', 'Rejected')}
                />
              )}

              {activeTab === 'posts' && (
                <PostsTab
                  posts={filteredPosts}
                  loading={postsLoading}
                  filter={postFilter}
                  setFilter={setPostFilter}
                  search={postSearch}
                  setSearch={setPostSearch}
                  onApprove={(id) => setPostStatus(id, 'approved', 'Approved')}
                  onReject={(id) => setPostStatus(id, 'rejected', 'Rejected')}
                  onDelete={deletePost}
                />
              )}

              {activeTab === 'comments' && (
                <CommentsTab
                  comments={comments}
                  loading={commentsLoading}
                  search={commentSearch}
                  setSearch={setCommentSearch}
                  pagination={commentsPagination}
                  onPageChange={setCommentsPage}
                  onDelete={deleteComment}
                />
              )}

              {activeTab === 'reports' && (
                <ReportsTab
                  reports={reports}
                  loading={reportsLoading}
                  filter={reportsFilter}
                  setFilter={(f) => { setReportsFilter(f); setReportsPage(1); }}
                  pagination={reportsPagination}
                  onPageChange={setReportsPage}
                  onStatus={setReportStatus}
                />
              )}

              {activeTab === 'users' && (
                <UsersTab
                  users={users}
                  loading={usersLoading}
                  currentUser={user}
                  search={userSearch}
                  setSearch={setUserSearch}
                  pagination={usersPagination}
                  onPageChange={setUsersPage}
                  onRoleChange={setUserRole}
                  onDelete={deleteUser}
                />
              )}

              {activeTab === 'rooms' && (
                <RoomsTab rooms={rooms} loading={roomsLoading} onDelete={deleteRoom} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Confirm modal */}
      <AnimatePresence>
        {confirm && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirm(null)}
          >
            <motion.div
              className={styles.confirmModal}
              initial={{ y: 24, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 24, opacity: 0, scale: 0.96 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              role="alertdialog"
              aria-modal="true"
              aria-label={confirm.title}
            >
              <div className={styles.confirmIcon}><FiAlertTriangle /></div>
              <h3 className={styles.confirmTitle}>{confirm.title}</h3>
              <p className={styles.confirmText}>{confirm.message}</p>
              <div className={styles.confirmActions}>
                <button className={styles.cancelBtn} onClick={() => setConfirm(null)}>Cancel</button>
                <button
                  className={styles.confirmBtn}
                  onClick={() => { const fn = confirm.onConfirm; setConfirm(null); fn(); }}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ————— Dashboard ————— */
function DashboardTab({ stats, pendingPosts, postsLoading, onApprove, onReject }) {
  const cards = stats ? [
    { label: 'Users', value: stats.users, icon: <FiUsers /> },
    { label: 'Total Posts', value: stats.posts, icon: <FiFileText /> },
    { label: 'Pending', value: stats.pending, icon: <FiClock /> },
    { label: 'Approved', value: stats.approved, icon: <FiCheck /> },
    { label: 'Rejected', value: stats.rejected, icon: <FiX /> },
    { label: 'Comments', value: stats.comments, icon: <FiMessageCircle /> },
    { label: 'Rooms', value: stats.rooms, icon: <FiMessageSquare /> },
    { label: 'Messages', value: stats.messages, icon: <FiMessageCircle /> },
    { label: 'Open Reports', value: stats.openReports, icon: <FiFlag /> },
  ] : [];

  return (
    <div>
      {!stats ? (
        <p className={styles.loading}>Loading stats…</p>
      ) : (
        <div className={styles.statsGrid}>
          {cards.map((c, idx) => (
            <motion.div
              key={c.label}
              className={styles.statCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              whileHover={{ y: -5 }}
            >
              <div className={styles.statIcon}>{c.icon}</div>
              <StatNumber value={c.value} />
              <span className={styles.statLabel}>{c.label}</span>
            </motion.div>
          ))}
        </div>
      )}

      <div className={styles.recentHeader}>
        <h2 className={styles.recentTitle}>Pending Review</h2>
      </div>
      {postsLoading ? (
        <p className={styles.loading}>Loading…</p>
      ) : pendingPosts.length === 0 ? (
        <p className={styles.empty}>No posts awaiting review. 🎉</p>
      ) : (
        <div className={styles.recentList}>
          {pendingPosts.slice(0, 5).map((post) => (
            <div key={post._id} className={`glass-card ${styles.recentItem}`}>
              <div className={styles.recentBody}>
                <h4 className={styles.postTitle}>{post.title}</h4>
                <p className={styles.postMeta}>
                  by {post.author?.name || 'Unknown'} · {post.category} · {formatDate(post.createdAt)}
                </p>
              </div>
              <div className={styles.recentActions}>
                <button className={styles.approveBtn} onClick={() => onApprove(post._id)}><FiCheck /> Approve</button>
                <button className={styles.rejectBtn} onClick={() => onReject(post._id)}><FiX /> Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ————— Posts ————— */
function PostsTab({ posts, loading, filter, setFilter, search, setSearch, onApprove, onReject, onDelete }) {
  return (
    <div>
      <div className={styles.toolbar}>
        <div className={styles.searchBar}>
          <FiSearch className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search posts by title, content, or author…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.filters}>
          {POST_FILTERS.map((f) => (
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
      </div>

      {loading ? (
        <p className={styles.loading}>Loading posts…</p>
      ) : posts.length === 0 ? (
        <p className={styles.empty}>No posts match this filter.</p>
      ) : (
        <div className={styles.postList}>
          {posts.map((post, idx) => (
            <motion.div
              key={post._id}
              className={`glass-card ${styles.postItem}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(idx * 0.03, 0.3) }}
            >
              <div className={styles.postHeader}>
                <div>
                  <h3 className={styles.postTitle}>{post.title}</h3>
                  <p className={styles.postMeta}>
                    by {post.author?.name || 'Unknown'} (@{post.author?.username || '?'}) · {post.category} · {formatDate(post.createdAt)}
                  </p>
                </div>
                <span className={`${styles.statusBadge} ${styles[post.status] || ''}`}>{post.status}</span>
              </div>
              <p className={styles.postContent}>
                {post.content?.slice(0, 220)}{post.content?.length > 220 ? '…' : ''}
              </p>
              {post.image && (
                <a href={post.image} target="_blank" rel="noopener noreferrer" className={styles.postImageLink}>
                  <img src={post.image} alt="" className={styles.postThumb} />
                </a>
              )}
              <div className={styles.postStats}>
                <span><FiArrowUp /> {post.upvoteCount || 0}</span>
                <span><FiMessageCircle /> {post.commentCount || 0}</span>
                <span>{post.hashtags?.length ? post.hashtags.map((t) => `#${t}`).join(' ') : ''}</span>
              </div>
              <div className={styles.actions}>
                {post.status === 'pending' && (
                  <>
                    <button className={styles.approveBtn} onClick={() => onApprove(post._id)}><FiCheck /> Approve</button>
                    <button className={styles.rejectBtn} onClick={() => onReject(post._id)}><FiX /> Reject</button>
                  </>
                )}
                <button className={styles.deleteBtn} onClick={() => onDelete(post)}><FiTrash2 /> Delete</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ————— Comments ————— */
function CommentsTab({ comments, loading, search, setSearch, pagination, onPageChange, onDelete }) {
  return (
    <div>
      <div className={styles.toolbar}>
        <div className={styles.searchBar}>
          <FiSearch className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search comments by text, author, or post…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p className={styles.loading}>Loading comments…</p>
      ) : comments.length === 0 ? (
        <p className={styles.empty}>No comments found.</p>
      ) : (
        <div className={styles.commentList}>
          {comments.map((c, idx) => (
            <motion.div
              key={c._id}
              className={`glass-card ${styles.commentItem}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(idx * 0.03, 0.3) }}
            >
              <div className={styles.commentAvatar}>
                {c.user?.avatar ? <img src={c.user.avatar} alt="" /> : <span>{c.user?.name?.charAt(0) || '?'}</span>}
              </div>
              <div className={styles.commentInfo}>
                <div className={styles.commentHeader}>
                  <span className={styles.commentAuthor}>{c.user?.name || 'Unknown'}</span>
                  <span className={styles.commentUser}>@{c.user?.username || '?'}</span>
                  {c.parent && <span className={styles.replyBadge}>Reply</span>}
                  <span className={styles.commentDate}>{formatDate(c.createdAt)}</span>
                </div>
                <p className={styles.commentText}>{c.text}</p>
                <p className={styles.commentOn}>
                  on “{c.post?.title || 'deleted post'}”
                </p>
              </div>
              <div className={styles.commentActions}>
                <button className={styles.deleteBtn} onClick={() => onDelete(c)}><FiTrash2 /> Delete</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Pagination pagination={pagination} onPageChange={onPageChange} />
    </div>
  );
}

/* ————— Shared pagination ————— */
function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.pages <= 1) return null;
  return (
    <div className={styles.pagination}>
      <button
        className={styles.pageBtn}
        disabled={pagination.page <= 1}
        onClick={() => onPageChange(pagination.page - 1)}
      >
        ← Prev
      </button>
      <span className={styles.pageInfo}>Page {pagination.page} of {pagination.pages}</span>
      <button
        className={styles.pageBtn}
        disabled={pagination.page >= pagination.pages}
        onClick={() => onPageChange(pagination.page + 1)}
      >
        Next →
      </button>
    </div>
  );
}

/* ————— Reports ————— */
function ReportsTab({ reports, loading, filter, setFilter, pagination, onPageChange, onStatus }) {
  return (
    <div>
      <div className={styles.toolbar}>
        <div className={styles.filters}>
          {REPORT_FILTERS.map((f) => (
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
      </div>

      {loading ? (
        <p className={styles.loading}>Loading reports…</p>
      ) : reports.length === 0 ? (
        <p className={styles.empty}>No {filter} reports.</p>
      ) : (
        <div className={styles.reportList}>
          {reports.map((report, idx) => (
            <motion.div
              key={report._id}
              className={`glass-card ${styles.reportItem}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(idx * 0.03, 0.3) }}
            >
              <div className={styles.reportHeader}>
                <div className={styles.reportBadges}>
                  <span className={styles.targetTypeBadge}>{report.targetType}</span>
                  <span className={styles.reasonBadge}>{report.reason}</span>
                  <span className={`${styles.statusBadge} ${styles[`report_${report.status}`] || ''}`}>{report.status}</span>
                </div>
                <span className={styles.reportDate}>{formatDate(report.createdAt)}</span>
              </div>

              <div className={styles.reportBody}>
                <h4 className={styles.reportTitle}>{report.targetTitle || '(untitled)'}</h4>
                {report.targetSnippet && <p className={styles.reportSnippet}>{report.targetSnippet}</p>}
              </div>

              <div className={styles.reportMeta}>
                <span>Reported by @{report.reporter?.username || '?'}</span>
                {report.targetAuthorUsername && <span>against @{report.targetAuthorUsername}</span>}
                {report.resolvedBy && <span>by @{report.resolvedBy.username || '?'}</span>}
              </div>

              {report.details && <p className={styles.reportDetails}>“{report.details}”</p>}

              {report.status !== 'actioned' && (
                <div className={styles.reportActions}>
                  {report.status === 'open' && (
                    <>
                      <button className={styles.dismissBtn} onClick={() => onStatus(report, 'dismissed')}>Dismiss</button>
                      <button className={styles.actionBtn} onClick={() => onStatus(report, 'actioned')}>Actioned</button>
                    </>
                  )}
                  {report.status === 'dismissed' && (
                    <button className={styles.actionBtn} onClick={() => onStatus(report, 'actioned')}>Actioned</button>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <Pagination pagination={pagination} onPageChange={onPageChange} />
    </div>
  );
}

/* ————— Users ————— */
function UsersTab({ users, loading, currentUser, search, setSearch, pagination, onPageChange, onRoleChange, onDelete }) {
  return (
    <div>
      <div className={styles.toolbar}>
        <div className={styles.searchBar}>
          <FiSearch className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search users by name, username, or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p className={styles.loading}>Loading users…</p>
      ) : users.length === 0 ? (
        <p className={styles.empty}>No users found.</p>
      ) : (
        <div className={styles.userList}>
          {users.map((u, idx) => {
            const isSelf = String(u._id) === String(currentUser._id);
            const isAdminUser = u.role === 'admin';
            return (
              <motion.div
                key={u._id}
                className={`glass-card ${styles.userItem}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(idx * 0.03, 0.3) }}
              >
                <div className={styles.userAvatar}>
                  {u.avatar ? <img src={u.avatar} alt="" /> : <span>{u.name?.charAt(0) || '?'}</span>}
                </div>
                <div className={styles.userInfo}>
                  <div className={styles.userNameRow}>
                    <span className={styles.userName}>{u.name}</span>
                    <span className={`${styles.roleBadge} ${isAdminUser ? styles.roleAdmin : ''}`}>
                      {isAdminUser ? 'Admin' : 'Member'}
                    </span>
                  </div>
                  <span className={styles.userMeta}>@{u.username} · {u.email}</span>
                  <span className={styles.userStats}>
                    <span>{u.postCount} posts</span>
                    <span>{u.sustainabilityScore || 0} XP</span>
                    <span>{u.streak || 0} day streak</span>
                    <span>joined {formatDate(u.createdAt)}</span>
                  </span>
                </div>
                <div className={styles.userActions}>
                  {!isSelf && (
                    <>
                      <button
                        className={isAdminUser ? styles.demoteBtn : styles.promoteBtn}
                        onClick={() => onRoleChange(u, isAdminUser ? 'user' : 'admin')}
                        title={isAdminUser ? 'Remove admin' : 'Make admin'}
                      >
                        {isAdminUser ? <FiUserX /> : <FiShield />}
                        {isAdminUser ? 'Remove admin' : 'Make admin'}
                      </button>
                      <button className={styles.deleteBtn} onClick={() => onDelete(u)}>
                        <FiTrash2 /> Delete
                      </button>
                    </>
                  )}
                  {isSelf && <span className={styles.selfNote}><FiUser /> You</span>}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <Pagination pagination={pagination} onPageChange={onPageChange} />
    </div>
  );
}

/* ————— Rooms ————— */
function RoomsTab({ rooms, loading, onDelete }) {
  return (
    <div>
      {loading ? (
        <p className={styles.loading}>Loading rooms…</p>
      ) : rooms.length === 0 ? (
        <p className={styles.empty}>No rooms created yet.</p>
      ) : (
        <div className={styles.roomList}>
          {rooms.map((room, idx) => {
            const Icon = resolveIcon(room.icon);
            return (
              <motion.div
                key={room._id}
                className={`glass-card ${styles.roomItem}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(idx * 0.03, 0.3) }}
              >
                <div className={styles.roomIcon}><Icon /></div>
                <div className={styles.roomInfo}>
                  <div className={styles.roomNameRow}>
                    <span className={styles.roomName}>#{room.name}</span>
                    {!room.isActive && <span className={styles.inactiveBadge}>Inactive</span>}
                    {room.isDefault && <span className={styles.defaultBadge}>Default</span>}
                  </div>
                  <span className={styles.roomMeta}>/{room.slug} · created {formatDate(room.createdAt)}</span>
                  {room.description && <p className={styles.roomDesc}>{room.description}</p>}
                </div>
                <div className={styles.roomMetaCol}>
                  <span className={styles.roomMsgCount}>{room.messageCount || 0} messages</span>
                  <button className={styles.deleteBtn} onClick={() => onDelete(room)}><FiTrash2 /> Delete</button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
