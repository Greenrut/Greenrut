import { HeroBanner } from '../../components/SiteChrome.jsx'
import bannaImage from '../../assets/banna.png'
import { clearUserAuth } from '../../lib/auth.js'

const accountItems = [
  { label: 'My GreenRut Account', href: '/account', icon: 'user' },
  { label: 'Orders', href: '/account/orders', icon: 'orders' },
  { label: 'Inbox', href: '/account/inbox', icon: 'inbox' },
  { label: 'Wishlist', href: '/account/wishlist', icon: 'wishlist' },
  { label: 'Payment Settings', href: '/account/payment-settings', icon: 'settings' },
  { label: 'Address Book', href: '/account/address-book', icon: 'address' },
  { label: 'Close Account', href: '/account/close-account', icon: 'close' },
]

function AccountIcon({ type }) {
  if (type === 'orders') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 6h16v12H4z" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 10h8M8 14h5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    )
  }

  if (type === 'inbox') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 6h16v12H4z" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    )
  }

  if (type === 'wishlist') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.4-7 10-7 10Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>
    )
  }

  if (type === 'settings') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm8 3.5-1.8.8a6.9 6.9 0 0 1-.6 1.5l.7 1.8-2 2-1.8-.7a6.9 6.9 0 0 1-1.5.6L12 20l-2.8-1.8a6.9 6.9 0 0 1-1.5-.6l-1.8.7-2-2 .7-1.8a6.9 6.9 0 0 1-.6-1.5L4 12l1.8-.8a6.9 6.9 0 0 1 .6-1.5L5.7 7.9l2-2 1.8.7a6.9 6.9 0 0 1 1.5-.6L12 4l2.8 1.8a6.9 6.9 0 0 1 1.5.6l1.8-.7 2 2-.7 1.8c.24.48.44.98.6 1.5L20 12Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (type === 'address') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="10" r="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    )
  }

  if (type === 'close') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 5h14v14H5z" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 8 16 16M16 8 8 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 20c1.5-4.2 12.5-4.2 14 0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function AccountSidebar({ pathname, onNavigate }) {
  const isActive = (href) => pathname === href || (href === '/account/address-book' && pathname === '/account/address-book/edit')

  return (
    <aside className="account-sidebar">
      <div className="account-sidebar__title">
        <AccountIcon type="user" />
        <span>My GreenRut Account</span>
      </div>
      <nav className="account-sidebar__nav" aria-label="Account sections">
        {accountItems.map((item) => (
          item.href ? (
            <a
              key={item.label}
              href={item.href}
              className={isActive(item.href) ? 'is-active' : ''}
              onClick={(event) => {
                event.preventDefault()
                onNavigate?.(item.href)
              }}
            >
              <AccountIcon type={item.icon} />
              <span>{item.label}</span>
            </a>
          ) : (
            <span key={item.label} className="account-sidebar__static">
              <AccountIcon type={item.icon} />
              <span>{item.label}</span>
            </span>
          )
        ))}
      </nav>
      <button
        type="button"
        className="account-sidebar__logout"
        onClick={() => {
          clearUserAuth()
          onNavigate?.('/login')
        }}
      >
        Logout
      </button>
    </aside>
  )
}

export function AccountPageShell({ pathname, onNavigate, title, breadcrumb, children }) {
  return (
    <>
      <HeroBanner title={title} breadcrumb={breadcrumb} backgroundPhoto={bannaImage} />
      <section className="page-shell account-layout">
        <AccountSidebar pathname={pathname} onNavigate={onNavigate} />
        <div className="account-layout__content">{children}</div>
      </section>
    </>
  )
}

export function AccountSectionCard({ title, children, className = '' }) {
  return (
    <section className={`account-card ${className}`.trim()}>
      <div className="account-card__header">
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  )
}
