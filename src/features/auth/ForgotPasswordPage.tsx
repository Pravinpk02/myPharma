import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ForgotPasswordPage() {
  const [email, setEmail]     = useState('');
  const [message, setMessage] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(
        'http://localhost:8080/api/auth/forgot-password',
        { email }
      );
      setSent(true);
      setMessage('Reset link sent! Check your email inbox.');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>

        {/* Logo */}
        <div style={styles.logoRow}>
          <div style={styles.logoCircle}>M</div>
          <span style={styles.logoText}>MyPharma</span>
        </div>

        <h1 style={styles.title}>Forgot Password?</h1>
        <p style={styles.subtitle}>
          Enter your email and we'll send you a password reset link.
        </p>

        {!sent ? (
          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                placeholder="mail@website.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            {error && <p style={styles.error}>{error}</p>}

            <button
              type="submit"
              style={styles.btn}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          // Success screen
          <div style={styles.successBox}>
            <p style={styles.successText}>✅ {message}</p>
            <p style={styles.subText}>
              Didn't receive it? Check your spam folder.
            </p>
          </div>
        )}

        <p style={styles.backLink}>
          <Link to="/login" style={styles.link}>← Back to Login</Link>
        </p>

      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #ecfdf5 0%, #f8fafc 50%, #f0fdf4 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
    boxSizing: 'border-box',
  },
  container: {
    width: '100%',
    maxWidth: '440px',
    padding: '40px 32px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05)',
    border: '1px solid #f1f5f9',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    boxSizing: 'border-box',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    justifyContent: 'center',
    marginBottom: '32px',
  },
  logoCircle: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  logoText: { fontWeight: 'bold', fontSize: '20px', color: '#0f172a' },
  title: { fontSize: '26px', fontWeight: 'bold', margin: '0 0 6px', textAlign: 'center', color: '#0f172a' },
  subtitle: { color: '#64748b', fontSize: '14px', marginBottom: '28px', textAlign: 'center' },
  inputGroup: { marginBottom: '20px' },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '6px',
    color: '#334155',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
    color: '#0f172a',
  },
  btn: {
    width: '100%',
    padding: '14px',
    backgroundColor: 'var(--accent)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginBottom: '16px',
    transition: 'background 0.2s',
  },
  error: { color: '#ef4444', fontSize: '13px', marginBottom: '12px', textAlign: 'center' },
  successBox: {
    padding: '20px',
    backgroundColor: '#ecfdf5',
    borderRadius: '8px',
    border: '1px solid #a7f3d0',
    marginBottom: '20px',
    textAlign: 'center',
  },
  successText: { color: '#059669', fontWeight: '600', margin: '0 0 8px' },
  subText: { color: '#64748b', fontSize: '13px', margin: 0 },
  backLink: { textAlign: 'center', marginTop: '20px' },
  link: { color: 'var(--accent)', fontWeight: '600', textDecoration: 'none' },
};

export default ForgotPasswordPage;