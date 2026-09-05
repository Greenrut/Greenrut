import { useEffect, useMemo, useState } from "react";
import { getImageSource } from "../lib/image.js";
import { publicRequest } from "../lib/publicApi.js";
import heroImage from "../assets/hero.png";
import { fallbackResources } from "../data.js";

function getImageUrl(image) {
  if (!image) return "";
  if (typeof image === "string") return image;
  if (typeof image === "object")
    return image.url || image.src || image.secureUrl || image.path || "";
  return "";
}

function normalizeResource(item) {
  const title = item.title || item.name || "Untitled Resource";
  return {
    id: item.id || item._id || title,
    title,
    section: item.section || item.category || "General",
    type: item.type || item.resourceType || "",
    excerpt: item.excerpt || item.description || "",
    localName: item.localName || item.local_name || "",
    therapeuticUse:
      item.therapeuticUse || item.therapeutic_use || item.use || "",
    preparationMethod:
      item.preparationMethod ||
      item.preparation_method ||
      item.preparation ||
      "",
    dosage: item.dosage || item.dose || "",
    constituents: item.constituents || item.majorConstituents || item.api || "",
    resourceUrl:
      item.resourceUrl || item.resource_url || item.url || item.link || "",
    image: getImageSource(
      item.image ||
        item.thumbnail ||
        (Array.isArray(item.images) ? item.images[0] : ""),
      { width: 760 },
    ),
    linkedProductId: item.linkedProductId || item.productId || "",
  };
}

function LibraryCard({ item, onOpen }) {
  return (
    <button
      type="button"
      className="block w-full text-left"
      onClick={onOpen}
      aria-label={`Open ${item.title}`}
    >
      <article className="overflow-hidden border border-[#ece8df] bg-white">
        <div className="h-[150px] bg-[#f5f5f1]">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-[11px] text-[#9a958c]">
              No image
            </div>
          )}
        </div>
        <div className="p-4">
          <p className="text-[10px] uppercase tracking-[0.16em] text-[#73aa23]">
            {item.type || item.section}
          </p>
          <h3 className="mt-2 text-[15px] font-medium text-[#2e2a26]">
            {item.title}
          </h3>
          <p className="mt-2 text-[13px] leading-6 text-[#645f59]">
            {item.excerpt}
          </p>
          <dl className="mt-3 grid gap-1 text-[11px] leading-5 text-[#6b655f]">
            {item.localName ? (
              <div>
                <dt className="font-semibold">Local name:</dt>
                <dd>{item.localName}</dd>
              </div>
            ) : null}
            {item.therapeuticUse ? (
              <div>
                <dt className="font-semibold">Use:</dt>
                <dd>{item.therapeuticUse}</dd>
              </div>
            ) : null}
            {item.constituents ? (
              <div>
                <dt className="font-semibold">Constituents:</dt>
                <dd>{item.constituents}</dd>
              </div>
            ) : null}
          </dl>
          <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-[#1f1c19]">
            Open resource <span aria-hidden="true">&rarr;</span>
          </span>
        </div>
      </article>
    </button>
  );
}

export function LibraryPage({ onNavigate }) {
  const [resources, setResources] = useState([]);
  const [activeSection, setActiveSection] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeHerb, setActiveHerb] = useState("All");
  const [activeUse, setActiveUse] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadResources() {
      try {
        setLoading(true);
        const response = await publicRequest("/library-items");
        if (!cancelled)
          setResources((response.data || []).map(normalizeResource));
      } catch (requestError) {
        if (!cancelled)
          setError(requestError.message || "Failed to load library content");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadResources();
    return () => {
      cancelled = true;
    };
  }, []);

  const libraryItems = resources.length ? resources : fallbackResources;

  const sections = useMemo(() => {
    const names = Array.from(
      new Set(libraryItems.map((item) => item.section).filter(Boolean)),
    );
    return names.length ? names : ["General"];
  }, [libraryItems]);

  useEffect(() => {
    if (!sections.length) return;
    if (!activeSection || !sections.includes(activeSection)) {
      setActiveSection(sections[0]);
    }
  }, [activeSection, sections]);

  const therapeuticUses = useMemo(() => {
    const uses = libraryItems
      .flatMap((item) => String(item.therapeuticUse || "").split(","))
      .map((item) => item.trim())
      .filter(Boolean);
    return ["All", ...Array.from(new Set(uses))];
  }, [libraryItems]);

  const herbs = useMemo(() => {
    const names = libraryItems
      .filter(
        (item) =>
          String(item.section || "")
            .toLowerCase()
            .includes("herb") || item.localName,
      )
      .map((item) =>
        item.localName ? `${item.title} - ${item.localName}` : item.title,
      )
      .filter(Boolean);
    return ["All", ...Array.from(new Set(names))];
  }, [libraryItems]);

  const filteredResources = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return libraryItems.filter((item) => {
      const matchesSection = item.section === activeSection;
      const herbLabel = item.localName
        ? `${item.title} - ${item.localName}`
        : item.title;
      const haystack = [
        item.title,
        item.localName,
        item.therapeuticUse,
        item.preparationMethod,
        item.dosage,
        item.constituents,
        item.excerpt,
      ]
        .join(" ")
        .toLowerCase();
      const matchesSearch = !query || haystack.includes(query);
      const matchesHerb = activeHerb === "All" || herbLabel === activeHerb;
      const matchesUse =
        activeUse === "All" ||
        String(item.therapeuticUse || "")
          .toLowerCase()
          .includes(activeUse.toLowerCase());
      return matchesSection && matchesSearch && matchesHerb && matchesUse;
    });
  }, [libraryItems, activeSection, searchTerm, activeHerb, activeUse]);

  const openResource = (item) => {
    onNavigate?.(`/library/resource?id=${encodeURIComponent(item.id)}`);
  };

  return (
    <section className="page-shell py-6 xs:py-8 lg:py-10">
      <div className="mb-5 overflow-hidden border border-[#efefef] bg-white reveal-on-scroll reveal-slide-up">
        <div
          className="flex min-h-[180px] items-center justify-center px-4 text-center"
          style={{
            backgroundImage: `linear-gradient(rgba(10, 20, 10, 0.52), rgba(10, 20, 10, 0.52)), url('${heroImage}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="max-w-[520px] text-white">
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/70">
              Herb Library
            </p>
            <h1 className="mt-2 font-serif text-[30px] leading-none xs:text-[34px]">
              Dynamic Herbal Catalogue
            </h1>
            <p className="mt-3 text-[12px] leading-6 text-white/80 xs:text-[13px]">
              Browse herbs by local name, therapeutic use, preparation method,
              dosage notes, and major active constituents.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-[980px] gap-5 lg:grid-cols-[200px_minmax(0,1fr)]">
        <aside className="h-fit border border-[#efefef] bg-white reveal-on-scroll reveal-slide-up">
          {sections.map((section) => (
            <button
              key={section}
              type="button"
              onClick={() => setActiveSection(section)}
              className={`block w-full border-b border-[#f2f2f2] px-4 py-3 text-left text-[13px] leading-5 transition-colors last:border-b-0 ${
                activeSection === section
                  ? "border-l-[3px] border-l-[#63ac18] bg-[#f3f8ec] font-semibold text-[#2e2a26] pl-[13px]"
                  : "text-[#5a544c] hover:bg-[#faf9f6]"
              }`}
            >
              {section}
            </button>
          ))}
        </aside>

        <div>
          <div className="mb-3 grid gap-3 border border-[#efefef] bg-white px-4 py-3 text-[13px] text-[#5a544c] lg:grid-cols-[1fr_190px_170px_auto_auto] lg:items-center reveal-on-scroll reveal-slide-up reveal-delay-100">
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              type="search"
              placeholder="Search herb, local name, use, dosage, constituent..."
              className="border border-[#efefef] px-3 py-2"
            />
            <select
              value={activeHerb}
              onChange={(event) => setActiveHerb(event.target.value)}
              className="border border-[#efefef] px-3 py-2"
            >
              {herbs.map((herb) => (
                <option key={herb} value={herb}>
                  {herb === "All" ? "All herbs" : herb}
                </option>
              ))}
            </select>
            <select
              value={activeUse}
              onChange={(event) => setActiveUse(event.target.value)}
              className="border border-[#efefef] px-3 py-2"
            >
              {therapeuticUses.map((use) => (
                <option key={use} value={use}>
                  {use}
                </option>
              ))}
            </select>
            <span className="font-semibold text-[#2e2a26]">
              {activeSection || sections[0]}
            </span>
            <span>{filteredResources.length} resources</span>
          </div>

          {loading ? (
            <p className="py-4 text-sm text-[#6f6b64]">
              Loading library items...
            </p>
          ) : null}
          {error ? <p className="py-4 text-sm text-red-600">{error}</p> : null}

          {!loading && !error ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredResources.map((item, index) => {
                const delayClass = `reveal-delay-${(index % 3) * 100}`;
                return (
                  <div
                    key={item.id || item.slug || item.title}
                    className={`reveal-on-scroll reveal-slide-up ${delayClass}`}
                  >
                    <LibraryCard
                      item={item}
                      onOpen={() => openResource(item)}
                    />
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
