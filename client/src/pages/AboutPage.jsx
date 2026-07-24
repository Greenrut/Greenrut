import heroImage from "../assets/hero.png";
import mikeAdewaraImg from "../assets/mike-adewara.png";
import oniGbengaImg from "../assets/oni-gbenga.png";
import waliuAlakaImg from "../assets/waliu-alaka.png";

const aboutSections = [
  {
    title: "Pioneering the Medicine of the Future.",
    body: "Greenrut bridges ancient botanical wisdom with modern scientific validation, creating therapeutically potent natural solutions rooted in safety, evidence, and transparency.",
    reverse: false,
  },
  {
    title: "Our Mission",
    body: "To harness the profound power of nature through rigorous scientific research, creating 100% natural products that are safe, effective, and enhance the holistic health and well-being of our global community. We are dedicated to translating ancient botanical wisdom into modern, therapeutically potent solutions, ensuring every product delivers on its promise with integrity and transparency.",
    reverse: true,
  },
  {
    title: "Our Vision",
    body: "To be the globally recognized leader in research-driven herbal medicine, transforming lives through natural, scientifically validated, and therapeutically potent solutions. We envision a future where natural health is synonymous with proven efficacy and absolute safety, fostering a deeper, more harmonious connection between humanity and the healing power of nature.",
    reverse: false,
  },
];

const storyParagraphs = [
  "I grew up in a home that smelled of dried leaves, simmering roots, and the faint bitter-sweetness of bark. Not in a laboratory – but in the heart of a Nigerian urban household, where my father, after thirty-five years of civil service, refused to let retirement be an ending.",
  "He called it his “second calling.” I called it the quiet laboratory at the house.",
  "Every morning, he would unfold his worn notebooks – the ones with spirals coming loose and corners softened by humidity. He would grind, measure, steep, and murmur names I could barely pronounce: Ewe Ato, Ewe Lapalapa, Egbo Awin, Asunwon, Bara, Baka. To him, they were not just plants. They were living archives of a knowledge system that had kept our ancestors alive for centuries.",
  "Upon retirement, my father who did not believe in second-hand ethnobotany, travelled to remote villages in Kabba, Ilorin, Ifon, Ife and several locations. Oftentimes for weeks. I remember vividly one January when he returned from Pategi with mud-stained trousers and a clay-pot full of powdered stem bark. He called it ”The fertility herb”.",
  "He documented them, hand-written, coded plant parts. Local names. Preparation steps written like “Boil for fifteen minutes, then strain through clean white cloth.” Followed by “Observed outcomes”. He would track every person he treated – neighbors, fellow retirees, market women, even a distant uncle who had given up on conventional care for stroke. They were not “patients.” They were “witnesses.”",
  "Over a decade, my father became an unofficial, fiercely ethical community doctor and leader. People came from far away. My father would listen first, then examine, reaching for his notebooks or handheld jotter. He documented everything, except – we were too young, distant and naïve to be taught.",
  "Partly, it was age. I was still trying to pursue a degree in medicine, focused on JAMB. Partly, it was family interests – everyone had their own paths, including me!",
  "So when he passed, what remained were his compendiums. Beautiful. Detailed. But out of our reach at his death. However, the experiences lived with us, and the witnesses gave lofty tributes that outlived him for many years.",
  "I realized my father may have failed to transfer his knowledge, but he had transferred the most important part – the proof that it worked. The rest was now our responsibility.",
  "Decades later, armed with a BSc in Biochemistry, an MSc in Drug Discovery and Development (Distinction), and an ongoing PhD, I felt the knowledge was now too fragile. The gap between his generation’s tacit wisdom and my generation’s PowerPoint slides seemed unbridgeable.",
  "Years later, at an event, a woman said “your father saved my brother’s leg. He used a poultice of Ewe Asuwon and something else, do you know the other thing?”",
  "That is the founding truth of Greenrut.",
  "We inherited fragments of that wisdom, but we also have modern science – chromatography, TLC-MS, assays, controlled trials, and a global network of botanists and pharmacologists. We have the tools that can answer my father’s questions: What molecule is responsible? Can we standardize it? Can we scale it?",
  "Greenrut exists because I believe there is a third path. Not the blind rejection of trado-medicine as “unscientific” nor the uncritical worship of heritage as “always better.” But a rigorous, transparent bridge between the two. One where ancient wisdom meets a peer-reviewed paper on uterine contractility.",
  "Today, this journey is our promise. Every formulation is met with scientific rigor. We sell what we can prove, and we are transparent about what we are still learning.",
  "To you, reading this: if you have a fragment of knowledge – a family remedy, a village memory, a fading notebook – we want to hear from you, and we promise to study it. I hope you will walk with us."
];

const team = [
  { name: "Michael Adewara", role: "CEO", image: mikeAdewaraImg },
  { name: "Pharm Olugbenga Oni", role: "Developer", image: oniGbengaImg },
  { name: "Pharm Onyinye Azubogu", role: "Designer", image: waliuAlakaImg },
];

const advisoryCouncil = [
  { name: "Prof Akinniyi Osuntoki", role: "Technical Advisory Council" },
  { name: "Prof Moshood Akinleye", role: "Technical Advisory Council" }
];

const values = [
  {
    title: "Integrity",
    body: "Every polyherbal formulation is a truthful document: We do not invent, exaggerate, or omit. We document what works, what might work, what does not work, and what we do not yet know. If we cannot stand behind a claim with evidence and honesty, we do not make the claim."
  },
  {
    title: "Radical Transparency",
    body: "Every herb and polyherbal formulation undergoes a scientifically rigorous procedure of safety and toxicological assessment, phytochemical screening, therapeutic implications, collaborating with academic institutions, independent labs, and international organizations to achieve monumental results."
  },
  {
    title: "Commitment to Quality & Safety",
    body: "An uncompromising standard on quality and safety, for Your Peace of Mind. Quality and safety start from planting and sourcing raw materials, to Good Manufacturing Practices (GMP) and pharmacovigilance. Our final products have 'zero adverse effects' due to the rigorous testing protocols that ensure product safety and potency, backed by certification from regulatory bodies."
  }
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

        <div className="max-w-[680px] space-y-5 font-serif text-[15px] leading-[1.8] text-[#6b655f] xs:text-[16px] xs:leading-[1.9] lg:text-[17px] text-justify">
          {storyParagraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
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
          className="h-[160px] w-full object-cover object-top xs:h-[190px] sm:h-[210px] lg:h-[250px]"
        />
      ) : (
        <div
          className="h-[160px] bg-cover bg-center xs:h-[190px] sm:h-[210px] lg:h-[250px]"
          style={{ backgroundColor: backgrounds[index % backgrounds.length] || "#ddd" }}
        />
      )}
      <div className="border-t border-[#f0ece3] px-3 py-3 text-center xs:px-4 xs:py-4">
        <h3 className="text-[10px] text-[#4c4843] xs:text-[11px] font-bold">
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

      <section className="page-shell py-14 xs:py-16 lg:py-20 border-t border-[#ece8df]">
        <div className="mx-auto w-full max-w-[760px] px-4 xs:px-2 lg:px-0">
          <h2 className="mb-8 text-center font-serif text-[24px] text-[#2f2b27] xs:text-[28px] sm:text-[30px]">
            Meet the Experts Behind Greenrut.
          </h2>
          <div className="grid grid-cols-1 gap-4 xs:grid-cols-3 xs:gap-3 sm:gap-6 lg:gap-8">
            {team.map((member, index) => (
              <TeamCard key={member.name} member={member} index={index} />
            ))}
          </div>
          
          <h2 className="mb-8 mt-16 text-center font-serif text-[24px] text-[#2f2b27] xs:text-[28px] sm:text-[30px]">
            Technical Advisory Council
          </h2>
          <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 xs:gap-3 sm:gap-6 lg:gap-8 max-w-[500px] mx-auto">
            {advisoryCouncil.map((member, index) => (
              <TeamCard key={member.name} member={member} index={index + team.length} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fafaf8] py-14 xs:py-16 lg:py-20 border-t border-b border-[#ece8df]">
        <div className="mx-auto w-full max-w-[760px] px-4 xs:px-2 lg:px-0">
          <h2 className="mb-10 text-center font-serif text-[24px] text-[#2f2b27] xs:text-[28px] sm:text-[30px]">
            Our Values & Philosophy
          </h2>
          <div className="space-y-8">
            {values.map((item, index) => (
              <div key={index} className="border-l-4 border-[#63ac18] pl-6 py-1">
                <h3 className="font-serif text-[18px] text-[#2f2b27] font-semibold">{item.title}</h3>
                <p className="mt-2 text-[11px] leading-5 text-[#5f5a54] xs:text-[12px] sm:text-[13px] text-justify">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StatsBand />
    </div>
  );
}
