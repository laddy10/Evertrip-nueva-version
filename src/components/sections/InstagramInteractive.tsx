'use client'

import { useState, useEffect, useRef } from 'react'
import { FaInstagram, FaPlay, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const BEHOLD_FEED_URL = 'https://feeds.behold.so/jnOqnG9EkhouJG9irFw7'

interface BeholdPostSize {
  width: number
  height: number
  mediaUrl: string
}

export interface BeholdPost {
  id: string
  permalink: string
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  mediaUrl: string
  thumbnailUrl?: string
  caption?: string
  sizes?: {
    small?: BeholdPostSize
    medium?: BeholdPostSize
    large?: BeholdPostSize
  }
}

function getImageUrl(post: BeholdPost): string {
  if (post.sizes?.medium?.mediaUrl) return post.sizes.medium.mediaUrl
  if (post.sizes?.small?.mediaUrl) return post.sizes.small.mediaUrl
  if (post.mediaType === 'VIDEO' && post.thumbnailUrl) return post.thumbnailUrl
  return post.mediaUrl
}

export default function InstagramInteractive({ t }: { t: any }) {
  const [posts, setPosts] = useState<BeholdPost[]>([])
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const [shouldLoad, setShouldLoad] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    if (!('IntersectionObserver' in window)) {
      setShouldLoad(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: '300px 0px' }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!shouldLoad) return

    let cancelled = false

    async function fetchInstagram() {
      try {
        const res = await fetch(BEHOLD_FEED_URL)
        if (res.ok) {
          const data = await res.json()
          if (!cancelled) setPosts(data.posts?.slice(0, 5) || [])
        }
      } catch (e) {
        console.error('Error fetching Instagram feed', e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchInstagram()
    return () => {
      cancelled = true
    }
  }, [shouldLoad])

  if (!shouldLoad || loading) {
    return <div ref={containerRef} className="w-full min-h-[600px] animate-pulse bg-[#0A1D31]/[0.02]" aria-hidden="true" />
  }
  if (!posts || posts.length === 0) return null

  const activePost = posts[activeIndex]
  const imgSrc = getImageUrl(activePost)
  const isVideo = activePost.mediaType === 'VIDEO'

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault()
    setActiveIndex((prev) => (prev === 0 ? posts.length - 1 : prev - 1))
  }

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault()
    setActiveIndex((prev) => (prev === posts.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="flex flex-col md:flex-row items-center gap-16 md:gap-24">
      {/* LEFT — Elegant Video Card */}
      <div className="w-full md:w-[320px] flex flex-col items-center shrink-0">
        <div className="relative w-full group/main">
          {/* Subtle glow behind card */}
          <div className="absolute inset-0 blur-[40px] opacity-20 rounded-[32px] scale-95 transition-all duration-500"
            style={{ background: '#109B96' }}
          />

          {/* Video Card */}
          <a 
            href={activePost.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block w-full rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-[#0A1D31] group"
            style={{ aspectRatio: '9/16' }}
          >
            {/* Image */}
            {imgSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={activePost.id}
                src={imgSrc}
                alt={activePost.caption ?? 'Evertrip Instagram'}
                className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
              />
            )}

            {/* Dark gradient for text readability at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Play button overlay */}
            {isVideo && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <FaPlay size={20} className="text-white ml-1 opacity-90" />
                </div>
              </div>
            )}
            
            {/* Hover overlay hint */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
              <span className="text-white text-sm font-semibold flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full">
                <FaInstagram /> Ver en Instagram
              </span>
            </div>
          </a>

          {/* Navigation Arrows (Visible on hover) */}
          {posts.length > 1 && (
            <>
              <button 
                onClick={handlePrev}
                className="absolute top-1/2 -left-4 md:-left-6 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-[#0A1D31] opacity-0 translate-x-2 group-hover/main:opacity-100 group-hover/main:translate-x-0 transition-all duration-300 hover:scale-110 hover:text-[#109B96] z-10"
                aria-label="Anterior"
              >
                <FaChevronLeft size={16} className="-ml-0.5" />
              </button>
              <button 
                onClick={handleNext}
                className="absolute top-1/2 -right-4 md:-right-6 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-[#0A1D31] opacity-0 -translate-x-2 group-hover/main:opacity-100 group-hover/main:translate-x-0 transition-all duration-300 hover:scale-110 hover:text-[#109B96] z-10"
                aria-label="Siguiente"
              >
                <FaChevronRight size={16} className="-mr-0.5" />
              </button>
            </>
          )}
        </div>
        
        {/* Thumbnails underneath */}
        {posts.length > 1 && (
          <div className="w-full mt-8">
            <div className="flex items-center justify-between mb-3 px-2">
              <span className="text-xs font-bold tracking-widest uppercase text-[#0A1D31]/40">Últimos Reels</span>
              <span className="text-xs font-bold text-[#109B96]">{activeIndex + 1} / {posts.length}</span>
            </div>
            <div className="flex items-center gap-3">
              {posts.map((post, idx) => (
                <button
                  key={post.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative flex-1 rounded-xl overflow-hidden transition-all duration-300 ${
                    idx === activeIndex 
                      ? 'ring-2 ring-[#109B96] ring-offset-2 ring-offset-[#FCF8F2] scale-105 shadow-md' 
                      : 'opacity-50 hover:opacity-100 grayscale-[0.5] hover:grayscale-0 hover:scale-100 scale-95'
                  }`}
                  style={{ aspectRatio: '9/16' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={getImageUrl(post)} 
                    alt="Thumbnail" 
                    className="w-full h-full object-cover"
                  />
                  {post.mediaType === 'VIDEO' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                      <FaPlay size={10} className="text-white drop-shadow-md opacity-80" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT — Text content */}
      <div className="flex-1 text-center md:text-left mt-4 md:mt-0">
        {/* Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#0A1D31]/10 bg-white mb-8 shadow-sm">
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#109B96]">{t.tag}</span>
        </div>

        {/* Title */}
        <h2 className="text-4xl md:text-6xl font-bold mb-2 text-[#0A1D31] leading-tight font-heading">
          {t.titleLine1}
        </h2>
        <h2 className="text-4xl md:text-6xl font-bold mb-10 leading-tight italic font-heading"
          style={{ color: '#109B96' }}
        >
          {t.titleLine2}
        </h2>

        {/* Quote */}
        <div className="mb-10 relative">
          <span className="absolute -top-6 -left-4 text-7xl leading-none text-[#109B96]/20 font-serif select-none">&ldquo;</span>
          <p className="text-[#1F3653] text-base md:text-xl italic leading-relaxed relative z-10 font-medium">
            {t.quote.replace(/"/g, '')}
          </p>
          <div className="flex items-center gap-4 mt-6 justify-center md:justify-start">
            <div className="h-[2px] flex-1 max-w-[40px] bg-[#109B96]" />
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#1F3653]">{t.quoteLabel}</span>
          </div>
        </div>

        {/* CTA Button */}
        <a
          href={`https://www.instagram.com/evertripviajesytours`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full border-2 border-[#0A1D31] text-[#0A1D31] text-sm font-bold tracking-widest uppercase hover:bg-[#0A1D31] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <FaInstagram size={18} className="group-hover:text-white transition-colors" />
          {t.cta}
        </a>
      </div>
    </div>
  )
}
