import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'

function ResetPassword() {
  const [searchParams]          = useSearchParams()
  const token                   = searchParams.get('token')
  const navigate                = useNavigate()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      await axios.post(
        'http://localhost:8080/api/auth/reset-password',
        { token, password }
      )
      setSuccess(true)
      // Redirect to login after 2 seconds
      setTimeout(() => navigate('/login'), 2000)

    } catch (err: any) {
      setError(err.response?.data?.error || 'Link is invalid or expired.')
    } finally {
      setLoading(false)
    }
  }

  // No token in URL — invalid link
  if (!token) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', fontFamily: 'sans-serif' }}>
        <p style={{ color: 'red', marginBottom: '12px' }}>
          ❌ Invalid reset link.
        </p>
        <Link to="/forgot-password" style={{ color: '#16a34a', fontWeight: '600' }}>
          Request a new one
        </Link>
      </div>
    )
  }

  return (
    <div style={styles.container}>

      {/* Logo */}
      <div style={styles.logoRow}>
        <div style={styles.logoCircle}>B</div>
        <span style={styles.logoText}>Bischen</span>
      </div>

      <h1 style={styles.title}>Reset Password</h1>
      <p style={styles.subtitle}>Enter your new password below.</p>

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

    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '420px',
    margin: '0 auto',
    padding: '40px 24px',
    fontFamily: 'sans-serif',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '32px',
  },
  logoCircle: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    backgroundColor: '#16a34a',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  logoText: { fontWeight: 'bold', fontSize: '20px' },
  title: { fontSize: '28px', fontWeight: 'bold', margin: '0 0 6px' },
  subtitle: { color: '#666', fontSize: '14px', marginBottom: '28px' },
  inputGroup: { marginBottom: '16px' },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  btn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#16a34a',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginBottom: '16px',
  },
  error: { color: 'red', fontSize: '13px', marginBottom: '12px' },
  successBox: {
    padding: '20px',
    backgroundColor: '#f0fdf4',
    borderRadius: '8px',
    border: '1px solid #bbf7d0',
    textAlign: 'center',
  },
  successText: { color: '#16a34a', fontWeight: '600', margin: '0 0 8px' },
  subText: { color: '#666', fontSize: '13px', margin: 0 },
}

export default ResetPassword