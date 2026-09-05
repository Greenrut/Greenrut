import { HeroBanner } from '../components/SiteChrome.jsx'
import { SectionTitle } from './shared.jsx'
import bannaImage from '../assets/banna.png'

export function ContactPage() {
  return (
    <>
      <HeroBanner
        title="CONTACT US"
        breadcrumb="Home  /  Contact us"
        backgroundPhoto={bannaImage}
      />
      <section className="page-shell contact-layout !grid !grid-cols-1 lg:!grid-cols-[minmax(0,1fr)_380px] !gap-6 xl:!gap-7">
        <div className="contact-form-panel reveal-on-scroll reveal-slide-up">
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

        <aside className="contact-side reveal-on-scroll reveal-slide-up reveal-delay-150">
          <SectionTitle
            title="Contact Address"
            subtitle="There are many variations of passages of Lorem Ipsum available, but the majority Lorem Ipsum available."
          />
          <div className="contact-block">
            <h3>Our Address</h3>
            <p>Lagos/Abuja</p>
          </div>
          <div className="contact-block">
            <h3>Phone Number</h3>
            <p>07048005656</p>
          </div>
          <div className="contact-block">
            <h3>Emails</h3>
            <p>Info@greenrut.com</p>
            <p>Hello@greenrut.com</p>
          </div>
        </aside>
      </section>

      <section className="page-shell map-panel reveal-on-scroll reveal-slide-up">
        <div className="map-panel__surface" aria-hidden="true">
          <span className="map-grid" />
          <span className="map-marker" />
        </div>
      </section>
    </>
  )
}
