export function SectionTitle({ title, subtitle }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  )
}

function BadgeIconCertified() {
  return (
    <svg viewBox="0 0 44 44" aria-hidden="true">
      <circle cx="22" cy="18" r="12" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M22 11.5l2.1 4.3 4.7.7-3.4 3.3.8 4.7-4.2-2.2-4.2 2.2.8-4.7-3.4-3.3 4.7-.7L22 11.5Z" fill="currentColor" />
export function BadgeRow() {
  return (
    <section className="badge-row">
      <div>
        <span className="badge-row__icon"><BadgeIconCertified /></span>
        <p>Products Certified</p>
      </div>
      <div>
        <span className="badge-row__icon"><BadgeIconVerified /></span>
        <p>Scientifically Verified</p>
      </div>
      <div>
        <span className="badge-row__icon"><BadgeIconResearch /></span>
        <p>12 Years Of Research &amp; Development</p>
      </div>
      <div>
        <span className="badge-row__icon"><BadgeIconNigeria /></span>
        <p>Made In Nigeria</p>
      </div>
    </section>
  )
}

export function NewsletterBand() {
  return (
    <section className="newsletter-band page-shell">
      <div className="newsletter-band__inner">
        <h2>Join to our Newsletter</h2>
        <form className="newsletter-form" onSubmit={(event) => event.preventDefault()}>
          <input type="email" name="email" placeholder="Your Email Address*" aria-label="Your Email Address" />
          <button type="submit">SUBSCRIBE</button>
        </form>
      </div>
      <BadgeRow />
    </section>
  )
}
