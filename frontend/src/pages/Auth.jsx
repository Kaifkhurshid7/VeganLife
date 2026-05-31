import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLeaf, FaSeedling, FaEarthAmericas } from 'react-icons/fa6';
import { FiMail, FiLock, FiUser, FiKey, FiEye, FiEyeOff, FiAtSign } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

function PasswordStrength({ password }) {
  const getStrength = () => {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getStrength();
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
  const colors = ['', '#c0392b', '#e3a36e', '#e3a36e', '#a6b48f', '#2ecc71'];

  if (!password) return null;

  return (
    <div className={styles.strengthMeter}>
      <div className={styles.strengthBars}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={styles.strengthBar} style={{ backgroundColor: i <= strength ? colors[strength] : 'rgba(87,61,33,0.1)' }} />
        ))}
      </div>
      <span className={styles.strengthLabel} style={{ color: colors[strength] }}>{labels[strength]}</span>
    </div>
  );
}

export default function Auth() {
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({ name: '', username: '', email: '', password: '', confirmPassword: '', secretKey: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { login, signup, adminLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) return <Navigate to="/community" />;

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    setError('');
  };

  const validate = () => {
    const errors = {};
    if (mode === 'signup') {
      if (!formData.name.trim()) errors.name = 'Name is required';
      if (!formData.username.trim()) errors.username = 'Username is required';
      else if (formData.username.length < 3) errors.username = 'Min 3 characters';
      else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) errors.username = 'Letters, numbers, underscores only';
      if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email format';
    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 6) errors.password = 'Min 6 characters';
    if (mode === 'admin' && !formData.secretKey) errors.secretKey = 'Secret key is required';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
      } else if (mode === 'signup') {
        await signup(formData.name, formData.username, formData.email, formData.password);
        setSuccess(true);
        setTimeout(() => navigate('/community'), 1500);
        return;
      } else {
        await adminLogin(formData.email, formData.password, formData.secretKey);
      }
      navigate(mode === 'admin' ? '/admin' : '/community');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section className={styles.section}>
        <div className={styles.successScreen}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            <FaSeedling className={styles.successIcon} />
          </motion.div>
          <h2>Welcome to Green Earth!</h2>
          <p>Your account has been created. Redirecting to community...</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.splitLayout}>
        {/* Left panel — branding */}
        <div className={styles.leftPanel}>
          <div className={styles.leftContent}>
            <FaLeaf className={styles.leftIcon} />
            <h2 className={styles.leftTitle}>Join the Movement</h2>
            <p className={styles.leftDesc}>
              Be part of a global community making conscious food choices for a healthier planet.
            </p>
            <div className={styles.leftStats}>
              <div className={styles.leftStat}>
                <FaEarthAmericas />
                <span>12,000+ members</span>
              </div>
              <div className={styles.leftStat}>
                <FaSeedling />
                <span>50,000+ meals tracked</span>
              </div>
            </div>
          </div>
          {/* Decorative floating elements */}
          <motion.div className={styles.floatingOrb1} animate={{ y: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity }} />
          <motion.div className={styles.floatingOrb2} animate={{ y: [0, 15, 0] }} transition={{ duration: 8, repeat: Infinity }} />
        </div>

        {/* Right panel — form */}
        <div className={styles.rightPanel}>
          <motion.div
            className={styles.formCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className={styles.formTitle}>
              {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Admin Access'}
            </h1>

            <div className={styles.tabs}>
              <button className={`${styles.tab} ${mode === 'login' ? styles.tabActive : ''}`} onClick={() => setMode('login')}>Login</button>
              <button className={`${styles.tab} ${mode === 'signup' ? styles.tabActive : ''}`} onClick={() => setMode('signup')}>Sign Up</button>
              <button className={`${styles.tab} ${mode === 'admin' ? styles.tabActive : ''}`} onClick={() => setMode('admin')}>Admin</button>
            </div>

            <AnimatePresence mode="wait">
              <motion.form
                key={mode}
                onSubmit={handleSubmit}
                className={styles.form}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
              >
                {mode === 'signup' && (
                  <>
                    <div className={styles.inputGroup}>
                      <FiUser className={styles.inputIcon} />
                      <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => updateField('name', e.target.value)} />
                      {fieldErrors.name && <span className={styles.fieldError}>{fieldErrors.name}</span>}
                    </div>
                    <div className={styles.inputGroup}>
                      <FiAtSign className={styles.inputIcon} />
                      <input type="text" placeholder="Username" value={formData.username} onChange={(e) => updateField('username', e.target.value)} />
                      {fieldErrors.username && <span className={styles.fieldError}>{fieldErrors.username}</span>}
                    </div>
                  </>
                )}

                <div className={styles.inputGroup}>
                  <FiMail className={styles.inputIcon} />
                  <input type="email" placeholder="Email address" value={formData.email} onChange={(e) => updateField('email', e.target.value)} />
                  {fieldErrors.email && <span className={styles.fieldError}>{fieldErrors.email}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <FiLock className={styles.inputIcon} />
                  <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={formData.password} onChange={(e) => updateField('password', e.target.value)} />
                  <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                  {fieldErrors.password && <span className={styles.fieldError}>{fieldErrors.password}</span>}
                </div>

                {mode === 'signup' && (
                  <>
                    <PasswordStrength password={formData.password} />
                    <div className={styles.inputGroup}>
                      <FiLock className={styles.inputIcon} />
                      <input type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} />
                      {fieldErrors.confirmPassword && <span className={styles.fieldError}>{fieldErrors.confirmPassword}</span>}
                    </div>
                  </>
                )}

                {mode === 'admin' && (
                  <div className={styles.inputGroup}>
                    <FiKey className={styles.inputIcon} />
                    <input type="password" placeholder="Admin Secret Key" value={formData.secretKey} onChange={(e) => updateField('secretKey', e.target.value)} />
                    {fieldErrors.secretKey && <span className={styles.fieldError}>{fieldErrors.secretKey}</span>}
                  </div>
                )}

                {error && <p className={styles.error}>{error}</p>}

                <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
                  {loading ? <span className={styles.spinner} /> : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Admin Login'}
                </button>
              </motion.form>
            </AnimatePresence>

            <p className={styles.switchText}>
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button className={styles.switchBtn} onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
