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
    <section className="badge-row page-shell !grid !grid-cols-1 xs:!grid-cols-2 lg:!grid-cols-4 !gap-[18px]">
      <div>
        <span className="badge-icon badge-icon--medal" />
        <p>Products Certified</p>
      </div>
      <div>
        <span className="badge-icon badge-icon--lab" />
        <p>Scientifically Verified</p>
      </div>
      <div>
        <span className="badge-icon badge-icon--microscope" />
        <p>12 Years Of Research & Development</p>
      </div>
      <div>
        <span className="badge-icon badge-icon--flag" />
        <p>Made In Nigeria</p>
      </div>
    </section>
  )
}
