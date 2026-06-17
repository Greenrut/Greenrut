import { useState } from 'react'
import { HeroBanner } from '../components/SiteChrome.jsx'
import { requestJson } from '../lib/api.js'
import { saveUserAuth } from '../lib/auth.js'

export function LoginPage() {
  const [tab, setTab] = useState('Login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const resetStatus = () => {
    setMessage('')
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    resetStatus()
    setSubmitting(true)

    try {
      const endpoint = tab === 'Login' ? '/auth/login' : '/auth/signup'
      const body =
        tab === 'Login'
          ? { email, password }
          : { name, email, password }

      const result = await requestJson(endpoint, {
        method: 'POST',
        body,
      })

      saveUserAuth({
        token: result.token,
        user: result.user,
      })

      setMessage(tab === 'Login' ? 'You are signed in.' : 'Your account has been created.')
      window.history.pushState({}, '', '/account')
      window.dispatchEvent(new PopStateEvent('popstate'))
    } catch (submitError) {
      setError(submitError.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <HeroBanner title="LOGIN" breadcrumb="Home  /  Login" />
      <section className="login-shell !w-full xs:!w-[calc(100%-24px)] sm:!w-[calc(100%-48px)] !max-w-[1120px]">
        <div className="login-tabs">
          <button type="button" className={tab === 'Login' ? 'is-active' : ''} onClick={() => setTab('Login')}>
            Login
          </button>
          <button type="button" className={tab === 'Register' ? 'is-active' : ''} onClick={() => setTab('Register')}>
            Register
          </button>
        </div>
        <div className="login-card !w-full !max-w-[380px]">
          <form className="login-form" onSubmit={handleSubmit}>
            {tab === 'Register' ? (
              <input value={name} onChange={(event) => setName(event.target.value)} type="text" placeholder="Full Name" />
            ) : null}
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Email Address" />
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Password" />
            <div className="login-form__row">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <a href="/#forgot">Forgot Password?</a>
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            {message ? <p className="text-sm text-green-700">{message}</p> : null}
            <button type="submit" className="primary-button" disabled={submitting}>
              {submitting ? 'PLEASE WAIT' : tab === 'Login' ? 'LOGIN' : 'REGISTER'}
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
