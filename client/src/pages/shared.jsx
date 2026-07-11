import development from '../assets/devloment.png'
import nigeria from '../assets/nigeria.png'

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
        <img src={certified} alt="Products Certified" />
        <p>Products Certified</p>
      </div>
      <div>
        <img src={verified} alt="Scientifically Verified" />
        <p>Scientifically Verified</p>
      </div>
      <div>
        <img src={development} alt="12 Years Of Research & Development" />
        <p>12 Years Of Research & Development</p>
      </div>
      <div>
        <img src={nigeria} alt="Made In Nigeria" />
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
