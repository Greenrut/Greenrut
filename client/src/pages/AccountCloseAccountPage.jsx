import { AccountPageShell } from './account/shared.jsx'
import { clearUserAuth } from '../lib/auth.js'

export function AccountCloseAccountPage({ pathname, onNavigate }) {
  return (
    <AccountPageShell pathname={pathname} onNavigate={onNavigate} title="CLOSE ACCOUNT" breadcrumb="Home  /  Close Account">
      <div className="account-card">
        <div className="account-card__header">
          <h2>Close Account</h2>
        </div>
        <p style={{ margin: 0, color: '#5f5a54', lineHeight: 1.7 }}>
          If you want to close your account, log out first and contact support so the request can be reviewed safely.
        </p>
        <div className="account-actions" style={{ marginTop: 20 }}>
          <button type="button" className="account-back-link" onClick={() => onNavigate?.('/account')}>
            Back to account
          </button>
          <button
            type="button"
            className="account-primary-button"
            onClick={() => {
              clearUserAuth()
              onNavigate?.('/login')
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </AccountPageShell>
  )
}
