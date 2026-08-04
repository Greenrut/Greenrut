import heroImage from "../assets/hero.png";
import mikeAdewaraImg from "../assets/mike-adewara.png";
import oniGbengaImg from "../assets/oni-gbenga.png";
import waliuAlakaImg from "../assets/waliu-alaka.png";

const aboutSections = [
  {
    title: "Pioneering the Medicine of the Future.",
    body:
      "Greenrut is a premium herbal medicine company built to bridge traditional botanical knowledge and modern scientific validation. Our work begins with nature, but every serious claim must pass through research, quality control, and responsible product development.",
    reverse: false,
  },
  {
    title: "Our Mission",
    body:
      "Our mission is to harness the profound power of nature through rigorous scientific research, creating herbal products that are safe, effective, and relevant to everyday wellbeing. We translate ancient botanical wisdom into modern, therapeutically potent solutions with integrity and transparency.",
    reverse: true,
  },
  {
    title: "Our Vision",
    body:
      "Our vision is to become a globally recognized leader in research-driven herbal medicine. We imagine a future where natural health is trusted because it is carefully studied, clearly documented, ethically produced, and proven through transparent science.",
    reverse: false,
  },
];

const storyParagraphs = [
  "I grew up in a home that smelled of dried leaves, simmering roots, and the faint bitter-sweetness of bark. Not in a laboratory, but in the heart of a Nigerian urban home where my father, after thirty-five years of civil service, refused to let retirement be an ending.",
  "He called it his second calling. I called it the quiet laboratory at the house.",
  "Every morning, he would unfold his worn notebooks, the ones with spirals coming loose and corners softened by humidity. He would grind, measure, steep, and murmur names I could barely pronounce: Ewe Ato, Ewe Lapalapa, Egbo Awin, Asunwon, Bara, and Baka. To him, they were not just plants. They were living archives of a knowledge system that had kept our ancestors alive for centuries.",
  "Upon retirement, my father, who did not believe in second-hand ethnobotany, travelled to remote villages in Kabba, Ilorin, Ifon, Ife, and several other locations, often for weeks. I remember vividly one January when he returned from Pategi with mud-stained trousers and a clay pot full of powdered stem bark. He called it the fertility herb.",
  "He documented them by hand: coded plant parts, local names, preparation steps, and observed outcomes. He would track every person he treated: neighbors, fellow retirees, market women, and even a distant uncle who had given up on conventional care for stroke. They were not patients to him. They were witnesses.",
  "Over a decade, my father became an unofficial, fiercely ethical community doctor and leader. People came from far away. He would listen first, then examine, reaching for his notebooks or handheld jotter. He documented everything, except we were too young, distant, and naive to be taught.",
  "When he passed, what remained were his compendiums: beautiful, detailed, and almost out of reach. But the experiences lived with us, and the witnesses gave tributes that outlived him for many years.",
  "I realized my father may have failed to transfer his knowledge, but he had transferred the most important part: the proof that it worked. The rest was now our responsibility.",
  "Decades later, armed with a BSc in Biochemistry, an MSc in Drug Discovery and Development with Distinction, and an ongoing PhD, I felt the knowledge was too fragile to leave undocumented. The gap between his generation's tacit wisdom and my generation's scientific tools had to be bridged.",
  "Years later, at an event, a woman said, your father saved my brother's leg. He used a poultice of Ewe Asuwon and something else. Do you know the other thing?",
  "That is the founding truth of Greenrut.",
  "We inherited fragments of that wisdom, but we also have modern science: chromatography, TLC-MS, assays, controlled trials, and a global network of botanists and pharmacologists. We have the tools that can answer my father's questions: What molecule is responsible? Can we standardize it? Can we scale it?",
  "Greenrut exists because I believe there is a third path. Not the blind rejection of traditional medicine as unscientific, and not the uncritical worship of heritage as always better, but a rigorous and transparent bridge between the two. One where ancient wisdom meets peer-reviewed evidence.",
  "Today, this journey is our promise. Every formulation is met with scientific rigor. We sell what we can prove, and we are transparent about what we are still learning.",
  "To you, reading this: if you have a fragment of knowledge, a family remedy, a village memory, or a fading notebook, we want to hear from you, and we promise to study it. I hope you will walk with us.",
];

const team = [
  { name: "Michael Adewara", role: "CEO", image: mikeAdewaraImg },
  { name: "Pharm Olugbenga Oni", role: "Developer", image: oniGbengaImg },
  { name: "Pharm Onyinye Azubogu", role: "Designer", image: waliuAlakaImg },
];

const advisoryCouncil = [
  { name: "Prof Akinniyi Osuntoki", role: "Technical Advisory Council" },
  { name: "Prof Moshood Akinleye", role: "Technical Advisory Council" },
];

const values = [
  {
    title: "Integrity",
    body:
      "Every formulation must be a truthful document. We do not invent, exaggerate, or omit. We document what works, what may work, what does not work, and what we do not yet know. If we cannot stand behind a claim with evidence and honesty, we do not make the claim.",
  },
  {
    title: "Radical Transparency",
    body:
      "Our herbs and polyherbal formulations go through safety review, toxicological assessment, phytochemical screening, and therapeutic evaluation. We work toward collaboration with academic institutions, independent laboratories, and international partners so the public can trust both our process and our products.",
  },
  {
    title: "Commitment to Quality & Safety",
    body:
      "Quality begins with sourcing and continues through preparation, manufacturing, packaging, and pharmacovigilance. Our zero adverse effect promise is a commitment to rigorous testing, responsible claims, careful documentation, and continuous monitoring after a product reaches customers.",
  },
];

const stats = [
  { value: "100%", label: "Herbal Focus" },
  { value: "0", label: "Toxicology Promise" },
  { value: "12+", label: "Research Years" },
  { value: "4", label: "Product Pillars" },
];

function AboutBlock({ title, body, reverse }) {
  return (
    <article
      className={`flex flex-col items-center gap-5 py-5 text-center xs:flex-row xs:items-center xs:gap-8 xs:text-left lg:gap-12 ${
        reverse ? "xs:flex-row-reverse" : "xs:flex-row"
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="mb-3 text-[11px] font-semibold text-[#63ac18]">Greenrut:</p>
        <h2 className="font-serif text-[20px] leading-[1.15] text-[#2f2b27] xs:text-[24px] lg:text-[28px]">
          {title}
        </h2>
        <p className="mt-3 text-[12px] leading-6 text-[#5f5a54] lg:text-[13px]">
          {body}
        </p>
      </div>
      <div className="flex-shrink-0 overflow-hidden">
        <img
          src={heroImage}
          alt={title}
          className="h-[170px] w-full max-w-[320px] object-cover xs:h-[150px] xs:w-[260px] lg:h-[185px] lg:w-[340px]"
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

        <div className="max-w-[690px] space-y-5 font-serif text-[15px] leading-[1.8] text-[#6b655f] xs:text-[16px] xs:leading-[1.9] lg:text-[17px]">
          {storyParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamCard({ member, index }) {
  const backgrounds = ["#cfcfcf", "#eadfd6", "#d4d1cf", "#dfdbd4", "#eedfd6"];
  return (
    <article className="overflow-hidden border border-[#ece8df] bg-white shadow-[0_1px_0_rgba(0,0,0,0.02)]">
      {member.image ? (
        <img
          src={member.image}
          alt={member.name}
          className="h-[220px] w-full object-cover object-top xs:h-[190px] sm:h-[230px] lg:h-[270px]"
        />
      ) : (
        <div
          className="grid h-[160px] place-items-center bg-cover bg-center px-4 text-center text-[12px] text-[#5f5a54] xs:h-[190px] sm:h-[230px] lg:h-[270px]"
          style={{ backgroundColor: backgrounds[index % backgrounds.length] || "#ddd" }}
        >
          Advisor profile image
        </div>
      )}
      <div className="border-t border-[#f0ece3] px-3 py-4 text-center">
        <h3 className="text-[11px] font-bold text-[#4c4843]">{member.name}</h3>
        <p className="mt-1 text-[10px] text-[#8b867f]">{member.role}</p>
      </div>
    </article>
  );
}

function StatsBand() {
  return (
    <section className="bg-[#efefef] py-12 xs:py-14">
      <div className="mx-auto grid w-full max-w-[760px] grid-cols-2 gap-x-4 gap-y-8 px-4 sm:grid-cols-4 sm:gap-x-6">
        {stats.map((item) => (
          <div key={item.label} className="text-center">
            <strong className="block font-serif text-[26px] text-[#5ca61f] xs:text-[30px]">
              {item.value}
            </strong>
            <span className="mt-1 block text-[12px] text-[#5a554f]">
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
    <div>
      <section className="page-shell py-10 xs:py-12 lg:py-14">
        <div className="mx-auto w-full max-w-[820px] px-4 xs:px-2 lg:px-0">
          <div className="space-y-8 lg:space-y-10">
            {aboutSections.map((section) => (
              <AboutBlock key={section.title} {...section} />
            ))}
          </div>
        </div>
      </section>

      <StorySection />

      <section className="page-shell border-t border-[#ece8df] py-14 xs:py-16 lg:py-20">
        <div className="mx-auto w-full max-w-[900px] px-4 xs:px-2 lg:px-0">
          <h2 className="mb-8 text-center font-serif text-[24px] text-[#2f2b27] xs:text-[28px]">
            Meet the Experts Behind Greenrut.
          </h2>
          <div className="grid grid-cols-1 gap-5 xs:grid-cols-3 sm:gap-6 lg:gap-8">
            {team.map((member, index) => (
              <TeamCard key={member.name} member={member} index={index} />
            ))}
          </div>

          <h2 className="mb-8 mt-16 text-center font-serif text-[24px] text-[#2f2b27] xs:text-[28px]">
            Technical Advisory Council
          </h2>
          <div className="mx-auto grid max-w-[560px] grid-cols-1 gap-5 xs:grid-cols-2 sm:gap-6 lg:gap-8">
            {advisoryCouncil.map((member, index) => (
              <TeamCard key={member.name} member={member} index={index + team.length} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#ece8df] bg-[#fafaf8] py-14 xs:py-16 lg:py-20">
        <div className="mx-auto w-full max-w-[820px] px-4 xs:px-2 lg:px-0">
          <h2 className="mb-10 text-center font-serif text-[24px] text-[#2f2b27] xs:text-[28px]">
            Our Values & Philosophy
          </h2>
          <div className="space-y-8">
            {values.map((item) => (
              <div key={item.title} className="border-l-4 border-[#63ac18] py-1 pl-6">
                <h3 className="font-serif text-[19px] font-semibold text-[#2f2b27]">
                  {item.title}
                </h3>
                <p className="mt-2 text-[12px] leading-6 text-[#5f5a54] sm:text-[13px]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StatsBand />
    </div>
  );
}
