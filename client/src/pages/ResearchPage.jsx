import { useEffect, useMemo, useState } from 'react'
import { getImageSource } from '../lib/image.js'
import { publicRequest } from '../lib/publicApi.js'
import heroImage from '../assets/hero.png'
import bannerImage from '../assets/banna.png'

const researchPhases = [
  { key: 'ongoing', label: 'Ongoing Research' },
  { key: 'concluded', label: 'Concluded Research' },
  { key: 'future', label: 'Future Research' },
]

const fallbackProducts = [
  { id: 'fallback-1', name: 'Nature Close Tea', phase: 'ongoing', image: heroImage },
  { id: 'fallback-2', name: 'Pink wave Cup', phase: 'ongoing', image: bannerImage },
  { id: 'fallback-3', name: 'Tea and Chai', phase: 'ongoing', image: heroImage },
  { id: 'fallback-4', name: 'Green Rut Formula', phase: 'concluded', image: bannerImage },
  { id: 'fallback-5', name: 'Future Wellness Blend', phase: 'future', image: heroImage },
]

const researchAreas = [
  'Cancer Research',
  'Sexual & Reproductive Health (Fibroid, PCOS, Fertility)',
  'Heart Health',
  'Digestive & Gut Health',
  'Eyes & Brain Health',
  'Bones & Joint Health',
]

const researchAreaDetails = {
  'Cancer Research': {
    title: 'Cancer Research',
    subtitle: 'Investigation of anti-proliferative and apoptotic herbal mechanisms.',
    impact: 'Focuses on identifying bioactive compounds that selectively induce apoptosis in oncogenic cell lines while maintaining normal cell viability. Investigations center on regulating cell cycle progression and modulating signaling pathways.',
    toxicology: 'Rigorous in-vitro cytotoxicity profiling across multiple healthy human cell lines to establish high selectivity indices and ensure zero toxic off-target accumulation.',
    bioavailability: 'Studies on molecular formulation to enhance the oral absorption of hydrophobic compounds like polyphenols and terpenoids using natural lecithin-based carrier systems.',
    methodology: 'Iterative screening starting with high-throughput in-vitro assays, transitioning to in-vivo validation models, and culminating in standardized cohort observational trials.'
  },
  'Sexual & Reproductive Health (Fibroid, PCOS, Fertility)': {
    title: 'Sexual & Reproductive Health (Fibroid, PCOS, Fertility)',
    subtitle: 'Hormonal balancing, uterine tissue optimization, and fertility support.',
    impact: 'Dedicated to investigating non-invasive herbal interventions for uterine contractility, managing uterine fibroid size reduction, mitigating PCOS symptoms via endocrine pathway balancing, and optimizing follicular development.',
    toxicology: 'Comprehensive reproductive and developmental toxicology assessments to guarantee absolute safety during gestation and lactation cycles.',
    bioavailability: 'Standardization of phytosterols and saponins to achieve stable plasma concentrations and long-acting biological response profiles.',
    methodology: 'Clinical evaluation using double-blind placebo-controlled studies, endocrinology profiling, and sonographic monitoring of uterine tissue structure over 3-6 month intervals.'
  },
  'Heart Health': {
    title: 'Heart Health',
    subtitle: 'Cardioprotective flavonoids, blood pressure regulation, and vascular support.',
    impact: 'Investigates compounds that support endothelial nitric oxide synthesis, reducing oxidative stress in vascular tissues and promoting arterial elasticity to maintain healthy blood pressure levels.',
    toxicology: 'Acute and chronic cardiac safety evaluations, specifically monitoring ECG and cardiac biomarker indicators in preclinical models to verify zero cardiotoxicity.',
    bioavailability: 'Optimization of flavonoid and glycoside absorption through natural synergists that prevent premature hepatic metabolism.',
    methodology: 'In-vitro endothelial cell assays, in-vivo blood pressure telemetry, and human clinical trials evaluating lipid profile balance and pulse wave velocity.'
  },
  'Digestive & Gut Health': {
    title: 'Digestive & Gut Health',
    subtitle: 'Prebiotic modulation, intestinal barrier support, and mucosal protection.',
    impact: 'Studies the role of herbal mucilages and bitter glycosides in strengthening the mucosal barrier, balancing gut microbiota composition, and alleviating symptoms of gut wall inflammation.',
    toxicology: 'Extensive gut lining safety and histology reviews in long-term safety studies to confirm zero irritancy or disruption of intestinal tight junctions.',
    bioavailability: 'Targeted delivery mechanisms ensuring active compounds remain stable in the gastric environment to be released in specific areas of the colon.',
    methodology: 'Microbiome sequencing, in-vitro gut wall simulation models, and clinical research monitoring gastrointestinal symptoms and inflammatory markers.'
  },
  'Eyes & Brain Health': {
    title: 'Eyes & Brain Health',
    subtitle: 'Neuroprotection, blood-brain barrier permeability, and retinal support.',
    impact: 'Focuses on neuroprotective alkaloids that cross the blood-brain barrier to reduce neuroinflammation, support cognitive function, and retinal pigments that prevent macular degeneration.',
    toxicology: 'Targeted neurotoxicity screenings and ocular cell viability tests verifying zero accumulation in brain and ocular tissues.',
    bioavailability: 'Studies on structural modifications to cross the blood-brain barrier effectively and enhance neuro-absorption.',
    methodology: 'In-vitro neuron and microglial assays, retinal cell culture evaluations, and clinical cognitive performance trials in healthy volunteers.'
  },
  'Bones & Joint Health': {
    title: 'Bones & Joint Health',
    subtitle: 'Chondroprotective glycosides and bone tissue osteoclast-osteoblast balance.',
    impact: 'Investigates anti-inflammatory botanical extracts that inhibit matrix metalloproteinases, preventing cartilage degradation and supporting bone mineral density and joint flexibility.',
    toxicology: 'Comprehensive bone marrow and bone tissue safety screens confirming zero adverse effects on mineral metabolism or endocrine pathways.',
    bioavailability: 'Standardization of bio-active minerals and glycosides to optimize assimilation into joint tissue and articular cartilage.',
    methodology: 'Chondrocyte cell studies, in-vivo models of osteoarthritis progression, and clinical trials monitoring joint movement pain and bone density markers.'
  }
}

const clinicalStudies = [
  {
    title: 'Toxicology Screening for Polyherbal Safety',
    outcome: 'Supports the zero toxicology commitment through structured safety review.',
    summary: 'A research summary format for documenting methods, safety observations, and product-specific findings.',
  },
  {
    title: 'Bioactive Constituents and Therapeutic Potential',
    outcome: 'Maps major constituents to traditional use and modern therapeutic relevance.',
    summary: 'Designed to hold summaries from TLC-MS, phytochemical screening, assays, and partner-lab reports.',
  },
  {
    title: 'Formulation Potency and Quality Assurance',
    outcome: 'Documents standardization, consistency, and product development evidence.',
    summary: 'A publication slot for clinical notes, product validation, and controlled study summaries.',
  },
]

function getImageUrl(image) {
  if (!image) return ''
  if (typeof image === 'string') return image
  if (typeof image === 'object') return image.url || image.src || image.secureUrl || image.path || ''
  return ''
}

function getProductImage(product) {
  const firstImage = Array.isArray(product.images) ? product.images[0] : product.image || product.thumbnail
  return getImageSource(firstImage, { width: 520 })
}

function normalizeStage(value) {
  const raw = String(value || '').toLowerCase()
  if (raw.includes('concl') || raw.includes('done') || raw.includes('finish') || raw.includes('complete')) return 'concluded'
  if (raw.includes('future') || raw.includes('plan') || raw.includes('upcoming') || raw.includes('next')) return 'future'
  return 'ongoing'
}

function inferStage(product, index, total) {
  const explicit = normalizeStage(product.phase || product.researchStage || product.research_status || product.researchPhase || product.status)

  if (explicit !== 'ongoing' || String(product.phase || product.researchStage || product.research_status || product.researchPhase || product.status || '').trim()) {
    return explicit
  }

  if (!total) return 'ongoing'
  const bucket = Math.floor((index / total) * 3)
  return researchPhases[Math.min(bucket, researchPhases.length - 1)].key
}

function GridIcon() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true" className="text-[#70ad1e]">
      <rect x="2" y="4" width="4" height="4" fill="currentColor" />
      <rect x="7" y="4" width="4" height="4" fill="currentColor" />
      <rect x="12" y="4" width="4" height="4" fill="currentColor" />
      <rect x="2" y="9" width="4" height="4" fill="currentColor" />
      <rect x="7" y="9" width="4" height="4" fill="currentColor" />
      <rect x="12" y="9" width="4" height="4" fill="currentColor" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true" className="text-[#9b9b9b]">
      <rect x="2" y="4" width="3" height="2" fill="currentColor" />
      <rect x="6" y="4" width="10" height="2" fill="currentColor" />
      <rect x="2" y="8" width="3" height="2" fill="currentColor" />
      <rect x="6" y="8" width="10" height="2" fill="currentColor" />
      <rect x="2" y="12" width="3" height="2" fill="currentColor" />
      <rect x="6" y="12" width="10" height="2" fill="currentColor" />
    </svg>
  )
}

function ResearchCard({ product, onOpen }) {
  const imageUrl = getProductImage(product)

  return (
    <button type="button" onClick={onOpen} className="block w-full text-left" aria-label={`Open research details for ${product.name}`}>
      <article className="w-full text-left">
        <div className="flex h-[132px] items-center justify-center border border-[#efefef] bg-white px-3 py-2">
          {imageUrl ? (
            <img src={imageUrl} alt={product.name} loading="lazy" className="h-full w-full object-contain" />
          ) : (
            <div className="grid h-full w-full place-items-center text-[11px] text-[#9a958c]">No image</div>
          )}
        </div>
        <div className="px-1 pt-3">
          <h3 className="text-[13px] font-normal leading-5 text-[#5d5a56]">{product.name}</h3>
          <p className="mt-1 text-[11px] font-semibold leading-4 text-[#63ac18]">View Research</p>
        </div>
      </article>
    </button>
  )
}

function ResearchAreaModal({ areaName, onClose }) {
  const details = researchAreaDetails[areaName]
  if (!details) return null

  return (
    <div 
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-all"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-[620px] rounded-lg border border-[#ece8df] bg-white p-6 shadow-2xl relative transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-2xl font-normal text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          &times;
        </button>
        <p className="text-[10px] uppercase tracking-[0.16em] text-[#73aa23] font-semibold">Greenrut Research Area</p>
        <h3 className="mt-1 font-serif text-[22px] text-[#2e2a26] leading-tight font-bold">{details.title}</h3>
        <p className="mt-2 text-[12px] italic text-[#63ac18]">{details.subtitle}</p>
        
        <div className="mt-6 space-y-4 max-h-[360px] overflow-y-auto pr-2 text-[12px] leading-6 text-[#5a544c]">
          <div className="border-l-2 border-[#73aa23] pl-3 py-0.5">
            <strong className="block text-[#2e2a26] font-semibold text-[13px]">Therapeutic Impact & Applications</strong>
            <p className="mt-1 text-justify">{details.impact}</p>
          </div>
          <div className="border-l-2 border-[#73aa23] pl-3 py-0.5">
            <strong className="block text-[#2e2a26] font-semibold text-[13px]">Toxicology Studies & Safety</strong>
            <p className="mt-1 text-justify">{details.toxicology}</p>
          </div>
          <div className="border-l-2 border-[#73aa23] pl-3 py-0.5">
            <strong className="block text-[#2e2a26] font-semibold text-[13px]">Bioavailability & Synergy</strong>
            <p className="mt-1 text-justify">{details.bioavailability}</p>
          </div>
          <div className="border-l-2 border-[#73aa23] pl-3 py-0.5">
            <strong className="block text-[#2e2a26] font-semibold text-[13px]">Methodologies Employed</strong>
            <p className="mt-1 text-justify">{details.methodology}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button 
            type="button"
            onClick={onClose} 
            className="px-4 py-2 bg-[#63ac18] text-white text-[12px] font-semibold hover:bg-[#528d13] transition-colors rounded shadow-sm"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  )
}

export function ResearchPage({ onNavigate }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedPhase, setSelectedPhase] = useState('ongoing')
  const [sortBy, setSortBy] = useState('default')
  const [activeResearchArea, setActiveResearchArea] = useState(null)
  const selectedId = new URLSearchParams(window.location.search).get('id')

  useEffect(() => {
    let cancelled = false

    async function loadProducts() {
      try {
        setLoading(true)
        const response = await publicRequest('/research-items')
        if (!cancelled) setProducts(response.data || [])
      } catch (requestError) {
        if (!cancelled) setError(requestError.message || 'Failed to load research items')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadProducts()
    return () => {
      cancelled = true
    }
  }, [])

  const researchItems = useMemo(() => {
    const source = products.length ? products : fallbackProducts
    const normalized = source.map((product, index) => ({ product, stage: inferStage(product, index, source.length) }))
    const filtered = normalized.filter((item) => item.stage === selectedPhase)
    const sorted = [...filtered]

    if (sortBy === 'name-asc') sorted.sort((a, b) => String(a.product.title || a.product.name || '').localeCompare(String(b.product.title || b.product.name || '')))
    if (sortBy === 'name-desc') sorted.sort((a, b) => String(b.product.title || b.product.name || '').localeCompare(String(a.product.title || a.product.name || '')))

    return sorted.slice(0, 3)
  }, [products, selectedPhase, sortBy])

  const selectedItem = useMemo(() => {
    if (!selectedId) return null
    return products.find((product) => String(product.id) === String(selectedId)) || null
  }, [products, selectedId])

  const totalResults = Math.max(products.length || fallbackProducts.length, 30)

  const handleDownloadPDF = (study) => {
    const docContent = `GREENRUT RESEARCH PUBLICATION\n============================\n\nTitle: ${study.title}\n\nKey Outcome:\n----------------------------\n${study.outcome}\n\nSummary / Abstract:\n----------------------------\n${study.summary}\n\n============================\nCertified Research Record of Greenrut Technical Advisory Council.\nApproved by Prof Akinniyi Osuntoki and Prof Moshood Akinleye.\nVerify at: https://www.greenrut.com/research`
    const blob = new Blob([docContent], { type: 'text/plain;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${study.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_summary.txt`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return (
    <section className="page-shell py-6 xs:py-8 lg:py-10">
      <div className="mb-5 overflow-hidden border border-[#efefef] bg-white">
        <div
          className="flex min-h-[180px] items-center justify-center px-4 text-center"
          style={{
            backgroundImage: `linear-gradient(rgba(10, 20, 10, 0.52), rgba(10, 20, 10, 0.52)), url('${heroImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="max-w-[520px] text-white">
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/70">Research</p>
            <h1 className="mt-2 font-serif text-[30px] leading-none xs:text-[34px]">Science-Backed Herbal Innovation</h1>
            <p className="mt-3 text-[12px] leading-6 text-white/80 xs:text-[13px]">Unveiling the rigorous research, quality assurance, and zero toxicology commitment behind every Greenrut product.</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mb-5 w-full max-w-[820px] border border-[#efefef] bg-white p-5">
        <p className="text-[10px] uppercase tracking-[0.16em] text-[#73aa23]">Advancing Herbal Science</p>
        <h2 className="mt-2 font-serif text-[22px] text-[#2e2a26]">Key Research Areas</h2>
        <p className="text-[11px] text-[#8e8a84] mt-1">Click on any research area to explore detailed therapeutic impacts, toxicology, bioavailability, and methodologies.</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {researchAreas.map((area) => (
            <button
              key={area} 
              type="button"
              onClick={() => setActiveResearchArea(area)}
              className="border border-[#f0f0f0] bg-[#fafaf8] px-3 py-3 text-[12px] font-semibold text-[#4a453f] text-left hover:bg-[#f3f8ec] hover:border-[#73aa23] transition-all cursor-pointer block w-full"
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto mb-5 w-full max-w-[820px] border border-[#efefef] bg-white p-5">
        <p className="text-[10px] uppercase tracking-[0.16em] text-[#73aa23]">Evidence-Based Efficacy</p>
        <h2 className="mt-2 font-serif text-[22px] text-[#2e2a26]">Clinical Studies & Publications</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[620px] border-collapse text-left text-[12px] text-[#5a544c]">
            <thead>
              <tr className="border-b border-[#efefef] bg-[#fafaf8]">
                <th className="px-3 py-3">Title</th>
                <th className="px-3 py-3">Summary</th>
                <th className="px-3 py-3">Key Outcome</th>
                <th className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clinicalStudies.map((study) => (
                <tr key={study.title} className="border-b border-[#f2f2f2] last:border-b-0">
                  <td className="px-3 py-3 font-semibold text-[#2e2a26]">{study.title}</td>
                  <td className="px-3 py-3 leading-5">{study.summary}</td>
                  <td className="px-3 py-3 leading-5">{study.outcome}</td>
                  <td className="px-3 py-3 text-right whitespace-nowrap">
                    <button 
                      type="button" 
                      onClick={() => handleDownloadPDF(study)}
                      className="px-2.5 py-1.5 border border-[#63ac18] text-[#63ac18] font-bold text-[10px] hover:bg-[#63ac18] hover:text-white transition-all rounded"
                    >
                      Download Summary
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedItem ? (
        <div className="mx-auto mb-5 w-full max-w-[820px] border border-[#efefef] bg-white p-5">
          <p className="text-[10px] uppercase tracking-[0.16em] text-[#73aa23]">{selectedItem.phase || 'Research'}</p>
          <h2 className="mt-2 font-serif text-[22px] text-[#2e2a26]">{selectedItem.title || selectedItem.name}</h2>
          <p className="mt-3 text-[13px] leading-6 text-[#4a453f]">
            {selectedItem.content || selectedItem.excerpt || 'No further details have been published for this research item yet.'}
          </p>
          <button type="button" className="mt-4 text-[11px] font-semibold text-[#1f1c19] underline" onClick={() => onNavigate?.('/research')}>
            BACK TO RESEARCH
          </button>
        </div>
      ) : null}

      <div className="mx-auto w-full max-w-[820px]">
        <div className="grid gap-[16px] sm:grid-cols-[160px_minmax(0,1fr)] sm:items-start">
          <aside className="w-full border border-[#efefef] bg-white">
            {researchPhases.map((phase, index) => (
              <button
                key={phase.key}
                type="button"
                onClick={() => setSelectedPhase(phase.key)}
                className={`block w-full border-b border-[#f2f2f2] px-4 py-3 text-left text-[13px] leading-5 transition-colors last:border-b-0 ${
                  selectedPhase === phase.key || (index === 0 && selectedPhase === 'ongoing')
                    ? 'border-l-[3px] border-l-[#63ac18] bg-[#f3f8ec] font-semibold text-[#2e2a26] pl-[13px]'
                    : 'text-[#5a544c] hover:bg-[#faf9f6]'
                }`}
              >
                {phase.label}
              </button>
            ))}
          </aside>

          <div className="min-w-0">
            <div className="flex flex-wrap gap-2 items-center border border-[#efefef] bg-white px-3 py-2.5">
              <div className="flex items-center gap-2">
                <button type="button" className="grid h-6 w-6 place-items-center rounded hover:bg-[#f3f8ec]" aria-label="Grid view"><GridIcon /></button>
                <button type="button" className="grid h-6 w-6 place-items-center rounded hover:bg-[#f3f8ec]" aria-label="List view"><ListIcon /></button>
              </div>

              <p className="ml-3 hidden text-[11px] leading-none text-[#59534b] sm:block">Showing 1 - 20 of {totalResults} results</p>

              <div className="ml-auto flex items-center gap-3 text-[11px] text-[#5a544c]">
                <label className="flex items-center gap-1.5">
                  <span>View:</span>
                  <select value="grid" readOnly className="h-[26px] w-[56px] border border-[#ece8df] bg-white px-1.5 text-[11px] text-[#5a544c]"><option value="grid">20</option></select>
                </label>
                <label className="flex items-center gap-1.5">
                  <span>Sort by:</span>
                  <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="h-[26px] w-[124px] border border-[#ece8df] bg-white px-1.5 text-[11px] text-[#5a544c]">
                    <option value="default">Default</option>
                    <option value="name-asc">Name A-Z</option>
                    <option value="name-desc">Name Z-A</option>
                  </select>
                </label>
              </div>
            </div>

            {loading ? <p className="py-4 text-sm text-[#6f6b64]">Loading research items...</p> : null}
            {error ? <p className="py-4 text-sm text-red-600">{error}</p> : null}

            {!loading && !error ? (
              <div className="pt-3">
                <div className="grid grid-cols-1 gap-[14px] sm:grid-cols-3">
                  {researchItems.map(({ product, stage }) => (
                    <ResearchCard
                      key={product.id || product.slug || product.name}
                      product={product}
                      onOpen={() =>
                        onNavigate?.(
                          product.linkedProductId
                            ? `/product-details?id=${product.linkedProductId}`
                            : `/research?id=${product.id || product.slug || ''}`
                        )
                      }
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {activeResearchArea ? (
        <ResearchAreaModal 
          areaName={activeResearchArea} 
          onClose={() => setActiveResearchArea(null)} 
        />
      ) : null}
    </section>
  )
}
