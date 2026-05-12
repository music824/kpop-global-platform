'use client'

import { useEffect, useState } from 'react'

// Mock flash news data - will be replaced with real Supabase data
const flashNewsItems = [
  { id: '1', content: '🎉 IVE 6月回归官宣，新专辑即将发布', type: 'comeback' },
  { id: '2', content: '🎫 BTS演唱会票务今日开放，火爆抢购中', type: 'ticketing' },
  { id: '3', content: '🏆 NewJeans 获得 Billboard 榜单冠军', type: 'achievement' },
  { id: '4', content: '📅 Stray Kids 追加东京场演出', type: 'event' },
  { id: '5', content: '💚 LE SSERAFIM 出演音乐节目预告', type: 'schedule' },
]

export function FlashNewsTicker() {
  const [isPaused, setIsPaused] = useState(false)

  return (
    <section 
      className="border-y border-border/50 bg-secondary/30"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center">
        {/* Label */}
        <div className="flex shrink-0 items-center gap-2 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-4 py-3">
          <span className="font-bold text-white">快讯</span>
        </div>

        {/* Ticker */}
        <div className="overflow-hidden py-3">
          <div className={`flex gap-12 ${isPaused ? '' : 'ticker-scroll'}`}>
            {/* Duplicate for seamless loop */}
            {[...flashNewsItems, ...flashNewsItems].map((item, index) => (
              <span
                key={`${item.id}-${index}`}
                className="whitespace-nowrap text-sm text-muted-foreground hover:text-white transition-colors cursor-pointer"
              >
                {item.content}
                <span className="ml-12 text-border/50">|</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}