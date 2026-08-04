import { useEffect, useMemo, useState } from 'react'
import { publicRequest } from '../lib/publicApi.js'
import heroImage from '../assets/hero.png'
import { fallbackResources } from '../data.js'

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
    localName: item.localName || item.local_name || '',
    therapeuticUse: item.therapeuticUse || item.therapeutic_use || item.use || '',
    preparationMethod: item.preparationMethod || item.preparation_method || item.preparation || '',
    dosage: item.dosage || item.dose || '',
    constituents: item.constituents || item.majorConstituents || item.api || '',
    resourceUrl: item.resourceUrl || item.resource_url || item.url || item.link || '',
    image: getImageUrl(item.image || item.thumbnail || (Array.isArray(item.images) ? item.images[0] : '')),
    linkedProductId: item.linkedProductId || item.productId || '',
  }
}

export function LibraryResourcePage({ onNavigate }) {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const resourceId = new URLSearchParams(window.location.search).get('id')

  useEffect(() => {
    let cancelled = false

    async function loadResource() {
      try {
        setLoading(true)
        const response = await publicRequest('/library-items')
        if (!cancelled) setResources((response.data || []).map(normalizeResource))
      } catch (requestError) {
        if (!cancelled) setError(requestError.message || 'Failed to load resource')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadResource()
    return () => {
      cancelled = true
    }
  }, [])

  const libraryItems = resources.length ? resources : fallbackResources.map(normalizeResource)
  const resource = useMemo(() => {
    if (!resourceId) return null
    return libraryItems.find((item) => String(item.id) === String(resourceId)) || null
  }, [libraryItems, resourceId])

  const relatedHerbs = useMemo(() => {
    if (!resource) return []
    return libraryItems
      .filter((item) => String(item.id) !== String(resource.id) && item.section === resource.section)
      .slice(0, 3)
  }, [libraryItems, resource])

  if (loading) {
    return (
      <section className="page-shell py-12">
        <p className="text-sm text-[#6f6b64]">Loading resource...</p>
      </section>
    )
  }

  if (error && !resource) {
    return (
      <section className="page-shell py-12">
        <p className="text-sm text-red-600">{error}</p>
        <button type="button" className="mt-4 border border-[#d8d6d0] px-4 py-3 text-[11px] font-semibold uppercase" onClick={() => onNavigate?.('/library')}>
          Back to library
        </button>
      </section>
    )
  }

  if (!resource) {
    return (
      <section className="page-shell py-12">
        <h1 className="font-serif text-[28px] text-[#2e2a26]">Resource not found</h1>
        <p className="mt-3 text-sm text-[#6f6b64]">The herb or library resource you opened is not available.</p>
        <button type="button" className="mt-4 border border-[#d8d6d0] px-4 py-3 text-[11px] font-semibold uppercase" onClick={() => onNavigate?.('/library')}>
          Back to library
        </button>
      </section>
    )
  }

  return (
    <section className="page-shell py-6 xs:py-8 lg:py-10">
      <div
        className="mb-6 flex min-h-[170px] items-center justify-center px-4 text-center"
        style={{
          backgroundImage: `linear-gradient(rgba(10, 20, 10, 0.58), rgba(10, 20, 10, 0.58)), url('${heroImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-[620px] text-white">
          <p className="text-[10px] uppercase tracking-[0.24em] text-white/70">{resource.type || resource.section}</p>
          <h1 className="mt-2 font-serif text-[30px] leading-tight xs:text-[36px]">{resource.title}</h1>
          {resource.localName ? <p className="mt-2 text-[13px] text-white/80">Local name: {resource.localName}</p> : null}
        </div>
      </div>

      <button type="button" className="mb-5 text-[11px] font-semibold uppercase text-[#2e2a26] underline" onClick={() => onNavigate?.('/library')}>
        Back to library
      </button>

      <article className="grid gap-6 border border-[#efefef] bg-white p-5 sm:grid-cols-[280px_minmax(0,1fr)] lg:p-7">
        <div className="bg-[#f5f5f1]">
          {resource.image ? (
            <img src={resource.image} alt={resource.title} className="h-full min-h-[240px] w-full object-cover" />
          ) : (
            <div className="grid min-h-[240px] place-items-center text-[12px] text-[#9a958c]">No image</div>
          )}
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-[#73aa23]">{resource.section}</p>
          <h2 className="mt-2 font-serif text-[26px] text-[#2e2a26]">{resource.title}</h2>
          <p className="mt-4 text-[14px] leading-7 text-[#4a453f]">{resource.excerpt || 'No summary has been published for this resource yet.'}</p>

          <dl className="mt-6 grid gap-4 text-[13px] leading-6 text-[#5f5a54]">
            {resource.therapeuticUse ? <div><dt className="font-semibold text-[#2e2a26]">Therapeutic use</dt><dd>{resource.therapeuticUse}</dd></div> : null}
            {resource.preparationMethod ? <div><dt className="font-semibold text-[#2e2a26]">Preparation method</dt><dd>{resource.preparationMethod}</dd></div> : null}
            {resource.dosage ? <div><dt className="font-semibold text-[#2e2a26]">Dosage</dt><dd>{resource.dosage}</dd></div> : null}
            {resource.constituents ? <div><dt className="font-semibold text-[#2e2a26]">Active constituents</dt><dd>{resource.constituents}</dd></div> : null}
          </dl>

          <div className="mt-6 flex flex-wrap gap-3">
            {resource.resourceUrl ? (
              <button type="button" className="bg-[#63ac18] px-4 py-3 text-[11px] font-semibold uppercase text-white" onClick={() => window.open(resource.resourceUrl, '_blank', 'noopener,noreferrer')}>
                Open external resource
              </button>
            ) : null}
            {resource.linkedProductId ? (
              <button type="button" className="border border-[#d8d6d0] px-4 py-3 text-[11px] font-semibold uppercase text-[#2e2a26]" onClick={() => onNavigate?.(`/product-details?id=${resource.linkedProductId}`)}>
                View linked product
              </button>
            ) : null}
          </div>
        </div>
      </article>

      {relatedHerbs.length ? (
        <section className="mt-8">
          <h2 className="font-serif text-[24px] text-[#2e2a26]">Related Resources</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {relatedHerbs.map((item) => (
              <button key={item.id} type="button" className="border border-[#ece8df] bg-white p-4 text-left" onClick={() => onNavigate?.(`/library/resource?id=${encodeURIComponent(item.id)}`)}>
                <p className="text-[10px] uppercase tracking-[0.16em] text-[#73aa23]">{item.type || item.section}</p>
                <h3 className="mt-2 text-[15px] font-semibold text-[#2e2a26]">{item.title}</h3>
                <p className="mt-2 line-clamp-3 text-[12px] leading-5 text-[#6b655f]">{item.excerpt}</p>
              </button>
            ))}
          </div>
        </section>
      ) : null}
    </section>
  )
}
