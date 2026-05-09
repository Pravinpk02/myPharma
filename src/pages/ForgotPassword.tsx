import React, { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

function ForgotPassword() {
  const [email, setEmail]     = useState('')
  const [message, setMessage] = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await axios.post(
        'http://localhost:8080/api/auth/forgot-password',
        { email }
      )
      setSent(true)
      setMessage('Reset link sent! Check your email inbox.')
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>

      {/* Logo */}
      <div style={styles.logoRow}>
        <div style={styles.logoCircle}>B</div>
        <span style={styles.logoText}>Bischen</span>
      </div>

      <h1 style={styles.title}>Forgot Password?</h1>
      <p style={styles.subtitle}>
        Enter your email and we'll send you a reset link.
      </p>

      {!sent ? (
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
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
        <Link to="/" style={styles.link}>← Back to Login</Link>
      </p>

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
    marginBottom: '20px',
    textAlign: 'center',
  },
  successText: { color: '#16a34a', fontWeight: '600', margin: '0 0 8px' },
  subText: { color: '#666', fontSize: '13px', margin: 0 },
  backLink: { textAlign: 'center', marginTop: '16px' },
  link: { color: '#16a34a', fontWeight: '600', textDecoration: 'none' },
}

export default ForgotPassword