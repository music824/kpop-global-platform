import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// Mock data - will be replaced with real Supabase data
const featuredEvent = {
  id: '1',
  title: 'STRAY KIDS 世界巡回演唱会 2026',
  subtitle: '5-STAR Tour World Final',
  artist: 'Stray Kids',
  country: '韩国',
  city: '首尔',
  venue: '高尺天空巨蛋',
  date: '2026-06-15',
  time: '19:00',
  status: 'ticketing',
  posterImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop',
}

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={featuredEvent.posterImage}
          alt={featuredEvent.title}
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 py-24">
        <div className="max-w-2xl space-y-6">
          {/* Badge */}
          <div className="flex items-center gap-3">
            <Badge variant="kpop" className="text-sm">
              🔥 今日开票
            </Badge>
            <Badge variant="outline" className="border-[#8B5CF6] text-purple-400">
              {featuredEvent.country} · {featuredEvent.city}
            </Badge>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            <span className="text-white">{featuredEvent.title}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-muted-foreground">{featuredEvent.subtitle}</p>

          {/* Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {featuredEvent.venue}
            </span>
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {featuredEvent.date} {featuredEvent.time}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="kpop" size="lg">
              查看详情
            </Button>
            <Button variant="outline" size="lg" className="border-purple-500 text-purple-400 hover:bg-purple-500/10">
              提醒我
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}