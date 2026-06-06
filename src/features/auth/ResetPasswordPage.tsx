import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

function ResetPasswordPage() {
  const [searchParams]          = useSearchParams();
  const token                   = searchParams.get('token');
  const navigate                = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post(
        '/auth/reset-password',
        { token, password }
      );
      setSuccess(true);
      // Redirect to login after 2 seconds
      setTimeout(() => navigate('/login'), 2000);

    } catch (err: any) {
      setError(err.response?.data?.error || 'Link is invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  // No token in URL — invalid link
  if (!token) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.container}>
          <div style={styles.logoRow}>
            <div style={styles.logoCircle}>M</div>
            <span style={styles.logoText}>MyPharma</span>
          </div>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ color: '#ef4444', marginBottom: '16px', fontSize: '15px', fontWeight: '500' }}>
              ❌ Invalid or missing password reset link.
            </p>
            <Link to="/forgot-password" style={styles.link}>
              Request a new one
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>

        {/* Logo */}
        <div style={styles.logoRow}>
          <div style={styles.logoCircle}>M</div>
          <span style={styles.logoText}>MyPharma</span>
        </div>

        <h1 style={styles.title}>Reset Password</h1>
        <p style={styles.subtitle}>Enter your new password below to secure your account.</p>

        {!success ? (
          <form onSubmit={handleSubmit}>

            <div style={styles.inputGroup}>
              <label style={styles.label}>New Password</label>
              <input
                type="password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm Password</label>
              <input
                type="password"
                placeholder="Repeat new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
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
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>

          </form>
        ) : (
          <div style={styles.successBox}>
            <p style={styles.successText}>✅ Password reset successful!</p>
            <p style={styles.subText}>Redirecting to login...</p>
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
    textAlign: 'center',
  },
  successText: { color: '#059669', fontWeight: '600', margin: '0 0 8px' },
  subText: { color: '#64748b', fontSize: '13px', margin: 0 },
  backLink: { textAlign: 'center', marginTop: '20px' },
  link: { color: 'var(--accent)', fontWeight: '600', textDecoration: 'none' },
};

export default ResetPasswordPage;