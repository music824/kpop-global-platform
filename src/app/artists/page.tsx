'use client'

import { useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'

type Artist = Database['public']['Tables']['artists']['Row']

const supabase = createClient()

const fetcher = async (): Promise<Artist[]> => {
  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .order('hot_score', { ascending: false })
  if (error) throw error
  return data || []
}

export default function ArtistsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: artists, error, isLoading } = useSWR('artists-list', fetcher)

  const filteredArtists = (artists || []).filter((artist) =>
    (artist.name_zh || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (artist.name_en || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">🎤 热门艺人</h1>
          <p className="mt-2 text-muted-foreground">探索全球KPOP艺人及其最新动态</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="搜索艺人..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-card px-4 py-2 text-white placeholder:text-muted-foreground focus:border-purple-500 focus:outline-none"
            />
            <svg className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400">
            加载失败: {error.message}
          </div>
        )}

        {/* Artists Grid */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="border-border/50 bg-card/50">
                <CardContent className="p-4">
                  <div className="h-28 w-28 mx-auto mb-4 rounded-full bg-secondary animate-pulse" />
                  <div className="h-5 w-24 mx-auto mb-2 bg-secondary rounded animate-pulse" />
                  <div className="h-4 w-16 mx-auto bg-secondary rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredArtists.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">暂无艺人数据</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredArtists.map((artist, index) => (
              <Link href={`/artists/${artist.id}`}>
                <Card key={artist.id} className="group cursor-pointer overflow-hidden border-border/50 bg-card/50 backdrop-blur hover:border-purple-500/50">
              
                <CardContent className="p-4">
                  {/* Avatar with Rank */}
                  <div className="relative mb-4">
                    <Avatar
                      src={artist.profile_image || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400'}
                      alt={artist.name_zh || artist.name_en || ''}
                      fallback={(artist.name_zh || artist.name_en || '?').charAt(0)}
                      className="h-28 w-28 mx-auto"
                    />
                    <div className={`absolute -top-1 -left-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      index === 0 ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' :
                      index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-300 text-black' :
                      index === 2 ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white' :
                      'bg-secondary text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                  </div>

                  {/* Name */}
                  <div className="text-center">
                    <h3 className="font-bold text-white group-hover:text-purple-400 transition-colors">
                      {artist.name_zh || artist.name_en}
                    </h3>
                    <p className="text-sm text-muted-foreground">{artist.name_en}</p>
                  </div>

                  {/* Info */}
                  <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <span>{artist.agency}</span>
                    <span>·</span>
                    <span>{artist.member_count}人</span>
                  </div>

                  {/* Tags */}
                  <div className="mt-3 flex flex-wrap justify-center gap-1">
                    {(artist.tags || []).slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>

                  {/* Hot Score */}
                  <div className="mt-4 flex items-center justify-center gap-1 text-orange-400">
                    <span>🔥</span>
                    <span className="text-sm font-semibold">{(artist.hot_score || 0).toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
              </Link>
            ))}
          </div>
        )}

        {artists && filteredArtists.length === 0 && searchQuery && (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">未找到匹配的艺人</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}