import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiUserPlus, FiUserCheck, FiMail, FiUserX, FiVolumeX, FiFlag } from 'react-icons/fi';
import { FaLeaf, FaSeedling, FaFire } from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { useCounter } from '../hooks';
import BackButton from '../components/ui/BackButton';
import ReportModal from '../components/ui/ReportModal';
import { apiFetch } from '../utils/api';
import styles from './Profile.module.css';

function StatCount({ value }) {
  const { ref, count } = useCounter(String(value));
  return <span className={styles.statValue} ref={ref}>{count}</span>;
}

const BADGES = [
  { level: 0, name: 'Seedling', icon: <FaSeedling style={{ color: '#a6b48f' }} /> },
  { level: 50, name: 'Conscious Eater', icon: <FaLeaf style={{ color: '#8fa67a' }} /> },
  { level: 150, name: 'Eco Warrior', icon: <FaSeedling style={{ color: '#2ecc71' }} /> },
  { level: 300, name: 'Planet Guardian', icon: <FaLeaf style={{ color: '#9d82ab' }} /> },
  { level: 500, name: 'Sustainability Mentor', icon: <FaLeaf style={{ color: '#e3a36e' }} /> },
];

function getUserBadge(score) {
  return [...BADGES].reverse().find((b) => score >= b.level) || BADGES[0];
}

export default function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated, refreshUser } = useAuth();
  const toast = useToast();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [following, setFollowing] = useState(false);
  const [reportingUser, setReportingUser] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [username]);

  async function fetchProfile() {
    setLoading(true);
    try {
      const res = await apiFetch(`/users/profile/${username}`);
      if (res.ok) {
        const json = await res.json();
        setProfile(json.data);
        setIsFollowing(currentUser?.following?.includes(json.data._id) || false);
      } else {
        toast.error('User not found');
        navigate('/community');
      }
    } catch (err) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }

  const isBlocked = currentUser?.blockedUsers?.map(String).includes(String(profile?._id));
  const isMuted = currentUser?.mutedUsers?.map(String).includes(String(profile?._id));

  async function toggleBlock() {
    if (!isAuthenticated) { toast.warning('Login to block users'); return; }
    try {
      const res = await apiFetch(`/users/${profile._id}/block`, { method: 'POST' });
      if (res.ok) {
        toast.success(isBlocked ? `${profile.name} unblocked` : `${profile.name} blocked`);
        await refreshUser();
        setIsFollowing(false);
      }
    } catch (err) { toast.error('Failed to update block status'); }
  }

  async function toggleMute() {
    if (!isAuthenticated) { toast.warning('Login to mute users'); return; }
    try {
      const res = await apiFetch(`/users/${profile._id}/mute`, { method: 'POST' });
      if (res.ok) {
        toast.success(isMuted ? `${profile.name} unmuted` : `${profile.name} muted`);
        await refreshUser();
      }
    } catch (err) { toast.error('Failed to update mute status'); }
  }

  async function handleFollowToggle() {
    if (!isAuthenticated) {
      toast.warning('Login to follow users');
      return;
    }

    setFollowing(true);
    try {
      const res = await apiFetch(`/users/${profile._id}/follow`, { method: 'POST' });

      if (res.ok) {
        const json = await res.json();
        setIsFollowing(json.isFollowing);
        setProfile(prev => ({
          ...prev,
          stats: { ...prev.stats, followers: json.followerCount }
        }));
        toast.success(json.message);
      }
    } catch (err) {
      toast.error('Failed to update follow status');
    } finally {
      setFollowing(false);
    }
  }

  if (loading) {
    return (
      <section className={styles.section}>
        <BackButton />
        <div className={styles.skeleton}>Loading profile...</div>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className={styles.section}>
        <BackButton />
        <div className={styles.notFound}>User not found</div>
      </section>
    );
  }

  const isOwnProfile = currentUser?.username === profile.username;
  const badge = getUserBadge(profile.stats?.score || 0);

  return (
    <section className={styles.section}>
      <BackButton />
      
      <motion.div 
        className={styles.container}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Profile Header */}
        <div className={styles.header}>
          <div className={styles.cover}></div>
          
          <div className={styles.profileContent}>
            <div className={styles.avatarSection}>
              <motion.div
                className={styles.avatar}
                initial={{ scale: 0, rotate: -12 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.15 }}
              >
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} />
                ) : (
                  <span>{profile.name.charAt(0)}</span>
                )}
              </motion.div>
            </div>

            <motion.div
              className={styles.info}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              <div>
                <h1 className={styles.name}>{profile.name}</h1>
                <p className={styles.username}>@{profile.username}</p>
                {profile.bio && <p className={styles.bio}>{profile.bio}</p>}
              </div>

              <div className={styles.actions}>
                {isOwnProfile ? (
                  <button className="btn btn-primary" onClick={() => navigate('/settings/profile')}>
                    Edit Profile
                  </button>
                ) : (
                  <>
                    {!isBlocked && (
                      <button
                        className={`${styles.followBtn} ${isFollowing ? styles.following : ''}`}
                        onClick={handleFollowToggle}
                        disabled={following}
                      >
                        {isFollowing ? (
                          <><FiUserCheck /> Following</>
                        ) : (
                          <><FiUserPlus /> Follow</>
                        )}
                      </button>
                    )}
                    {isBlocked && <span className={styles.blockedChip}><FiUserX /> Blocked</span>}
                    <button className={styles.blockBtn} onClick={toggleBlock}>
                      <FiUserX /> {isBlocked ? 'Unblock' : 'Block'}
                    </button>
                    <button className={styles.muteBtn} onClick={toggleMute}>
                      <FiVolumeX /> {isMuted ? 'Unmute' : 'Mute'}
                    </button>
                    <button className={styles.reportBtn} onClick={() => setReportingUser(true)}>
                      <FiFlag /> Report
                    </button>
                  </>
                )}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              className={styles.stats}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              {[
                { value: profile.stats?.posts || 0, label: 'Posts' },
                { value: profile.stats?.followers || 0, label: 'Followers' },
                { value: profile.stats?.following || 0, label: 'Following' },
                { value: profile.stats?.score || 0, label: 'XP' },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  className={styles.stat}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
                >
                  <StatCount value={s.value} />
                  <span className={styles.statLabel}>{s.label}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Badge */}
            <motion.div
              className={styles.badge}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <span className={styles.badgeIcon}>{badge.icon}</span>
              <span className={styles.badgeName}>{badge.name}</span>
            </motion.div>

            {/* Streak */}
            {profile.streak > 0 && (
              <motion.div
                className={styles.streak}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <FaFire /> {profile.streak} day streak
              </motion.div>
            )}
          </div>
        </div>

        {/* Posts Section */}
        <div className={styles.postsSection}>
          <h2 className={styles.sectionTitle}>Posts</h2>
          
          {profile.posts && profile.posts.length > 0 ? (
            <div className={styles.posts}>
              {profile.posts.map((post, idx) => (
                <motion.article
                  key={post._id}
                  className={styles.postCard}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                >
                  <h3 className={styles.postTitle}>{post.title}</h3>
                  <p className={styles.postContent}>{post.content.substring(0, 150)}...</p>
                  
                  {post.hashtags && post.hashtags.length > 0 && (
                    <div className={styles.hashtags}>
                      {post.hashtags.slice(0, 3).map(tag => (
                        <span key={tag} className={styles.hashtag}>#{tag}</span>
                      ))}
                    </div>
                  )}

                  <div className={styles.postMeta}>
                    <span className={styles.postCategory}>{post.category}</span>
                    <span className={styles.postDate}>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className={styles.noPosts}>
              <FaSeedling className={styles.emptyIcon} />
              <p>No posts yet</p>
            </div>
          )}
        </div>
      </motion.div>

      {reportingUser && (
        <ReportModal targetType="user" targetId={profile._id} onClose={() => setReportingUser(false)} />
      )}
    </section>
  );
}
