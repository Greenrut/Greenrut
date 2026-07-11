import { useEffect, useMemo, useState } from 'react'
import { publicRequest } from '../lib/publicApi.js'
import heroImage from '../assets/hero.png'
import bannerImage from '../assets/banna.png'

const fallbackResources = [
  {
    id: 'fallback-1',
    title: 'Greenrut Product Guide',
    section: 'Product Guides',
    type: 'Guide',
    excerpt: 'Overview notes for the current product line, intended for quick reference across the storefront.',
    image: heroImage,
  },
  {
    id: 'fallback-2',
    title: 'Research Summary Pack',
    section: 'Herbal Research Papers',
    type: 'Paper',
    excerpt: 'Short-form summaries of ongoing and concluded research topics tied to the catalog.',
    image: bannerImage,
  },
  {
    id: 'fallback-3',
    title: 'Usage and Storage Notes',
    section: 'Clinical Notes',
    type: 'Notes',
    excerpt: 'Practical guidance for handling, storing, and presenting the Greenrut range.',
    image: heroImage,
  },
  {
    id: 'fallback-4',
    title: 'Brand Assets Index',
    section: 'Brand Library',
    type: 'Assets',
    excerpt: 'Logos, references, and lightweight brand assets gathered in one place.',
    image: bannerImage,
  },
]

function getImageUrl(image) {
  if (!image) return ''
  if (typeof image === 'string') return image
  if (typeof image === 'object') return image.url || image.src || image.secureUrl || image.path || ''
  return ''
}

function normalizeResource(item) {
  const title = item.title || item.name || 'Untitled Resource'
  return {
    id: item.id || item._id || title,
    title,
    section: item.section || item.category || 'General',
    type: item.type || item.resourceType || '',
    excerpt: item.excerpt || item.description || '',
    image: getImageUrl(item.image || item.thumbnail || (Array.isArray(item.images) ? item.images[0] : '')),
    linkedProductId: item.linkedProductId || item.productId || '',
  }
}

function LibraryCard({ item, onOpen }) {
  return (
    <button type="button" className="block w-full text-left" onClick={onOpen} aria-label={`Open ${item.title}`}>
      <article className="overflow-hidden border border-[#ece8df] bg-white">
        <div className="h-[150px] bg-[#f5f5f1]">
          {item.image ? <img src={item.image} alt={item.title} className="h-full w-full object-cover" /> : <div className="grid h-full w-full place-items-center text-[11px] text-[#9a958c]">No image</div>}
        </div>
        <div className="p-4">
          <p className="text-[10px] uppercase tracking-[0.16em] text-[#73aa23]">{item.type || item.section}</p>
          <h3 className="mt-2 text-[15px] font-medium text-[#2e2a26]">{item.title}</h3>
          <p className="mt-2 text-[13px] leading-6 text-[#645f59]">{item.excerpt}</p>
          <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-[#1f1c19]">
            Open resource <span aria-hidden="true">&rarr;</span>
          </span>
        </div>
      </article>
    </button>
  )
}

export function LibraryPage({ onNavigate }) {
  const [resources, setResources] = useState([])
  const [activeSection, setActiveSection] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const selectedId = new URLSearchParams(window.location.search).get('id')

  useEffect(() => {
    let cancelled = false

    async function loadResources() {
      try {
        setLoading(true)
        const response = await publicRequest('/library-items')
        if (!cancelled) setResources((response.data || []).map(normalizeResource))
      } catch (requestError) {
        if (!cancelled) setError(requestError.message || 'Failed to load library content')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadResources()
    return () => {
      cancelled = true
    }
  }, [])

  const libraryItems = resources.length ? resources : fallbackResources

  const sections = useMemo(() => {
    const names = Array.from(new Set(libraryItems.map((item) => item.section).filter(Boolean)))
    return names.length ? names : ['General']
  }, [libraryItems])

  useEffect(() => {
    if (!sections.length) return
    if (!activeSection || !sections.includes(activeSection)) {
      setActiveSection(sections[0])
    }
  }, [activeSection, sections])

  const filteredResources = useMemo(() => libraryItems.filter((item) => item.section === activeSection), [libraryItems, activeSection])

  const selectedItem = useMemo(() => {
    if (!selectedId) return null
    return libraryItems.find((item) => String(item.id) === String(selectedId)) || null
  }, [libraryItems, selectedId])

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
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/70">Library</p>
            <h1 className="mt-2 font-serif text-[30px] leading-none xs:text-[34px]">Greenrut Library</h1>
            <p className="mt-3 text-[12px] leading-6 text-white/80 xs:text-[13px]">Browse product references, research notes, and brand assets from one place.</p>
          </div>
        </div>
      </div>

      {selectedItem ? (
        <div className="mx-auto mb-5 w-full max-w-[980px] border border-[#efefef] bg-white p-5">
          <p className="text-[10px] uppercase tracking-[0.16em] text-[#73aa23]">{selectedItem.type || selectedItem.section}</p>
          <h2 className="mt-2 font-serif text-[22px] text-[#2e2a26]">{selectedItem.title}</h2>
          <p className="mt-3 text-[13px] leading-6 text-[#4a453f]">{selectedItem.excerpt || 'No further details have been published for this resource yet.'}</p>
          <button type="button" className="mt-4 text-[11px] font-semibold text-[#1f1c19] underline" onClick={() => onNavigate?.('/library')}>
            BACK TO LIBRARY
          </button>
        </div>
      ) : null}

      <div className="mx-auto grid w-full max-w-[980px] gap-5 lg:grid-cols-[200px_minmax(0,1fr)]">
        <aside className="h-fit border border-[#efefef] bg-white">
          {sections.map((section) => (
            <button
              key={section}
              type="button"
              onClick={() => setActiveSection(section)}
              className={`block w-full border-b border-[#f2f2f2] px-4 py-3 text-left text-[13px] leading-5 transition-colors last:border-b-0 ${
                activeSection === section
                  ? 'border-l-[3px] border-l-[#63ac18] bg-[#f3f8ec] font-semibold text-[#2e2a26] pl-[13px]'
                  : 'text-[#5a544c] hover:bg-[#faf9f6]'
              }`}
            >
              {section}
            </button>
          ))}
        </aside>

        <div>
          <div className="mb-3 flex items-center justify-between border border-[#efefef] bg-white px-4 py-3 text-[13px] text-[#5a544c]">
            <span className="font-semibold text-[#2e2a26]">{activeSection || sections[0]}</span>
            <span>{filteredResources.length} resources</span>
          </div>

          {loading ? <p className="py-4 text-sm text-[#6f6b64]">Loading library items...</p> : null}
          {error ? <p className="py-4 text-sm text-red-600">{error}</p> : null}

          {!loading && !error ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredResources.map((item) => (
                <LibraryCard
                  key={item.id || item.slug || item.title}
                  item={item}
                  onOpen={() => onNavigate?.(item.linkedProductId ? `/product-details?id=${item.linkedProductId}` : `/library?id=${item.id}`)}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
