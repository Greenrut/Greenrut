import { useEffect, useMemo, useState } from 'react'
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

function getImageUrl(image) {
  if (!image) return ''
  if (typeof image === 'string') return image
  if (typeof image === 'object') return image.url || image.src || image.secureUrl || image.path || ''
  return ''
}

function getProductImage(product) {
  const firstImage = Array.isArray(product.images) ? product.images[0] : product.image || product.thumbnail
  return getImageUrl(firstImage)
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
      <article className="w-full">
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

export function ResearchPage({ onNavigate }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedPhase, setSelectedPhase] = useState('ongoing')
  const [sortBy, setSortBy] = useState('default')

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

  const totalResults = Math.max(products.length || fallbackProducts.length, 30)

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
            <h1 className="mt-2 font-serif text-[30px] leading-none xs:text-[34px]">Our Research</h1>
            <p className="mt-3 text-[12px] leading-6 text-white/80 xs:text-[13px]">Browse the research catalog and open any product to view its details.</p>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[820px]">
        <div className="grid gap-[16px] sm:grid-cols-[112px_minmax(0,1fr)] sm:items-start">
          <aside className="w-full border border-[#efefef] bg-white">
            {researchPhases.map((phase, index) => (
              <button
                key={phase.key}
                type="button"
                onClick={() => setSelectedPhase(phase.key)}
                className={`block h-[28px] w-full border-b border-[#f2f2f2] px-3 text-left text-[10px] leading-[28px] text-[#3f3d39] last:border-b-0 ${
                  selectedPhase === phase.key || (index === 0 && selectedPhase === 'ongoing') ? 'bg-[#d3d3d3]' : 'bg-white'
                }`}
              >
                {phase.label}
              </button>
            ))}
          </aside>

          <div className="min-w-0">
            <div className="flex h-[28px] items-center border border-[#efefef] bg-white px-2">
              <div className="flex items-center gap-1.5">
                <button type="button" className="grid h-4 w-4 place-items-center" aria-label="Grid view"><GridIcon /></button>
                <button type="button" className="grid h-4 w-4 place-items-center" aria-label="List view"><ListIcon /></button>
              </div>

              <p className="ml-5 hidden text-[9px] leading-none text-[#59534b] sm:block">Showing 1 - 20 of {totalResults} results</p>

              <div className="ml-auto flex items-center gap-2 text-[9px] text-[#5a544c]">
                <label className="flex items-center gap-1">
                  <span>View:</span>
                  <select value="grid" readOnly className="h-[17px] w-[46px] border border-[#ece8df] bg-white px-1 text-[9px] text-[#5a544c]"><option value="grid">20</option></select>
                </label>
                <label className="flex items-center gap-1">
                  <span>Sort by:</span>
                  <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="h-[17px] w-[109px] border border-[#ece8df] bg-white px-1 text-[9px] text-[#5a544c]">
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
                  {researchItems.map((item) => (
                    <ResearchCard
                      key={item.id || item.slug || item.name}
                      product={item}
                      onOpen={() => onNavigate?.(item.linkedProductId ? `/product-details?id=${item.linkedProductId}` : '/research')}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
