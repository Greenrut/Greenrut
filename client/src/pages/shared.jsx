export function SectionTitle({ title, subtitle }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  )
}

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
        <img src={development} alt="12 Years Of Research & Development" />
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
