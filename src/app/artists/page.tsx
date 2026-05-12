'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

// Mock data
const artists = [
  { id: '1', name: 'BTS', nameEn: 'Bangtan Boys', agency: 'HYBE', memberCount: 7, hotScore: 9999, country: '韩国', profileImage: 'https://images.unsplash.com/photo-1614644147798-f8c0fc9da7f6?w=300&h=300&fit=crop', tags: ['防弹少年团', 'Kpop', '男子团体'] },
  { id: '2', name: 'BLACKPINK', nameEn: 'BLACKPINK', agency: 'YG', memberCount: 4, hotScore: 9850, country: '韩国', profileImage: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=300&h=300&fit=crop', tags: ['粉墨', 'Kpop', '女子团体'] },
  { id: '3', name: 'Stray Kids', nameEn: 'Stray Kids', agency: 'JYP', memberCount: 8, hotScore: 9720, country: '韩国', profileImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop', tags: ['迷路孩子', 'Kpop', '男团'] },
  { id: '4', name: 'NewJeans', nameEn: 'NewJeans', agency: 'HYBE', memberCount: 5, hotScore: 9600, country: '韩国', profileImage: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=300&h=300&fit=crop', tags: ['鲸鱼', 'Kpop', '女团'] },
  { id: '5', name: 'TWICE', nameEn: 'TWICE', agency: 'JYP', memberCount: 9, hotScore: 9450, country: '韩国', profileImage: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=300&h=300&fit=crop', tags: ['两次', 'Kpop', '女团'] },
  { id: '6', name: 'IVE', nameEn: 'IVE', agency: 'Starship', memberCount: 6, hotScore: 9300, country: '韩国', profileImage: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=300&h=300&fit=crop', tags: ['爱豆', 'Kpop', '女团'] },
  { id: '7', name: '(G)I-DLE', nameEn: '(G)I-DLE', agency: 'CUBE', memberCount: 6, hotScore: 8800, country: '韩国', profileImage: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=300&h=300&fit=crop', tags: ['田小娟', 'Kpop', '女团'] },
  { id: '8', name: 'aespa', nameEn: 'aespa', agency: 'SM', memberCount: 4, hotScore: 8700, country: '韩国', profileImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop', tags: ['艾尔', 'Kpop', '女团'] },
  { id: '9', name: 'LE SSERAFIM', nameEn: 'LE SSERAFIM', agency: 'Source Music', memberCount: 5, hotScore: 8600, country: '韩国', profileImage: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=300&h=300&fit=crop', tags: ['宫胁咲良', 'Kpop', '女团'] },
  { id: '10', name: 'NCT', nameEn: 'NCT', agency: 'SM', memberCount: 23, hotScore: 8500, country: '韩国', profileImage: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=300&h=300&fit=crop', tags: ['耐克', 'Kpop', '男团'] },
]

export default function ArtistsPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredArtists = artists.filter(artist =>
    artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    artist.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
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

        {/* Artists Grid */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredArtists.map((artist, index) => (
            <Card key={artist.id} className="group cursor-pointer overflow-hidden border-border/50 bg-card/50 backdrop-blur hover:border-purple-500/50">
              <CardContent className="p-4">
                {/* Avatar with Rank */}
                <div className="relative mb-4">
                  <Avatar
                    src={artist.profileImage}
                    alt={artist.name}
                    fallback={artist.name.charAt(0)}
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
                    {artist.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{artist.nameEn}</p>
                </div>

                {/* Info */}
                <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <span>{artist.agency}</span>
                  <span>·</span>
                  <span>{artist.memberCount}人</span>
                </div>

                {/* Tags */}
                <div className="mt-3 flex flex-wrap justify-center gap-1">
                  {artist.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>

                {/* Hot Score */}
                <div className="mt-4 flex items-center justify-center gap-1 text-orange-400">
                  <span>🔥</span>
                  <span className="text-sm font-semibold">{artist.hotScore.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredArtists.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">未找到匹配的艺人</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}