import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSeedling, FaEarthAmericas, FaStamp } from 'react-icons/fa6';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiAtSign, FiCheck } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { PasswordStrength } from '../components/ui';
import BackButton from '../components/ui/BackButton';
import { Seo } from '../components/seo';
import { ROUTES } from '../constants/routes';
import { SITE } from '../constants/site';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import styles from './Auth.module.css';

const TABS = [
  { id: 'login', label: 'Log in' },
  { id: 'signup', label: 'Sign up' },
];

const HEADINGS = {
  login: { kicker: 'Members', title: 'Welcome back', sub: 'Pick up where you left off.' },
  signup: { kicker: 'Join us', title: 'Create your pass', sub: 'Free to join. Takes about a minute.' },
};

/** A sheet that slaps onto the wall when the page opens. */
function Sheet({ className = '', rot = 0, delay = 0, tape = true, children }) {
  const reduce = usePrefersReducedMotion();
  return (
    <motion.div
      className={`${styles.sheet} ${className}`}
      initial={reduce ? false : { opacity: 0, scale: 1.4, rotate: rot + 12, y: -40 }}
      animate={{ opacity: 1, scale: 1, rotate: rot, y: 0 }}
      transition={{ type: 'spring', stiffness: 240, damping: 15, delay }}
    >
      {tape && <span className={styles.tape} aria-hidden="true" />}
      {children}
    </motion.div>
  );
}

/** One labelled field: the label is always visible, errors sit under the input. */
function Field({ id, label, icon, error, children }) {
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <div className={`${styles.control} ${error ? styles.controlError : ''}`}>
        <span className={styles.fieldIcon} aria-hidden="true">{icon}</span>
        {children}
      </div>
      {error && <span className={styles.fieldError} role="alert">{error}</span>}
    </div>
  );
}

export default function Auth() {
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({ name: '', username: '', email: '', password: '', confirmPassword: '', });
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { login, signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) return <Navigate to="/" />;

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    setError('');
  };

  const switchMode = (next) => {
    setMode(next);
    setError('');
    setFieldErrors({});
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
      if (!agree) errors.agree = 'Please confirm to continue';
    }
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) errors.email = 'Invalid email format';
    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 8) errors.password = 'At least 8 characters';
    else if (!/[A-Za-z]/.test(formData.password)) errors.password = 'Must contain a letter';
    else if (!/\d/.test(formData.password)) errors.password = 'Must contain a number';

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
      }
      navigate('/');
    } catch (err) {
      // Surface express-validator field errors inline when present
      const server = err.fieldErrors || [];
      const mapped = {};
      server.forEach(({ field, message }) => {
        if (['name', 'username', 'email', 'password', 'confirmPassword'].includes(field)) {
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
        <Seo title="Welcome" path={ROUTES.auth} noindex />
        <div className={styles.successScreen}>
          <motion.div
            className={styles.successStamp}
            initial={{ scale: 2.4, rotate: -30, opacity: 0 }}
            animate={{ scale: 1, rotate: -8, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 14 }}
          >
            <FaStamp aria-hidden="true" />
            <span>Member</span>
          </motion.div>
          <h1>Welcome to {SITE.name}!</h1>
          <p>Your account has been created. Taking you to the home page…</p>
        </div>
      </section>
    );
  }

  const head = HEADINGS[mode];

  return (
    <section className={styles.section}>
      <Seo
        title={mode === 'signup' ? 'Create an account' : 'Log in'}
        description={`Log in or create a free ${SITE.name} account to post, comment and join the community.`}
        path={ROUTES.auth}
        noindex
      />

      <div className={styles.splitLayout}>
        {/* ═════════ the wall ═════════ */}
        <aside className={styles.wall} aria-label="Why join">
          <span className={styles.spray} aria-hidden="true">Join in</span>

          <div className={styles.posters}>
            <Sheet className={styles.pHead} rot={-2.5} delay={0.1}>
              <p className={styles.notice}>Notice</p>
              <p className={styles.bigLine}>Join the</p>
              <p className={`${styles.bigLine} ${styles.bigAlt}`}>movement.</p>
            </Sheet>

            <Sheet className={styles.pPlanet} rot={3} delay={0.25}>
              <FaEarthAmericas className={styles.globe} aria-hidden="true" />
              <p className={styles.stencil}>No planet B</p>
            </Sheet>

            <Sheet className={styles.pWhy} rot={-1.2} delay={0.4}>
              <p className={styles.newsKicker}>Members can</p>
              <ul>
                <li><FiCheck aria-hidden="true" /> Post recipes and tips</li>
                <li><FiCheck aria-hidden="true" /> Earn sustainability badges</li>
                <li><FiCheck aria-hidden="true" /> Chat with other members</li>
                <li><FiCheck aria-hidden="true" /> Save and react to posts</li>
              </ul>
            </Sheet>

            <Sheet className={styles.pFree} rot={4} delay={0.55} tape={false}>
              <span>Free</span>
              <strong>to join</strong>
            </Sheet>
          </div>
        </aside>

        {/* ═════════ the pass ═════════ */}
        <div className={styles.rightPanel}>
          <div className={styles.back}>
            <BackButton />
          </div>

          <motion.div
            className={styles.pass}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className={`${styles.tape} ${styles.passTape}`} aria-hidden="true" />

            <header className={styles.passHead}>
              <p className={styles.kicker}>{head.kicker}</p>
              <h1>{head.title}</h1>
              <p className={styles.sub}>{head.sub}</p>
            </header>

            <div className={styles.tabs} role="tablist" aria-label="Account">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={mode === t.id}
                  className={`${styles.tab} ${mode === t.id ? styles.tabActive : ''}`}
                  onClick={() => switchMode(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.form
                key={mode}
                onSubmit={handleSubmit}
                className={styles.form}
                noValidate
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
              >
                {mode === 'signup' && (
                  <>
                    <Field id="auth-name" label="Full name" icon={<FiUser />} error={fieldErrors.name}>
                      <input
                        id="auth-name"
                        type="text"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        aria-invalid={!!fieldErrors.name}
                        autoComplete="name"
                      />
                    </Field>
                    <Field id="auth-username" label="Username" icon={<FiAtSign />} error={fieldErrors.username}>
                      <input
                        id="auth-username"
                        type="text"
                        placeholder="green_cook"
                        value={formData.username}
                        onChange={(e) => updateField('username', e.target.value)}
                        aria-invalid={!!fieldErrors.username}
                        autoComplete="username"
                      />
                    </Field>
                  </>
                )}

                <Field id="auth-email" label="Email address" icon={<FiMail />} error={fieldErrors.email}>
                  <input
                    id="auth-email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    aria-invalid={!!fieldErrors.email}
                    autoComplete="email"
                  />
                </Field>

                <Field id="auth-password" label="Password" icon={<FiLock />} error={fieldErrors.password}>
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={mode === 'signup' ? 'At least 8 characters, with a number' : 'Your password'}
                    value={formData.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    aria-invalid={!!fieldErrors.password}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </Field>

                {mode === 'signup' && (
                  <>
                    <PasswordStrength password={formData.password} />
                    <Field id="auth-confirm" label="Confirm password" icon={<FiLock />} error={fieldErrors.confirmPassword}>
                      <input
                        id="auth-confirm"
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Type it again"
                        value={formData.confirmPassword}
                        onChange={(e) => updateField('confirmPassword', e.target.value)}
                        aria-invalid={!!fieldErrors.confirmPassword}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className={styles.eyeBtn}
                        onClick={() => setShowConfirm(!showConfirm)}
                        aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                      >
                        {showConfirm ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </Field>

                    <div className={styles.agree}>
                      <label>
                        <input
                          type="checkbox"
                          checked={agree}
                          onChange={(e) => {
                            setAgree(e.target.checked);
                            setFieldErrors((prev) => ({ ...prev, agree: '' }));
                          }}
                          aria-invalid={!!fieldErrors.agree}
                        />
                        <span className={styles.box} aria-hidden="true"><FiCheck /></span>
                        <span>
                          I am 18 or older and I agree to the{' '}
                          <Link to={ROUTES.terms} target="_blank" rel="noopener noreferrer">Terms of Use</Link> and{' '}
                          <Link to={ROUTES.privacy} target="_blank" rel="noopener noreferrer">Privacy Policy</Link>.
                        </span>
                      </label>
                      {fieldErrors.agree && <span className={styles.fieldError} role="alert">{fieldErrors.agree}</span>}
                    </div>
                  </>
                )}

                {error && <p className={styles.error} role="alert">{error}</p>}

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? (
                    <span className={styles.spinner} aria-label="Please wait" />
                  ) : (
                    <>
                      <FaSeedling aria-hidden="true" />
                      {mode === 'login' ? 'Log in' : 'Create account'}
                    </>
                  )}
                </button>
              </motion.form>
            </AnimatePresence>

            <p className={styles.switchText}>
                {mode === 'login' ? 'New here? ' : 'Already a member? '}
                <button type="button" className={styles.switchBtn} onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}>
                  {mode === 'login' ? 'Create a free account' : 'Log in'}
                </button>
              </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
