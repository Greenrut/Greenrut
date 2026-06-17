import { HeroBanner } from '../components/SiteChrome.jsx'
import { SectionTitle } from './shared.jsx'

export function ContactPage() {
  return (
    <>
      <HeroBanner title="CONTACT US" breadcrumb="Home  /  Contact us" />
      <section className="page-shell contact-layout !grid !grid-cols-1 lg:!grid-cols-[minmax(0,1fr)_380px] !gap-6 xl:!gap-7">
        <div className="contact-form-panel">
          <SectionTitle
            title="Contact Form"
            subtitle="There are many variations of passages of Lorem Ipsum available, but the majority Lorem Ipsum available."
          />
          <div className="contact-form-grid !grid !grid-cols-1 xs:!grid-cols-2 !gap-4">
            <input type="text" placeholder="Full Name" />
            <input type="email" placeholder="Email Address" />
          </div>
          <input type="text" placeholder="Subject" />
          <textarea placeholder="Message" rows={9} />
          <button type="button" className="primary-button">
            SEND MESSAGE
          </button>
        </div>

        <aside className="contact-side">
          <SectionTitle
            title="Contact Address"
            subtitle="There are many variations of passages of Lorem Ipsum available, but the majority Lorem Ipsum available."
          />
          <div className="contact-block">
            <h3>Our Address</h3>
            <p>Your address goes here</p>
          </div>
          <div className="contact-block">
            <h3>Phone Number</h3>
            <p>0123456789</p>
            <p>0123456789</p>
          </div>
          <div className="contact-block">
            <h3>Web Address</h3>
            <p>demo@example.com</p>
            <p>demo@example.com</p>
          </div>
        </aside>
      </section>

      <section className="page-shell map-panel">
        <div className="map-panel__surface" aria-hidden="true">
          <span className="map-grid" />
          <span className="map-marker" />
        </div>
      </section>
    </>
  )
}
