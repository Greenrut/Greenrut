import { HeroBanner, ProductArt } from "../components/SiteChrome.jsx";
import { stats, team } from "../data.js";
import { SectionTitle } from "./shared.jsx";
import bannaImage from "../assets/banna.png";

export function AboutPage() {
  return (
    <>
      <HeroBanner
        title="ABOUT US"
        breadcrumb="Home  /  About us"
        backgroundPhoto={bannaImage}
      />

      <section className="page-shell about-stack">
        <article className="about-row !grid !grid-cols-1 lg:!grid-cols-2 !gap-6 xl:!gap-9 !items-center">
          <div className="about-copy">
            <span className="eyebrow">Greenrut:</span>
            <h2>Pioneering the Medicine of the Future.</h2>
            <p>
              A structured about page that mirrors the supplied reference with
              alternating text and visual blocks, strong whitespace, and serif
              headings.
            </p>
          </div>
          <div className="about-media">
            {/* <ProductArt tone="tea" /> */}
          </div>
        </article>

        <article className="about-row about-row--reverse !grid !grid-cols-1 lg:!grid-cols-2 !gap-6 xl:!gap-9 !items-center">
          <div className="about-media">
            {/* <ProductArt tone="bowl" /> */}
          </div>
          <div className="about-copy">
            <span className="eyebrow">Greenrut:</span>
            <h2>Our Mission</h2>
            <p>
              To build a clear, reusable storefront foundation for the brand and
              keep the page structure easy to scan.
            </p>
          </div>
        </article>

        <article className="about-row !grid !grid-cols-1 lg:!grid-cols-2 !gap-6 xl:!gap-9 !items-center">
          <div className="about-copy">
            <span className="eyebrow">Greenrut:</span>
            <h2>Our Vision</h2>
            <p>
              A polished experience that is calm, trustworthy, and easy to
              maintain across product pages and supporting views.
            </p>
          </div>
          <div className="about-media">
            {/* <ProductArt tone="leaf" /> */}
          </div>
        </article>
      </section>

      <section className="story-band">
        <div className="page-shell story-band__inner">
          <span className="sprout" aria-hidden="true" />
          <h2>Our Story</h2>
          <p>
            This area echoes the long-form editorial section in the reference by
            using a centered column, small type, and generous spacing.
          </p>
        </div>
      </section>

      <section className="page-shell team-grid">
        <SectionTitle title="Meet the Experts Behind Greenrut." />
        {team.length ? (
          <div className="team-grid__list !grid !grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-3 !gap-[18px]">
            {team.map((member, index) => (
              <article key={member.name} className="team-card">
                <div className={`team-card__portrait team-card__portrait--${index + 1}`} />
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </article>
            ))}
          </div>
        ) : (
          <p>No team members added yet.</p>
        )}
      </section>

      <section className="stats-band">
        {stats.length ? (
          <div className="page-shell stats-band__list !grid !grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-4 !gap-[18px]">
            {stats.map((item) => (
              <div key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="page-shell">
            <p>No stats available yet.</p>
          </div>
        )}
      </section>
    </>
  );
}
