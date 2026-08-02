import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLeaf, FaSeedling, FaEarthAmericas } from 'react-icons/fa6';
import { FiMail, FiLock, FiUser, FiKey, FiEye, FiEyeOff, FiAtSign } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCounter } from '../hooks';
import { PasswordStrength } from '../components/ui';
import styles from './Auth.module.css';

function StatCount({ value, suffix }) {
  const { ref, count } = useCounter(value);
  return <span ref={ref}>{count}{suffix}</span>;
}

export default function Auth() {
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({ name: '', username: '', email: '', password: '', confirmPassword: '', secretKey: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { login, signup, adminLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) return <Navigate to="/" />;

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    setError('');
  };

  const validate = () => {
    const errors = {};
    if (mode === 'signup') {
      if (!formData.name.trim()) errors.name = 'Name is required';
      else if (formData.name.trim().length > 50) errors.name = 'Max 50 characters';
      if (!formData.username.trim()) errors.username = 'Username is required';
      else if (formData.username.trim().length < 3 || formData.username.trim().length > 20) errors.username = '3-20 characters';
      else if (!/^[a-zA-Z0-9_]+$/.test(formData.username.trim())) errors.username = 'Letters, numbers, underscores only';
      if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) errors.email = 'Invalid email format';
    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 8) errors.password = 'At least 8 characters';
    else if (!/[A-Za-z]/.test(formData.password)) errors.password = 'Must contain a letter';
    else if (!/\d/.test(formData.password)) errors.password = 'Must contain a number';
    if (mode === 'admin' && !formData.secretKey) errors.secretKey = 'Secret key is required';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setError('');
    setFieldErrors({});
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(formData.email.trim(), formData.password);
      } else if (mode === 'signup') {
        await signup(formData.name.trim(), formData.username.trim(), formData.email.trim(), formData.password);
        setSuccess(true);
        setTimeout(() => navigate('/'), 1500);
        return;
      } else {
        await adminLogin(formData.email.trim(), formData.password, formData.secretKey);
      }
      navigate(mode === 'admin' ? '/admin' : '/');
    } catch (err) {
      // Surface express-validator field errors inline when present
      const server = err.fieldErrors || [];
      const mapped = {};
      server.forEach(({ field, message }) => {
        if (['name', 'username', 'email', 'password', 'confirmPassword', 'secretKey'].includes(field)) {
          mapped[field] = message;
        }
      });
      if (Object.keys(mapped).length) {
        setFieldErrors(mapped);
      } else {
        setError(err.message);
      }
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
            <motion.div
              className={styles.leftStats}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.6 }}
            >
              <div className={styles.leftStat}>
                <FaEarthAmericas />
                <StatCount value="12,000" suffix="+ members" />
              </div>
              <div className={styles.leftStat}>
                <FaSeedling />
                <StatCount value="50,000" suffix="+ meals tracked" />
              </div>
            </motion.div>
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
              {[
                { id: 'login', label: 'Login' },
                { id: 'signup', label: 'Sign Up' },
                { id: 'admin', label: 'Admin' },
              ].map((t) => (
                <motion.button
                  key={t.id}
                  className={`${styles.tab} ${mode === t.id ? styles.tabActive : ''}`}
                  onClick={() => setMode(t.id)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t.label}
                </motion.button>
              ))}
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
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        aria-label="Full Name"
                        aria-invalid={!!fieldErrors.name}
                        autoComplete="name"
                      />
                      {fieldErrors.name && <span className={styles.fieldError} role="alert">{fieldErrors.name}</span>}
                    </div>
                    <div className={styles.inputGroup}>
                      <FiAtSign className={styles.inputIcon} />
                      <input
                        type="text"
                        placeholder="Username"
                        value={formData.username}
                        onChange={(e) => updateField('username', e.target.value)}
                        aria-label="Username"
                        aria-invalid={!!fieldErrors.username}
                        autoComplete="username"
                      />
                      {fieldErrors.username && <span className={styles.fieldError} role="alert">{fieldErrors.username}</span>}
                    </div>
                  </>
                )}

                <div className={styles.inputGroup}>
                  <FiMail className={styles.inputIcon} />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    aria-label="Email address"
                    aria-invalid={!!fieldErrors.email}
                    autoComplete="email"
                  />
                  {fieldErrors.email && <span className={styles.fieldError} role="alert">{fieldErrors.email}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <FiLock className={styles.inputIcon} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    aria-label="Password"
                    aria-invalid={!!fieldErrors.password}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  />
                  <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                  {fieldErrors.password && <span className={styles.fieldError} role="alert">{fieldErrors.password}</span>}
                </div>

                {mode === 'signup' && (
                  <>
                    <PasswordStrength password={formData.password} />
                    <div className={styles.inputGroup}>
                      <FiLock className={styles.inputIcon} />
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={(e) => updateField('confirmPassword', e.target.value)}
                        aria-label="Confirm Password"
                        aria-invalid={!!fieldErrors.confirmPassword}
                        autoComplete="new-password"
                      />
                      <button type="button" className={styles.eyeBtn} onClick={() => setShowConfirm(!showConfirm)} aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}>
                        {showConfirm ? <FiEyeOff /> : <FiEye />}
                      </button>
                      {fieldErrors.confirmPassword && <span className={styles.fieldError} role="alert">{fieldErrors.confirmPassword}</span>}
                    </div>
                  </>
                )}

                {mode === 'admin' && (
                  <div className={styles.inputGroup}>
                    <FiKey className={styles.inputIcon} />
                    <input
                      type="password"
                      placeholder="Admin Secret Key"
                      value={formData.secretKey}
                      onChange={(e) => updateField('secretKey', e.target.value)}
                      aria-label="Admin Secret Key"
                      aria-invalid={!!fieldErrors.secretKey}
                    />
                    {fieldErrors.secretKey && <span className={styles.fieldError} role="alert">{fieldErrors.secretKey}</span>}
                  </div>
                )}

                {error && <p className={styles.error} role="status">{error}</p>}

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
