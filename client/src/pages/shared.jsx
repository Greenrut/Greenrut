export function SectionTitle({ title, subtitle }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  )
}

import certificationIcon from '../assets/certification64.png'
import microscopeIcon from '../assets/microscope64.png'
import developmentIcon from '../assets/devloment.png'
import madeInNigeriaIcon from '../assets/madeinnigeria64.png'

export function BadgeRow() {
  return (
    <section className="badge-row">
      <div>
        <span className="badge-row__icon">
          <img src={certificationIcon} alt="" aria-hidden="true" />
        </span>
        <p>Products Certified</p>
      </div>
      <div>
        <span className="badge-row__icon">
          <img src={microscopeIcon} alt="" aria-hidden="true" />
        </span>
        <p>Scientifically Verified</p>
      </div>
      <div>
        <span className="badge-row__icon">
          <img src={developmentIcon} alt="" aria-hidden="true" />
        </span>
        <p>12 Years Of Research &amp; Development</p>
      </div>
      <div>
        <span className="badge-row__icon">
          <img src={madeInNigeriaIcon} alt="" aria-hidden="true" />
        </span>
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
