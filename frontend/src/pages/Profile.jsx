import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiUserPlus, FiUserCheck, FiMail } from 'react-icons/fi';
import { FaLeaf, FaSeedling, FaFire } from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import BackButton from '../components/ui/BackButton';
import styles from './Profile.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
  const { user: currentUser, accessToken } = useAuth();
  const toast = useToast();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [username]);

  async function fetchProfile() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/users/profile/${username}`);
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

  async function handleFollowToggle() {
    if (!accessToken) {
      toast.warning('Login to follow users');
      return;
    }

    setFollowing(true);
    try {
      const res = await fetch(`${API_URL}/users/${profile._id}/follow`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` }
      });

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
              <div className={styles.avatar}>
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} />
                ) : (
                  <span>{profile.name.charAt(0)}</span>
                )}
              </div>
            </div>

            <div className={styles.info}>
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
                  </>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statValue}>{profile.stats?.posts || 0}</span>
                <span className={styles.statLabel}>Posts</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>{profile.stats?.followers || 0}</span>
                <span className={styles.statLabel}>Followers</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>{profile.stats?.following || 0}</span>
                <span className={styles.statLabel}>Following</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>{profile.stats?.score || 0}</span>
                <span className={styles.statLabel}>XP</span>
              </div>
            </div>

            {/* Badge */}
            <div className={styles.badge}>
              <span className={styles.badgeIcon}>{badge.icon}</span>
              <span className={styles.badgeName}>{badge.name}</span>
            </div>

            {/* Streak */}
            {profile.streak > 0 && (
              <div className={styles.streak}>
                <FaFire /> {profile.streak} day streak
              </div>
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
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
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
    </section>
  );
}
