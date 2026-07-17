import { useMemo, useState } from 'react'
import { HeroBanner } from '../components/SiteChrome.jsx'
import { requestJson } from '../lib/api.js'
import bannaImage from '../assets/banna.png'

function getRoleFromSearch() {
  const params = new URLSearchParams(window.location.search)
  const role = params.get('role')
  return role === 'admin' ? 'admin' : 'user'
}

export function ForgotPasswordPage({ onNavigate }) {
  const role = useMemo(() => getRoleFromSearch(), [])
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const endpoint = role === 'admin' ? '/admin/auth/forgot-password' : '/auth/forgot-password'

  const goToLogin = () => {
    onNavigate?.(role === 'admin' ? '/admin/login' : '/login')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')
    setSubmitting(true)

    try {
      const result = await requestJson(endpoint, {
        method: 'POST',
        body: { email },
      })

      setMessage(result.message || 'If the account exists, a reset link will be sent shortly.')
      if (result.debugResetLink) {
        setMessage(`${result.message || 'If the account exists, a reset link will be sent shortly.'} Dev link: ${result.debugResetLink}`)
      }
    } catch (submitError) {
      setError(submitError.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <HeroBanner
        title="FORGOT PASSWORD"
        breadcrumb={role === 'admin' ? 'Admin  /  Forgot Password' : 'Home  /  Forgot Password'}
        backgroundPhoto={bannaImage}
      />

      <section className="login-shell !w-full xs:!w-[calc(100%-24px)] sm:!w-[calc(100%-48px)] !max-w-[1120px]">
        <div className="login-card !w-full !max-w-[420px]">
          <form className="login-form" onSubmit={handleSubmit}>
            <p className="text-sm text-[#5b574f]">
              Enter the email address for your {role === 'admin' ? 'admin' : 'account'} and we will send a reset link.
            </p>
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Email Address" />
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            {message ? <p className="text-sm text-green-700 break-words">{message}</p> : null}
            <button type="submit" className="primary-button" disabled={submitting}>
              {submitting ? 'PLEASE WAIT' : 'SEND RESET LINK'}
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
