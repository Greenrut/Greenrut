import { useEffect, useMemo, useState } from 'react'
import { HeroBanner } from '../components/SiteChrome.jsx'
import { publicRequest } from '../lib/publicApi.js'
import bannaImage from '../assets/banna.png'

const researchPhases = [
  { key: 'ongoing', label: 'Ongoing Research' },
  { key: 'concluded', label: 'Concluded Research' },
  { key: 'future', label: 'Future Research' },
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
  const explicit = normalizeStage(
    product.researchStage || product.research_status || product.researchPhase || product.phase || product.status,
  )

  if (
    explicit !== 'ongoing' ||
    String(
      product.researchStage ||
        product.research_status ||
        product.researchPhase ||
        product.phase ||
        product.status ||
        '',
    ).trim()
  ) {
    return explicit
  }

  if (!total) return 'ongoing'
  const bucket = Math.floor((index / total) * 3)
  return researchPhases[Math.min(bucket, researchPhases.length - 1)].key
}

function GridIcon({ active }) {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true" className={active ? 'text-[#70ad1e]' : 'text-[#9b9b9b]'}>
      <rect x="2" y="4" width="4" height="4" fill="currentColor" />
      <rect x="7" y="4" width="4" height="4" fill="currentColor" />
      <rect x="12" y="4" width="4" height="4" fill="currentColor" />
      <rect x="2" y="9" width="4" height="4" fill="currentColor" />
      <rect x="7" y="9" width="4" height="4" fill="currentColor" />
      <rect x="12" y="9" width="4" height="4" fill="currentColor" />
    </svg>
  )
}

function ListIcon({ active }) {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true" className={active ? 'text-[#70ad1e]' : 'text-[#9b9b9b]'}>
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
        <div className="flex h-[130px] items-center justify-center border border-[#efefef] bg-white px-3 py-2">
          {imageUrl ? (
            <img src={imageUrl} alt={product.name} loading="lazy" className="h-full w-full object-contain" />
          ) : (
            <div className="grid h-full w-full place-items-center text-[11px] text-[#9a958c]">No image</div>
          )}
        </div>
        <div className="px-1 pt-3">
          <h3 className="text-[12px] font-normal leading-4 text-[#5d5a56]">{product.name}</h3>
          <p className="mt-1 text-[10px] font-semibold leading-4 text-[#1f1c19]">View Research</p>
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
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('default')

  useEffect(() => {
    let cancelled = false

    async function loadProducts() {
      try {
        setLoading(true)
        const response = await publicRequest('/products')
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
    const normalized = products.map((product, index) => ({
      product,
      stage: inferStage(product, index, products.length),
    }))

    const filtered = normalized.filter((item) => item.stage === selectedPhase)
    const sorted = [...filtered]

    if (sortBy === 'name-asc') sorted.sort((a, b) => String(a.product.name || '').localeCompare(String(b.product.name || '')))
    if (sortBy === 'name-desc') sorted.sort((a, b) => String(b.product.name || '').localeCompare(String(a.product.name || '')))

    return sorted.slice(0, 3)
  }, [products, selectedPhase, sortBy])

  const totalResults = Math.max(products.length, 30)

  return (
    <>
      <HeroBanner title="OUR RESEARCH" breadcrumb="Home  /  Research" backgroundPhoto={bannaImage} />

      <section className="page-shell pb-14 pt-10 xs:pt-12 lg:pt-14">
        <div className="mx-auto w-full max-w-[542px]">
          <div className="grid gap-[16px] sm:grid-cols-[130px_minmax(0,1fr)] sm:items-start">
            <aside className="w-[130px] border border-[#f0f0f0] bg-white">
              {researchPhases.map((phase, index) => (
                <button
                  key={phase.key}
                  type="button"
                  onClick={() => setSelectedPhase(phase.key)}
                  className={`block h-[23px] w-full border-b border-[#f1f1f1] px-3 text-left text-[10px] leading-[23px] text-[#3f3d39] last:border-b-0 ${
                    selectedPhase === phase.key || (index === 0 && selectedPhase === 'ongoing') ? 'bg-[#d4d4d4]' : 'bg-white'
                  }`}
                >
                  {phase.label}
                </button>
              ))}
            </aside>

            <div className="min-w-0">
              <div className="flex h-[30px] items-center border border-[#f0f0f0] bg-white px-2">
                <div className="flex items-center gap-1.5">
                  <button type="button" onClick={() => setViewMode('grid')} className="grid h-4 w-4 place-items-center" aria-label="Grid view">
                    <GridIcon active={viewMode === 'grid'} />
                  </button>
                  <button type="button" onClick={() => setViewMode('list')} className="grid h-4 w-4 place-items-center" aria-label="List view">
                    <ListIcon active={viewMode === 'list'} />
                  </button>
                </div>

                <p className="ml-5 hidden text-[9px] leading-none text-[#59534b] sm:block">
                  Showing 1 - 20 of {totalResults} results
                </p>

                <div className="ml-auto flex items-center gap-2 text-[9px] text-[#5a544c]">
                  <label className="flex items-center gap-1.5">
                    <span>View:</span>
                    <select
                      value={viewMode}
                      onChange={(event) => setViewMode(event.target.value)}
                      className="h-[19px] w-[49px] border border-[#ece8df] bg-white px-1 text-[9px] text-[#5a544c]"
                    >
                      <option value="grid">20</option>
                      <option value="list">List</option>
                    </select>
                  </label>
                  <label className="flex items-center gap-1.5">
                    <span>Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(event) => setSortBy(event.target.value)}
                      className="h-[19px] w-[110px] border border-[#ece8df] bg-white px-1 text-[9px] text-[#5a544c]"
                    >
                      <option value="default">Default</option>
                      <option value="name-asc">Name A-Z</option>
                      <option value="name-desc">Name Z-A</option>
                    </select>
                  </label>
                </div>
              </div>

              {loading ? <p className="py-4 text-sm text-[#6f6b64]">Loading research products...</p> : null}
              {error ? <p className="py-4 text-sm text-red-600">{error}</p> : null}

              {!loading && !error ? (
                <div className="pt-4">
                  <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 gap-[14px] sm:grid-cols-3' : 'grid grid-cols-1 gap-4'}`}>
                    {researchItems.map((product) => (
                      <ResearchCard key={product.id || product.name} product={product} onOpen={() => onNavigate?.(`/product-details?id=${product.id}`)} />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
