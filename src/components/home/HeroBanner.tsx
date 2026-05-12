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
  posterImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1600&h=900&fit=crop', // K-pop concert stage with lights
}

export function HeroBanner() {
  return (
    <section className="relative min-h-[85vh] overflow-hidden">
      {/* Background Image - Concert with dramatic lighting */}
      <div className="absolute inset-0">
        <img
          src={featuredEvent.posterImage}
          alt={featuredEvent.title}
          className="h-full w-full object-cover"
        />
        {/* Overlay gradients for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-purple-950/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />
        
        {/* Neon glow spots */}
        <div className="absolute right-1/4 top-1/3 h-96 w-96 rounded-full bg-purple-600/20 blur-[100px]" />
        <div className="absolute right-1/3 top-1/2 h-64 w-64 rounded-full bg-pink-600/15 blur-[80px]" />
      </div>

      {/* Decorative elements */}
      <div className="absolute right-0 top-0 h-full w-1/2 overflow-hidden">
        {/* Gradient decoration block */}
        <div className="absolute right-0 top-0 h-full w-2/3 bg-gradient-to-l from-purple-600/20 via-pink-600/10 to-transparent" />
        {/* Light beam effects */}
        <div className="absolute right-1/4 top-0 h-full w-px bg-gradient-to-b from-purple-400/50 via-pink-500/30 to-transparent" />
        <div className="absolute right-1/3 top-0 h-full w-px bg-gradient-to-b from-pink-400/40 via-purple-500/20 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto flex min-h-[85vh] max-w-7xl items-center px-6 py-20">
        <div className="max-w-3xl space-y-8">
          {/* Badge row with enhanced styling */}
          <div className="flex items-center gap-4">
            <Badge variant="kpop" className="text-sm font-bold px-4 py-1.5 rounded-full shadow-lg shadow-orange-500/30 animate-pulse">
              🔥 今日开票
            </Badge>
            <Badge variant="outline" className="border-purple-500/60 text-purple-300 bg-purple-500/10 backdrop-blur-sm rounded-full px-4 py-1.5">
              🇰🇷 {featuredEvent.country} · {featuredEvent.city}
            </Badge>
          </div>

          {/* Main Title - Big and impactful with layered text effect */}
          <div className="space-y-2">
            <h1 className="text-5xl font-black leading-none tracking-tight md:text-7xl lg:text-8xl">
              <span className="block text-white drop-shadow-2xl">{featuredEvent.title}</span>
            </h1>
            {/* Subtitle with gradient */}
            <p className="text-2xl font-bold md:text-3xl lg:text-4xl">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-300 bg-clip-text text-transparent">
                {featuredEvent.subtitle}
              </span>
            </p>
          </div>

          {/* Event info with icons - better spacing */}
          <div className="flex flex-wrap items-center gap-6 text-base text-gray-300">
            <span className="flex items-center gap-3 rounded-full bg-white/5 backdrop-blur-sm px-4 py-2 border border-white/10">
              <svg className="h-5 w-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium">{featuredEvent.venue}</span>
            </span>
            <span className="flex items-center gap-3 rounded-full bg-white/5 backdrop-blur-sm px-4 py-2 border border-white/10">
              <svg className="h-5 w-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">{featuredEvent.date} · {featuredEvent.time}</span>
            </span>
          </div>

          {/* Action buttons - bigger and bolder */}
          <div className="flex gap-5 pt-6">
            <Button 
              variant="kpop" 
              size="lg" 
              className="group relative h-14 rounded-xl px-8 text-base font-bold shadow-2xl shadow-purple-500/40 transition-all duration-300 hover:shadow-purple-500/60 hover:scale-105"
            >
              <Link href={`/events/${featuredEvent.id}`} className="relative z-10 flex items-center gap-2">
                查看详情
                <svg className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="group h-14 rounded-xl border-2 border-pink-500/50 px-8 text-base font-bold text-pink-400 transition-all duration-300 hover:border-pink-400 hover:bg-pink-500/20 hover:shadow-lg hover:shadow-pink-500/30"
            >
              <span className="flex items-center gap-2">
                <svg className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                提醒我
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  )
}