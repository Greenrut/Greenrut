import { useState } from 'react'
import { requestJson } from '../../lib/api.js'
import { clearAdminAuth, saveAdminAuth } from '../../lib/auth.js'

export function AdminLoginPage({ onNavigate }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [signupKey, setSignupKey] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleLogout = () => {
    clearAdminAuth()
    onNavigate('/admin/login')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')
    setSubmitting(true)

    try {
      const endpoint = mode === 'login' ? '/admin/auth/login' : '/admin/auth/signup'
      const body =
        mode === 'login'
          ? { email, password }
          : { name, email, password, signupKey }

      const result = await requestJson(endpoint, {
        method: 'POST',
        body,
      })

      saveAdminAuth({
        token: result.token,
        user: result.user,
      })

      setMessage(mode === 'login' ? 'Admin access granted.' : 'Admin account created.')
      onNavigate('/admin')
    } catch (submitError) {
      setError(submitError.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <img className="admin-login__logo" src="/logo.png" alt="Greenrut" />
        <h1>{mode === 'login' ? 'Login' : 'Admin Sign Up'}</h1>
        <p>{mode === 'login' ? 'Sign in to manage the admin dashboard.' : 'Create a new administrator account.'}</p>
        <div className="admin-login__switch">
          <button type="button" onClick={() => setMode('login')} aria-pressed={mode === 'login'}>
            Login
          </button>
          <button type="button" onClick={() => setMode('signup')} aria-pressed={mode === 'signup'}>
            Sign Up
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {mode === 'signup' ? (
            <label>
              Name
              <input value={name} onChange={(event) => setName(event.target.value)} type="text" placeholder="Enter full name" />
            </label>
          ) : null}
          <label>
            Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Enter your email" />
          </label>
          <label>
            Password
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder=".............." />
          </label>
          {mode === 'signup' ? (
            <label>
              Admin Key
              <input value={signupKey} onChange={(event) => setSignupKey(event.target.value)} type="password" placeholder="Optional in development" />
            </label>
          ) : null}
          <a href="/admin/login#forgot">Forgot password</a>
          {error ? <p className="admin-login__message admin-login__message--error">{error}</p> : null}
          {message ? <p className="admin-login__message admin-login__message--success">{message}</p> : null}
          <button type="submit" className="admin-primary-button admin-login__submit" disabled={submitting}>
            {submitting ? 'Please wait' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
          <button type="button" className="admin-secondary-button admin-login__logout" onClick={handleLogout}>
            Logout
          </button>
        </form>
      </div>
    </div>
  )
}
