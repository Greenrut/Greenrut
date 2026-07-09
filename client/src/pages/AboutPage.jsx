import heroImage from "../assets/hero.png";

const aboutSections = [
  {
    // eyebrow: 'Greenrut:',
    title: "Pioneering the Medicine of the Future.",
    body: "Greenrut is pioneering the future of herbal wellness through products inspired by nature and shaped for a modern audience. The focus is on clear, trustworthy presentation and a calm visual rhythm that makes the brand feel grounded and premium.",
    reverse: false,
  },
  {
    // eyebrow: 'Greenrut:',
    title: "Our Mission",
    body: "Our mission is to create a dependable experience that reflects care, consistency, and quality. We want every part of the Greenrut presence to feel considered, from the product story to the supporting content and every detail in between.",
    reverse: true,
  },
  {
    // eyebrow: 'Greenrut:',
    title: "Our Vision",
    body: "Our vision is a brand experience that feels confident, serene, and memorable. We aim to balance strong design with practical clarity so the product story is easy to understand and pleasant to explore.",
    reverse: false,
  },
];

const storyParagraphs = [
  "I grew up in a home that smelled of dried leaves, simmering roots, and the faint bitter-sweetness of bark. Not in a laboratory, but in the heart of a Nigerian urban household where my father, after thirty-five years of civil service, refused to let retirement be an ending.",
  "He called it his “second calling.” I called it the quiet laboratory at the house. Every morning he would unfold his worn notebooks, the ones with spirals coming loose and corners softened by humidity, and measure, steep, and murmur names I could barely pronounce.",
  "Upon retirement, my father who did not believe in second-hand ethnobotany, travelled to remote villages, documented everything, and returned with notebooks, dried plants, and the patient curiosity of a teacher who understood that healing begins with listening.",
  "Over a decade, he became an unofficial, fiercely ethical community doctor and leader. People came from far away. He would listen first, then examine, reaching for his notebooks or handwritten jottings.",
  "Years later, when I began to build Greenrut, I understood that what mattered most was not only the formula, but the dignity of the story around it. The brand grew from that memory: careful, useful, and rooted in trust.",
];

const team = [
  { name: "Michael Adewara", role: "CEO" },
  { name: "Pharm Olugbenga Oni", role: "Developer" },
  { name: "Pharm Onyinye Azubogu", role: "Designer" },
];

const stats = [
  { value: "360", label: "Project Done" },
  { value: "690", label: "Cups Of Coffee" },
  { value: "420", label: "Branding" },
  { value: "100", label: "Happy Clients" },
];

function AboutBlock({ title, body, reverse }) {
  return (
    <article
      className={`flex flex-col items-center gap-3 py-4 text-center xs:flex-row xs:items-center xs:gap-6 xs:text-left sm:gap-8 lg:gap-10 ${
        reverse ? "xs:flex-row-reverse" : "xs:flex-row"
      }`}
    >
      <div className="about-copy min-w-0 flex-1">
        
        <h2 className="font-serif text-[18px] leading-[1.15] text-[#2f2b27] xs:text-[22px] sm:text-[26px] lg:text-[28px]">
          {title}
        </h2>
        <p className="mt-2 text-[10px] leading-5 text-[#5f5a54] xs:mt-3 xs:text-[11px] sm:text-[12px] lg:text-[13px]">
          {body}
        </p>
      </div>
      <div className="about-media flex-shrink-0 overflow-hidden rounded-lg ">
        <img
          src={heroImage}
          alt={title}
          className="h-[140px] w-[200px] object-cover xs:h-[110px] xs:w-[160px] sm:h-[150px] sm:w-[230px] lg:h-[170px] lg:w-[300px]"
        />
      </div>
    </article>
  );
}

function StorySection() {
  return (
    <section className="bg-[#f4f4f1] py-14 xs:py-16 lg:py-20">
      <div className="mx-auto flex w-full max-w-[820px] flex-col items-center px-4 text-center">
        <div className="mb-6 grid justify-items-center gap-2 text-[#7fb53a]">
          <div className="sprout" aria-hidden="true" />
          <p className="text-[10px] uppercase tracking-[0.16em] text-[#8d8d8d]">
            Our Story
          </p>
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#b6b6b6]">
            The Quiet Laboratory at Home
          </p>
        </div>

        <div className="max-w-[680px] space-y-5 font-serif text-[16px] leading-[1.8] text-[#6b655f] xs:text-[18px] xs:leading-[1.9] lg:text-[20px]">
          {storyParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamCard({ member, index }) {
  const backgrounds = ["#cfcfcf", "#eadfd6", "#d4d1cf"];
  return (
    <article className="overflow-hidden border border-[#ece8df] bg-white shadow-[0_1px_0_rgba(0,0,0,0.02)]">
      <div
        className="h-[160px] bg-cover bg-center xs:h-[190px] sm:h-[210px] lg:h-[250px]"
        style={{ backgroundColor: backgrounds[index] || "#ddd" }}
      />
      <div className="border-t border-[#f0ece3] px-3 py-3 text-center xs:px-4 xs:py-4">
        <h3 className="text-[10px] text-[#4c4843] xs:text-[11px]">
          {member.name}
        </h3>
        <p className="mt-1 text-[9px] text-[#8b867f] xs:text-[10px]">
          {member.role}
        </p>
      </div>
    </article>
  );
}

function StatsBand() {
  return (
    <section className="bg-[#efefef] py-12 xs:py-14">
      <div className="mx-auto grid w-full max-w-[760px] grid-cols-2 gap-x-4 gap-y-8 px-4 sm:grid-cols-4 sm:gap-x-6 sm:gap-y-0 lg:gap-x-8">
        {stats.map((item) => (
          <div key={item.label} className="text-center">
            <strong className="block font-serif text-[24px] text-[#5ca61f] xs:text-[28px] sm:text-[30px]">
              {item.value}
            </strong>
            <span className="mt-1 block text-[11px] text-[#5a554f] xs:text-[13px]">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function AboutPage() {
  return (
    <div className="">
      <section className="page-shell py-10 xs:py-12 lg:py-14">
        <div className="mx-auto w-full max-w-[760px] px-4 xs:px-2 lg:px-0">
          <div className="space-y-6 xs:space-y-8 lg:space-y-10">
            {aboutSections.map((section) => (
              <AboutBlock key={section.title} {...section} />
            ))}
          </div>
        </div>
      </section>

      <StorySection />

      <section className="page-shell py-14 xs:py-16 lg:py-20">
        <div className="mx-auto w-full max-w-[760px] px-4 xs:px-2 lg:px-0">
          <h2 className="mb-8 text-center font-serif text-[24px] text-[#2f2b27] xs:text-[28px] sm:text-[30px]">
            Meet the Experts Behind Greenrut.
          </h2>
          <div className="grid grid-cols-1 gap-4 xs:grid-cols-3 xs:gap-3 sm:gap-6 lg:gap-8">
            {team.map((member, index) => (
              <TeamCard key={member.name} member={member} index={index} />
            ))}
          </div>
        </div>
      </section>

      <StatsBand />
    </div>
  );
}