import { AccountPageShell } from './account/shared.jsx'

export function AccountPaymentSettingsPage({ pathname, onNavigate }) {
  return (
    <AccountPageShell pathname={pathname} onNavigate={onNavigate} title="PAYMENT SETTINGS" breadcrumb="Home  /  Payment Settings">
      <div className="account-card">
        <div className="account-card__header">
          <h2>Payment Settings</h2>
        </div>
        <p style={{ margin: 0, color: '#5f5a54', lineHeight: 1.7 }}>
          Payment settings are handled during checkout through Paystack. You can update your billing details there when you place an order.
        </p>
      </div>
    </AccountPageShell>
  )
}
