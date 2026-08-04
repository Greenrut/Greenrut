import { useMemo, useState } from 'react'
import { HeroBanner } from '../components/SiteChrome.jsx'
import { requestJson } from '../lib/api.js'
import bannaImage from '../assets/banna.png'

function getSearchState() {
  const params = new URLSearchParams(window.location.search)
  return {
    role: params.get('role') === 'admin' ? 'admin' : 'user',
    email: params.get('email') || '',
    token: params.get('token') || '',
  }
}

export function ResetPasswordPage({ onNavigate }) {
  const searchState = useMemo(() => getSearchState(), [])
  const [email, setEmail] = useState(searchState.email)
  const [token, setToken] = useState(searchState.token)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const endpoint = searchState.role === 'admin' ? '/admin/auth/reset-password' : '/auth/reset-password'

  const goToLogin = () => {
    onNavigate?.(searchState.role === 'admin' ? '/admin/login' : '/login')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.')
      return
    }

    setSubmitting(true)

    try {
      const result = await requestJson(endpoint, {
        method: 'POST',
        body: {
          email,
          token,
          newPassword,
        },
      })

      setMessage(result.message || 'Password updated successfully.')
      setTimeout(() => goToLogin(), 1200)
    } catch (submitError) {
      setError(submitError.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <HeroBanner
        title="RESET PASSWORD"
        breadcrumb={searchState.role === 'admin' ? 'Admin  /  Reset Password' : 'Home  /  Reset Password'}
        backgroundPhoto={bannaImage}
      />

      <section className="login-shell !w-full xs:!w-[calc(100%-24px)] sm:!w-[calc(100%-48px)] !max-w-[1120px]">
        <div className="login-card !w-full !max-w-[420px]">
          <form className="login-form" onSubmit={handleSubmit}>
            <p className="text-sm text-[#5b574f]">Choose a new password for your {searchState.role === 'admin' ? 'admin' : 'account'}.</p>
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Email Address" />
            <input value={token} onChange={(event) => setToken(event.target.value)} type="text" placeholder="Reset Token" />
            <input value={newPassword} onChange={(event) => setNewPassword(event.target.value)} type="password" placeholder="New Password" />
            <input value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} type="password" placeholder="Confirm New Password" />
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            {message ? <p className="text-sm text-green-700">{message}</p> : null}
            <button type="submit" className="primary-button" disabled={submitting}>
              {submitting ? 'PLEASE WAIT' : 'RESET PASSWORD'}
            </button>
            <button type="button" className="secondary-button" onClick={goToLogin}>
              Back to login
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
