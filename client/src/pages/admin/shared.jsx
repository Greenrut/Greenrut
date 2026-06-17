import { clearAdminAuth } from '../../lib/auth.js'

const adminNav = [
  { label: 'Dashboard', href: '/admin', icon: 'dashboard' },
  { section: 'Content' },
  { label: 'Blog Posts', href: '/admin/blog/new', icon: 'blog' },
  { label: 'Products', href: '/admin/products/new', icon: 'products' },
  { section: 'Store' },
  { label: 'Categories', href: '/admin/categories', icon: 'categories' },
  { label: 'Tags', href: '/admin/tags', icon: 'tags' },
  { section: 'Settings' },
  { label: 'Users', href: '/admin/users', icon: 'users' },
  { label: 'Settings', href: '/admin/settings', icon: 'settings' },
]

function Icon({ type }) {
  if (type === 'blog') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 4h11l3 3v13H5z" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <path d="M16 4v4h4" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <path d="M8 11h8M8 15h8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    )
  }

  if (type === 'products') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 9h10v11H7z" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <path d="M9 9a3 3 0 0 1 6 0" fill="none" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    )
  }

  if (type === 'categories') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 5h7v7H4zM13 5h7v7h-7zM4 14h7v5H4zM13 14h7v5h-7z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    )
  }

  if (type === 'tags') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 10V5h5l9 9-5 5-9-9Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <circle cx="8.5" cy="8.5" r="1" fill="currentColor" />
      </svg>
    )
  }

  if (type === 'users') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <path d="M5 20c1.5-4 12.5-4 14 0" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    )
  }

  if (type === 'settings') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm8 3.5-1.6.7a7.6 7.6 0 0 1-.5 1.2l.6 1.6-1.6 1.6-1.6-.6a7.6 7.6 0 0 1-1.2.5L12 20l-1.7-1.5a7.6 7.6 0 0 1-1.2-.5l-1.6.6-1.6-1.6.6-1.6a7.6 7.6 0 0 1-.5-1.2L4 12l1.6-.7a7.6 7.6 0 0 1 .5-1.2l-.6-1.6L7.1 6.9l1.6.6a7.6 7.6 0 0 1 1.2-.5L12 4l1.7 1.5a7.6 7.6 0 0 1 1.2.5l1.6-.6 1.6 1.6-.6 1.6a7.6 7.6 0 0 1 .5 1.2L20 12Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (type === 'dashboard') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    )
  }

  if (type === 'bell') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4a5 5 0 0 0-5 5v3.5L5 15h14l-2-2.5V9a5 5 0 0 0-5-5Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10 18a2 2 0 0 0 4 0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    )
  }

  if (type === 'menu') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 7h14M5 12h14M5 17h14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    )
  }

  if (type === 'plus') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  }

  if (type === 'pencil') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 19h4l10-10-4-4L5 15z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    )
  }

  if (type === 'trash') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7h16M9 7V5h6v2m-7 0 1 12h6l1-12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    )
  }

  if (type === 'lock') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="5" y="10" width="14" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 10V8a4 4 0 0 1 8 0v2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 4h16v16H4z" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

export function AdminShell({ pathname, onNavigate, children }) {
  const isDashboardPath =
    pathname === '/admin' ||
    pathname === '/admin/dashboard' ||
    (pathname.startsWith('/admin/') &&
      !pathname.startsWith('/admin/login') &&
      !pathname.startsWith('/admin/products/new') &&
      !pathname.startsWith('/admin/blog/new') &&
      !pathname.startsWith('/admin/users'))

  const isActive = (href) => pathname === href || (href === '/admin' && isDashboardPath)

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <button type="button" className="admin-brand" onClick={() => onNavigate('/admin')}>
          <img src="/logo.png" alt="Greenrut" />
        </button>

        <nav className="admin-nav" aria-label="Admin navigation">
          {adminNav.map((item) =>
            item.section ? (
              <p key={item.section} className="admin-nav__section">
                {item.section}
              </p>
            ) : (
              <button
                key={item.label}
                type="button"
                className={isActive(item.href) ? 'is-active' : ''}
                onClick={() => onNavigate(item.href)}
              >
                <Icon type={item.icon} />
                <span>{item.label}</span>
              </button>
            )
          )}
        </nav>

        <div className="admin-sidebar__footer">
          <button type="button" onClick={() => onNavigate('/')}>
            <Icon type="menu" />
            <span>View Site</span>
          </button>
          <button
            type="button"
            onClick={() => {
              clearAdminAuth()
              onNavigate('/admin/login')
            }}
          >
            <Icon type="lock" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar__spacer" />
          <div className="admin-topbar__actions">
            <button type="button" className="admin-icon-button" aria-label="Notifications">
              <Icon type="bell" />
              <span className="admin-notification-dot" />
            </button>
            <button type="button" className="admin-user-pill">
              <span className="admin-user-pill__avatar">A</span>
              <span>Admin</span>
              <span className="admin-user-pill__caret">⌄</span>
            </button>
          </div>
        </header>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  )
}

export function AdminPageHeader({ title, subtitle, actions, backLabel, onBack }) {
  return (
    <div className="admin-page-header">
      <div>
        {backLabel ? (
          <button type="button" className="admin-back-link" onClick={onBack}>
            {backLabel}
          </button>
        ) : null}
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {actions ? <div className="admin-page-header__actions">{actions}</div> : null}
    </div>
  )
}

export function AdminCard({ title, subtitle, actions, children, className = '' }) {
  return (
    <section className={`admin-card ${className}`.trim()}>
      {(title || subtitle || actions) && (
        <div className="admin-card__header">
          <div>
            {title ? <h2>{title}</h2> : null}
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
          {actions ? <div className="admin-card__actions">{actions}</div> : null}
        </div>
      )}
      {children}
    </section>
  )
}

export function AdminPill({ tone = 'green', children }) {
  return <span className={`admin-pill admin-pill--${tone}`}>{children}</span>
}

export function AdminStatCard({ iconTone = 'blue', title, value, description }) {
  return (
    <div className="admin-stat-card">
      <div className={`admin-stat-card__icon admin-stat-card__icon--${iconTone}`}>
        <Icon type={iconTone === 'green' ? 'products' : 'blog'} />
      </div>
      <div>
        <p>{title}</p>
        <strong>{value}</strong>
        <span>{description}</span>
      </div>
    </div>
  )
}

export function AdminTable({ columns, rows, rowRenderer }) {
  return (
    <div className="admin-table">
      <div className="admin-table__head">
        {columns.map((column) => (
          <span key={column}>{column}</span>
        ))}
      </div>
      <div className="admin-table__body">{rows.map(rowRenderer)}</div>
    </div>
  )
}

export { Icon as AdminIcon }
