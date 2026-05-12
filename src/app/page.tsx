'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HeroBanner } from '@/components/home/HeroBanner'
import { FlashNewsTicker } from '@/components/home/FlashNewsTicker'
import { CountrySelector } from '@/components/home/CountrySelector'
import { HotArtists } from '@/components/home/HotArtists'
import { LatestNews } from '@/components/home/LatestNews'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main>
        <HeroBanner />
        <FlashNewsTicker />
        <CountrySelector />
        <HotArtists />
        <LatestNews />
      </main>
      <Footer />
    </div>
  )
}