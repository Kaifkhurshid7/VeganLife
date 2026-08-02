import { useEffect, useRef, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCamera, FiEye, FiEyeOff, FiAtSign, FiUser, FiLock, FiSave, FiKey } from 'react-icons/fi';
import { FaLeaf, FaSeedling } from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { SectionHeader, PasswordStrength } from '../components/ui';
import BackButton from '../components/ui/BackButton';
import styles from './EditProfile.module.css';

const MAX_BIO = 300;

const USERNAME_RE = /^[a-zA-Z0-9_]+$/;
const EMAIL_RE = /\S+@\S+\.\S+/;

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.12 * i, ease: 'easeOut' },
  }),
};

export default function EditProfile() {
  const { user, loading, isAuthenticated, updateProfile, uploadAvatar, changePassword } = useAuth();
  const toast = useToast();
  const fileInputRef = useRef(null);

  // Basic info
  const [profile, setProfile] = useState({ name: '', username: '', bio: '' });
  const [formErrors, setFormErrors] = useState({});

  // Password
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwErrors, setPwErrors] = useState({});

  // Avatar
  const [avatarPreview, setAvatarPreview] = useState('');
  const [uploading, setUploading] = useState(false);

  const [submittingProfile, setSubmittingProfile] = useState(false);
  const [submittingPw, setSubmittingPw] = useState(false);

  // Seed form once the user is available (and whenever it changes)
  useEffect(() => {
    if (user) {
      setProfile({ name: user.name || '', username: user.username || '', bio: user.bio || '' });
      setAvatarPreview(user.avatar || '');
    }
  }, [user]);

  if (loading) {
    return (
      <section className={styles.section}>
        <BackButton />
        <div className={styles.loading}>Loading your profile…</div>
      </section>
    );
  }

  if (!isAuthenticated || !user) return <Navigate to="/auth" replace />;

  /* ---------------- Avatar ---------------- */
  const handleFilePick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file (JPEG, PNG, GIF, WebP)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image is too large — max size is 5MB');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
    setUploading(true);

    try {
      const data = await uploadAvatar(file);
      setAvatarPreview(data.avatar);
      toast.success('Profile photo updated');
    } catch (err) {
      setAvatarPreview(user.avatar || '');
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      URL.revokeObjectURL(previewUrl);
    }
  };

  /* ---------------- Basic info ---------------- */
  const updateField = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: '', server: '' }));
  };

  const validateProfile = () => {
    const errors = {};
    if (!profile.name.trim()) errors.name = 'Name is required';
    else if (profile.name.trim().length > 50) errors.name = 'Name must be at most 50 characters';

    if (!profile.username.trim()) errors.username = 'Username is required';
    else if (profile.username.trim().length < 3) errors.username = 'Username must be 3-20 characters';
    else if (profile.username.trim().length > 20) errors.username = 'Username must be 3-20 characters';
    else if (!USERNAME_RE.test(profile.username.trim())) errors.username = 'Letters, numbers, and underscores only';

    if (profile.bio.length > MAX_BIO) errors.bio = `Bio must be at most ${MAX_BIO} characters`;

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!validateProfile()) return;

    setSubmittingProfile(true);
    try {
      await updateProfile({
        name: profile.name.trim(),
        username: profile.username.trim(),
        bio: profile.bio.trim(),
      });
      toast.success('Profile updated');
    } catch (err) {
      const server = err.fieldErrors || [];
      const mapped = {};
      server.forEach(({ field, message }) => {
        if (['name', 'username', 'bio'].includes(field)) mapped[field] = message;
      });
      if (Object.keys(mapped).length) {
        setFormErrors(mapped);
      } else {
        setFormErrors({ server: err.message });
      }
    } finally {
      setSubmittingProfile(false);
    }
  };

  /* ---------------- Change password ---------------- */
  const updatePwField = (field, value) => {
    setPw((prev) => ({ ...prev, [field]: value }));
    setPwErrors((prev) => ({ ...prev, [field]: '', server: '' }));
  };

  const validatePassword = () => {
    const errors = {};
    if (!pw.currentPassword) errors.currentPassword = 'Current password is required';
    if (!pw.newPassword) errors.newPassword = 'New password is required';
    else if (pw.newPassword.length < 8) errors.newPassword = 'At least 8 characters';
    else if (!/[A-Za-z]/.test(pw.newPassword)) errors.newPassword = 'Must contain a letter';
    else if (!/\d/.test(pw.newPassword)) errors.newPassword = 'Must contain a number';
    if (pw.newPassword !== pw.confirmPassword) errors.confirmPassword = 'Passwords do not match';

    setPwErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setSubmittingPw(true);
    try {
      await changePassword(pw.currentPassword, pw.newPassword);
      toast.success('Password updated');
      setPw({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwErrors({ server: err.message });
    } finally {
      setSubmittingPw(false);
    }
  };

  return (
    <section className={styles.section}>
      <BackButton />
      <motion.div
        className={styles.floatingOrb1}
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className={styles.floatingOrb2}
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className={styles.container}>
        <SectionHeader
          label="Account Settings"
          title="Edit Your Profile"
          description="Shape how the community sees you — your photo, story, and credentials — all in one place."
        />

        <div className={styles.grid}>
          {/* Photo card */}
          <motion.div
            className={`glass-card ${styles.card}`}
            variants={cardVariants}
            initial="hidden"
            animate="show"
            custom={0}
          >
            <div className={styles.cardHeader}>
              <FaLeaf className={styles.cardIcon} />
              <div>
                <h3 className={styles.cardTitle}>Profile Photo</h3>
                <p className={styles.cardSub}>A picture makes your profile friendlier.</p>
              </div>
            </div>

            <div className={styles.avatarWrap}>
              <div className={styles.avatar}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Your profile" />
                ) : (
                  <span>{user.name.charAt(0)}</span>
                )}
                {uploading && <div className={styles.uploadingOverlay}><span className={styles.spinner} /></div>}
              </div>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <FiCamera /> {uploading ? 'Uploading…' : avatarPreview ? 'Change Photo' : 'Upload Photo'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFilePick}
                className={styles.hiddenInput}
              />
              <p className={styles.hint}>JPEG, PNG, GIF or WebP · up to 5MB</p>
            </div>
          </motion.div>

          {/* Basic info card */}
          <motion.form
            className={`glass-card ${styles.card}`}
            variants={cardVariants}
            initial="hidden"
            animate="show"
            custom={1}
            onSubmit={handleSaveProfile}
            noValidate
          >
            <div className={styles.cardHeader}>
              <FaSeedling className={styles.cardIcon} />
              <div>
                <h3 className={styles.cardTitle}>Basic Info</h3>
                <p className={styles.cardSub}>Your display name, username and short bio.</p>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="ep-name" className={styles.label}>Full Name</label>
              <div className={styles.inputGroup}>
                <FiUser className={styles.inputIcon} />
                <input
                  id="ep-name"
                  type="text"
                  value={profile.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  aria-invalid={!!formErrors.name}
                />
              </div>
              {formErrors.name && <span className={styles.fieldError} role="alert">{formErrors.name}</span>}
            </div>

            <div className={styles.field}>
              <label htmlFor="ep-username" className={styles.label}>Username</label>
              <div className={styles.inputGroup}>
                <FiAtSign className={styles.inputIcon} />
                <input
                  id="ep-username"
                  type="text"
                  value={profile.username}
                  onChange={(e) => updateField('username', e.target.value)}
                  aria-invalid={!!formErrors.username}
                />
              </div>
              {formErrors.username && <span className={styles.fieldError} role="alert">{formErrors.username}</span>}
            </div>

            <div className={styles.field}>
              <label htmlFor="ep-bio" className={styles.label}>Bio</label>
              <textarea
                id="ep-bio"
                rows={4}
                maxLength={MAX_BIO}
                value={profile.bio}
                onChange={(e) => updateField('bio', e.target.value)}
                aria-invalid={!!formErrors.bio}
                className={styles.textarea}
                placeholder="Tell the community what drives you…"
              />
              <span className={styles.counter}>{profile.bio.length}/{MAX_BIO}</span>
              {formErrors.bio && <span className={styles.fieldError} role="alert">{formErrors.bio}</span>}
            </div>

            {formErrors.server && <p className={styles.formError} role="alert">{formErrors.server}</p>}

            <button type="submit" className="btn btn-primary" disabled={submittingProfile}>
              <FiSave /> {submittingProfile ? 'Saving…' : 'Save Changes'}
            </button>
          </motion.form>

          {/* Change password card */}
          <motion.form
            className={`glass-card ${styles.card}`}
            variants={cardVariants}
            initial="hidden"
            animate="show"
            custom={2}
            onSubmit={handleChangePassword}
            noValidate
          >
            <div className={styles.cardHeader}>
              <FiKey className={styles.cardIcon} />
              <div>
                <h3 className={styles.cardTitle}>Change Password</h3>
                <p className={styles.cardSub}>Use a strong, unique password for your account.</p>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="ep-current" className={styles.label}>Current Password</label>
              <div className={styles.inputGroup}>
                <FiLock className={styles.inputIcon} />
                <input
                  id="ep-current"
                  type="password"
                  value={pw.currentPassword}
                  onChange={(e) => updatePwField('currentPassword', e.target.value)}
                  aria-invalid={!!pwErrors.currentPassword}
                  autoComplete="current-password"
                />
              </div>
              {pwErrors.currentPassword && <span className={styles.fieldError} role="alert">{pwErrors.currentPassword}</span>}
            </div>

            <div className={styles.field}>
              <label htmlFor="ep-new" className={styles.label}>New Password</label>
              <div className={styles.inputGroup}>
                <FiLock className={styles.inputIcon} />
                <input
                  id="ep-new"
                  type={showNewPw ? 'text' : 'password'}
                  value={pw.newPassword}
                  onChange={(e) => updatePwField('newPassword', e.target.value)}
                  aria-invalid={!!pwErrors.newPassword}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowNewPw((v) => !v)}
                  aria-label={showNewPw ? 'Hide new password' : 'Show new password'}
                >
                  {showNewPw ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {pwErrors.newPassword && <span className={styles.fieldError} role="alert">{pwErrors.newPassword}</span>}
              <div className={styles.strengthWrap}><PasswordStrength password={pw.newPassword} /></div>
            </div>

            <div className={styles.field}>
              <label htmlFor="ep-confirm" className={styles.label}>Confirm New Password</label>
              <div className={styles.inputGroup}>
                <FiLock className={styles.inputIcon} />
                <input
                  id="ep-confirm"
                  type="password"
                  value={pw.confirmPassword}
                  onChange={(e) => updatePwField('confirmPassword', e.target.value)}
                  aria-invalid={!!pwErrors.confirmPassword}
                  autoComplete="new-password"
                />
              </div>
              {pwErrors.confirmPassword && <span className={styles.fieldError} role="alert">{pwErrors.confirmPassword}</span>}
            </div>

            {pwErrors.server && <p className={styles.formError} role="alert">{pwErrors.server}</p>}

            <button type="submit" className="btn btn-primary" disabled={submittingPw}>
              <FiLock /> {submittingPw ? 'Updating…' : 'Update Password'}
            </button>
          </motion.form>
        </div>

        <p className={styles.footerNote}>
          <FaLeaf /> <Link to={`/profile/${user.username}`} className={styles.profileLink}>View your public profile</Link>
        </p>
      </div>
    </section>
  );
}
