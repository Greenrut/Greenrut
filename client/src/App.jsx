import { useEffect, useState } from 'react'
import {
  AboutPage,
  AccountAddressBookPage,
  AccountAddressEditPage,
  AccountDashboardPage,
  AccountInboxPage,
  AccountOrdersPage,
  AccountPaymentSettingsPage,
  AccountCloseAccountPage,
  AccountWishlistPage,
  AdminBlogPostPage,
  AdminDashboardPage,
  AdminLoginPage,
  AdminProductsPage,
  AdminResearchPage,
  AdminLibraryPage,
  AdminUsersPage,
  AdminCategoriesPage,
  AdminTagsPage,
  AdminSettingsPage,
  CartPage,
  ContactPage,
  HomePage,
  LoginPage,
  BlogPage,
  ResearchPage,
  LibraryPage,
  NotFoundPage,
  ProductDetailsPage,
  ProductPage,
} from './pages/index.js'
import { SiteFrame } from './components/SiteChrome.jsx'
import { hasAdminAuth, hasUserAuth } from './lib/auth.js'
import './App.css'

function useLocationState() {
  const [locationState, setLocationState] = useState(() => ({
    pathname: window.location.pathname,
    search: window.location.search,
  }))

  useEffect(() => {
    const update = () =>
      setLocationState({
        pathname: window.location.pathname,
        search: window.location.search,
      })
    window.addEventListener('popstate', update)
    return () => window.removeEventListener('popstate', update)
  }, [])

  return locationState
}

function App() {
  const { pathname } = useLocationState()
  const isAdminRoute = pathname.startsWith('/admin')
  const adminLoginRoute = pathname === '/admin/login'
  const userLoginRoute = pathname === '/login'
  const hasAdminToken = hasAdminAuth()
  const hasUserToken = hasUserAuth()

  const navigate = (href) => {
    if (href === `${window.location.pathname}${window.location.search}`) return
    window.history.pushState({}, '', href)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  useEffect(() => {
    if (pathname.startsWith('/account') && !hasUserToken && !userLoginRoute) {
      window.history.replaceState({}, '', '/login')
      window.dispatchEvent(new PopStateEvent('popstate'))
      return
    }

    if (pathname.startsWith('/admin') && pathname !== '/admin/login' && !hasAdminToken) {
      window.history.replaceState({}, '', '/admin/login')
      window.dispatchEvent(new PopStateEvent('popstate'))
      return
    }

    if (userLoginRoute && hasUserToken) {
      window.history.replaceState({}, '', '/account')
      window.dispatchEvent(new PopStateEvent('popstate'))
      return
    }

    if (adminLoginRoute && hasAdminToken) {
      window.history.replaceState({}, '', '/admin')
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }, [pathname, userLoginRoute, adminLoginRoute, hasUserToken, hasAdminToken])

  let page = <HomePage onNavigate={navigate} />
  if (pathname === '/about-us') page = <AboutPage />
  if (pathname === '/product') page = <ProductPage onNavigate={navigate} />
  if (pathname === '/product-details') page = <ProductDetailsPage onNavigate={navigate} />
  if (pathname === '/cart') page = <CartPage onNavigate={navigate} />
  if (pathname === '/contact') page = <ContactPage />
  if (pathname === '/login') page = <LoginPage />
  if (pathname === '/blog') page = <BlogPage onNavigate={navigate} />
  if (pathname === '/library') page = <LibraryPage onNavigate={navigate} />
  if (pathname === '/research') page = <ResearchPage onNavigate={navigate} />
  if (pathname === '/account' || pathname === '/account/dashboard') page = <AccountDashboardPage pathname={pathname} onNavigate={navigate} />
  if (pathname === '/account/address-book') page = <AccountAddressBookPage pathname={pathname} onNavigate={navigate} />
  if (pathname === '/account/address-book/edit') page = <AccountAddressEditPage pathname={pathname} onNavigate={navigate} />
  if (pathname === '/account/wishlist') page = <AccountWishlistPage pathname={pathname} onNavigate={navigate} />
  if (pathname === '/account/inbox') page = <AccountInboxPage pathname={pathname} onNavigate={navigate} />
  if (pathname === '/account/orders') page = <AccountOrdersPage pathname={pathname} onNavigate={navigate} />
  if (pathname === '/account/payment-settings') page = <AccountPaymentSettingsPage pathname={pathname} onNavigate={navigate} />
  if (pathname === '/account/close-account') page = <AccountCloseAccountPage pathname={pathname} onNavigate={navigate} />
  if (pathname === '/admin/login') page = <AdminLoginPage onNavigate={navigate} />
  if (pathname === '/admin' || pathname === '/admin/dashboard') page = <AdminDashboardPage pathname={pathname} onNavigate={navigate} />
  if (pathname === '/admin/products/new') page = <AdminProductsPage pathname={pathname} onNavigate={navigate} />
  if (pathname === '/admin/blog/new') page = <AdminBlogPostPage pathname={pathname} onNavigate={navigate} />
  if (pathname === '/admin/research/new') page = <AdminResearchPage pathname={pathname} onNavigate={navigate} />
  if (pathname === '/admin/library/new') page = <AdminLibraryPage pathname={pathname} onNavigate={navigate} />
  if (pathname === '/admin/users') page = <AdminUsersPage pathname={pathname} onNavigate={navigate} />
  if (pathname === '/admin/categories') page = <AdminCategoriesPage pathname={pathname} onNavigate={navigate} />
  if (pathname === '/admin/tags') page = <AdminTagsPage pathname={pathname} onNavigate={navigate} />
  if (pathname === '/admin/settings') page = <AdminSettingsPage pathname={pathname} onNavigate={navigate} />
  if (
    !pathname.startsWith('/admin/login') &&
    page = <AdminDashboardPage pathname={pathname} onNavigate={navigate} />
  }

  if (!isAdminRoute) {
    const knownUserRoutes = new Set(['/', '/about-us', '/product', '/product-details', '/cart', '/contact', '/login', '/blog', '/library', '/research', '/account', '/account/dashboard', '/account/address-book', '/account/address-book/edit', '/account/wishlist', '/account/inbox', '/account/orders', '/account/payment-settings', '/account/close-account'])
    if (!knownUserRoutes.has(pathname)) {
      page = <NotFoundPage onNavigate={navigate} />
    }
  }

  if (isAdminRoute) {
    return page
  }

  return (
    <SiteFrame pathname={pathname} onNavigate={navigate}>
      {page}
    </SiteFrame>
  )
}

export default App
