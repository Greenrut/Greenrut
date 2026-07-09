import { useEffect } from 'react'
import { SiteFrame } from '../components/SiteChrome.jsx'

export function NotFoundPage({ onNavigate }) {
  useEffect(() => {
    document.title = 'Page not found | Greenrut'
  }, [])

  return (
    <section className="page-shell min-h-[60vh] py-16 xs:py-20 lg:py-24">
      <div className="mx-auto flex max-w-[720px] flex-col items-center gap-5 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#6bb21c]">404</p>
        <h1 className="font-serif text-[34px] leading-tight text-[#2f2b27] xs:text-[40px]">Page not found</h1>
        <p className="max-w-[520px] text-[14px] leading-7 text-[#6f6b64] xs:text-[15px]">
          The page you requested does not exist or has been moved.
        </p>
        <div className="flex flex-col gap-3 xs:flex-row">
          <button
            type="button"
            className="primary-button"
            onClick={() => onNavigate?.('/')}
          >
            Go Home
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() => onNavigate?.('/product')}
          >
            Browse Products
          </button>
        </div>
      </div>
    </section>
  )
}

export function NotFoundRoute({ pathname, onNavigate }) {
  return (
    <SiteFrame pathname={pathname} onNavigate={onNavigate}>
      <NotFoundPage onNavigate={onNavigate} />
    </SiteFrame>
  )
}
