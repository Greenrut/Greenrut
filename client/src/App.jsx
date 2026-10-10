import { useEffect, useState } from "react";
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
  AdminBannerEditPage,
  AdminBannersPage,
  AdminBlogPostPage,
  AdminDashboardPage,
  AdminLoginPage,
  AdminProductsPage,
  AdminResearchPage,
  AdminLibraryPage,
  AdminReviewsPage,
  AdminUsersPage,
  AdminCategoriesPage,
  AdminTagsPage,
  AdminSettingsPage,
  CartPage,
  ContactPage,
  ForgotPasswordPage,
  HomePage,
  LoginPage,
  BlogPage,
  ResearchPage,
  LibraryPage,
  LibraryResourcePage,
  NotFoundPage,
  ProductDetailsPage,
  ProductPage,
  ResetPasswordPage,
} from "./pages/index.js";
import { SiteFrame } from "./components/SiteChrome.jsx";
import { LoginPromptModal } from "./components/LoginPromptModal.jsx";
import { hasAdminAuth, hasUserAuth } from "./lib/auth.js";
import "./App.css";

function useLocationState() {
  const [locationState, setLocationState] = useState(() => ({
    pathname: window.location.pathname,
    search: window.location.search,
  }));

  useEffect(() => {
    const update = () =>
      setLocationState({
        pathname: window.location.pathname,
        search: window.location.search,
      });
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);

  return locationState;
}

function App() {
  const { pathname, search } = useLocationState();
  const [authVersion, setAuthVersion] = useState(0);
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const isAdminRoute = pathname.startsWith("/admin");
  const adminLoginRoute = pathname === "/admin/login";
  const userLoginRoute = pathname === "/login";
  const hasAdminToken = hasAdminAuth();
  const hasUserToken = hasUserAuth();

  const navigate = (href) => {
    if (href === `${window.location.pathname}${window.location.search}`) return;
    window.history.pushState({}, "", href);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  useEffect(() => {
    if (pathname.startsWith("/account") && !hasUserToken && !userLoginRoute) {
      window.history.replaceState({}, "", "/login");
      window.dispatchEvent(new PopStateEvent("popstate"));
      return;
    }

    if (
      pathname.startsWith("/admin") &&
      pathname !== "/admin/login" &&
      !hasAdminToken
    ) {
      window.history.replaceState({}, "", "/admin/login");
      window.dispatchEvent(new PopStateEvent("popstate"));
      return;
    }

    if (userLoginRoute && hasUserToken) {
      window.history.replaceState({}, "", "/account");
      window.dispatchEvent(new PopStateEvent("popstate"));
      return;
    }

    if (adminLoginRoute && hasAdminToken) {
      window.history.replaceState({}, "", "/admin");
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  }, [pathname, userLoginRoute, adminLoginRoute, hasUserToken, hasAdminToken]);

  useEffect(() => {
    if (hasUserToken || hasAdminToken) {
      setIsPromptOpen(false);
      return;
    }

    if (
      pathname.startsWith("/admin") ||
      pathname === "/login" ||
      pathname === "/forgot-password" ||
      pathname === "/reset-password"
    ) {
      setIsPromptOpen(false);
      return;
    }

    const isHome = pathname === "/";
    const isResearch = pathname.startsWith("/research");
    const isLibrary = pathname.startsWith("/library");

    try {
      if (isHome) {
        if (!sessionStorage.getItem("greenrut:dismissed_home")) {
          setIsPromptOpen(true);
        }
      } else if (isResearch) {
        if (!sessionStorage.getItem("greenrut:dismissed_research")) {
          setIsPromptOpen(true);
        }
      } else if (isLibrary) {
        if (!sessionStorage.getItem("greenrut:dismissed_library")) {
          setIsPromptOpen(true);
        }
      } else {
        if (!sessionStorage.getItem("greenrut:initial_prompt_shown")) {
          setIsPromptOpen(true);
        }
      }
    } catch {
      // ignore storage access error
    }
  }, [pathname, hasUserToken, hasAdminToken, authVersion]);

  const handleDismissPrompt = () => {
    try {
      sessionStorage.setItem("greenrut:initial_prompt_shown", "true");
      if (pathname === "/") {
        sessionStorage.setItem("greenrut:dismissed_home", "true");
      } else if (pathname.startsWith("/research")) {
        sessionStorage.setItem("greenrut:dismissed_research", "true");
      } else if (pathname.startsWith("/library")) {
        sessionStorage.setItem("greenrut:dismissed_library", "true");
      }
    } catch {
      // ignore storage access error
    }
    setIsPromptOpen(false);
  };

  const handlePromptSuccess = () => {
    setIsPromptOpen(false);
    setAuthVersion((v) => v + 1);
  };

  let page = <HomePage onNavigate={navigate} />;
  if (pathname === "/about-us") page = <AboutPage />;
  if (pathname === "/product")
    page = <ProductPage onNavigate={navigate} search={search} />;
  if (pathname === "/product-details")
    page = <ProductDetailsPage onNavigate={navigate} />;
  if (pathname === "/cart") page = <CartPage onNavigate={navigate} />;
  if (pathname === "/contact") page = <ContactPage />;
  if (pathname === "/login") page = <LoginPage onNavigate={navigate} />;
  if (pathname === "/forgot-password")
    page = <ForgotPasswordPage onNavigate={navigate} />;
  if (pathname === "/reset-password")
    page = <ResetPasswordPage onNavigate={navigate} />;
  if (
    pathname === "/blog" ||
    pathname === "/self-care" ||
    pathname.startsWith("/blog/") ||
    pathname.startsWith("/self-care/")
  )
    page = (
      <BlogPage
        onNavigate={navigate}
        search={search}
        pathname={pathname}
      />
    );
  if (pathname === "/library") page = <LibraryPage onNavigate={navigate} />;
  if (pathname === "/library/resource")
    page = <LibraryResourcePage onNavigate={navigate} />;
  if (pathname === "/research") page = <ResearchPage onNavigate={navigate} />;
  if (pathname === "/account" || pathname === "/account/dashboard")
    page = <AccountDashboardPage pathname={pathname} onNavigate={navigate} />;
  if (pathname === "/account/address-book")
    page = <AccountAddressBookPage pathname={pathname} onNavigate={navigate} />;
  if (pathname === "/account/address-book/edit")
    page = <AccountAddressEditPage pathname={pathname} onNavigate={navigate} />;
  if (pathname === "/account/wishlist")
    page = <AccountWishlistPage pathname={pathname} onNavigate={navigate} />;
  if (pathname === "/account/inbox")
    page = <AccountInboxPage pathname={pathname} onNavigate={navigate} />;
  if (pathname === "/account/orders")
    page = <AccountOrdersPage pathname={pathname} onNavigate={navigate} />;
  if (pathname === "/account/payment-settings")
    page = (
      <AccountPaymentSettingsPage pathname={pathname} onNavigate={navigate} />
    );
  if (pathname === "/account/close-account")
    page = (
      <AccountCloseAccountPage pathname={pathname} onNavigate={navigate} />
    );
  if (pathname === "/admin/login")
    page = <AdminLoginPage onNavigate={navigate} />;
  if (pathname === "/admin" || pathname === "/admin/dashboard")
    page = <AdminDashboardPage pathname={pathname} onNavigate={navigate} />;
  if (pathname === "/admin/products" || pathname === "/admin/products/new")
    page = <AdminProductsPage pathname={pathname} onNavigate={navigate} />;
  if (pathname === "/admin/categories")
    page = <AdminCategoriesPage pathname={pathname} onNavigate={navigate} />;
  if (pathname === "/admin/tags")
    page = <AdminTagsPage pathname={pathname} onNavigate={navigate} />;
  if (pathname === "/admin/banners")
    page = <AdminBannersPage pathname={pathname} onNavigate={navigate} />;
  if (
    pathname === "/admin/banners/new" ||
    pathname.match(/^\/admin\/banners\/[^/]+$/)
  ) {
    const params = { id: pathname.split("/").pop() };
    page = (
      <AdminBannerEditPage
        pathname={pathname}
        params={params}
        onNavigate={navigate}
      />
    );
  }
  if (pathname === "/admin/blog" || pathname === "/admin/blog/new")
    page = (
      <AdminBlogPostPage
        pathname={pathname}
        search={search}
        onNavigate={navigate}
      />
    );
  if (pathname === "/admin/research" || pathname === "/admin/research/new")
    page = <AdminResearchPage pathname={pathname} onNavigate={navigate} />;
  if (pathname === "/admin/library" || pathname === "/admin/library/new")
    page = <AdminLibraryPage pathname={pathname} onNavigate={navigate} />;
  if (pathname === "/admin/reviews")
    page = <AdminReviewsPage pathname={pathname} onNavigate={navigate} />;
  if (pathname === "/admin/users")
    page = <AdminUsersPage pathname={pathname} onNavigate={navigate} />;
  if (pathname === "/admin/settings")
    page = <AdminSettingsPage pathname={pathname} onNavigate={navigate} />;
  if (
    pathname.startsWith("/admin/") &&
    !pathname.startsWith("/admin/login") &&
    !pathname.startsWith("/admin/products") &&
    !pathname.startsWith("/admin/categories") &&
    !pathname.startsWith("/admin/tags") &&
    !pathname.startsWith("/admin/banners") &&
    !pathname.startsWith("/admin/blog") &&
    !pathname.startsWith("/admin/research") &&
    !pathname.startsWith("/admin/library") &&
    !pathname.startsWith("/admin/reviews") &&
    !pathname.startsWith("/admin/users") &&
    !pathname.startsWith("/admin/settings")
  ) {
    page = <AdminDashboardPage pathname={pathname} onNavigate={navigate} />;
  }

  if (!isAdminRoute) {
    const knownUserRoutes = new Set([
      "/",
      "/about-us",
      "/product",
      "/product-details",
      "/cart",
      "/contact",
      "/login",
      "/forgot-password",
      "/reset-password",
      "/blog",
      "/self-care",
      "/library",
      "/library/resource",
      "/research",
      "/account",
      "/account/dashboard",
      "/account/address-book",
      "/account/address-book/edit",
      "/account/wishlist",
      "/account/inbox",
      "/account/orders",
      "/account/payment-settings",
      "/account/close-account",
    ]);
    if (!knownUserRoutes.has(pathname)) {
      page = <NotFoundPage onNavigate={navigate} />;
    }
  }

  if (isAdminRoute) {
    return page;
  }

  return (
    <>
      <SiteFrame pathname={pathname} onNavigate={navigate}>
        {page}
      </SiteFrame>
      <LoginPromptModal
        isOpen={isPromptOpen}
        onClose={handleDismissPrompt}
        onSuccess={handlePromptSuccess}
        pathname={pathname}
        onNavigate={navigate}
      />
    </>
  );
}

export default App;
