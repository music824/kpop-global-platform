'use client'

import { useParams, useRouter } from 'next/navigation'
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
type Event = Database['public']['Tables']['events']['Row']
type News = Database['public']['Tables']['news']['Row']

const supabase = createClient()

const fetcher = async (): Promise<Artist[]> => {
  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .order('hot_score', { ascending: false })
  if (error) throw error
  return data || []
}

const eventFetcher = async (): Promise<Event[]> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: true })
  if (error) throw error
  return data || []
}

const newsFetcher = async (): Promise<News[]> => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('publish_date', { ascending: false })
  if (error) throw error
  return data || []
}

const DEFAULT_ARTIST_IMAGE = 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400'
const DEFAULT_POSTER = 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800'
const DEFAULT_NEWS_IMAGE = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800'

// ============ Helpers ============
const typeLabels: Record<string, string> = {
  concert: '演唱会',
  fansign: '签售会',
  popup: '快闪店',
  fanmeeting: '粉丝会',
}

const statusLabels: Record<string, string> = {
  upcoming: '📅 即将开始',
  ticketing: '🎫 售票中',
  ended: '已结束',
}

const statusColors: Record<string, string> = {
  upcoming: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  ticketing: 'bg-green-500/20 text-green-400 border-green-500/30',
  ended: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

const typeColors: Record<string, string> = {
  schedule: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  achievement: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  comeback: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  event: 'bg-green-500/20 text-green-400 border-green-500/30',
}

const typeLabelMap: Record<string, string> = {
  schedule: '日程',
  achievement: '成就',
  comeback: '回归',
  event: '活动',
}

const countryLabels: Record<string, string> = {
  KR: '韩国',
  JP: '日本',
  US: '美国',
  CN: '中国',
}

function getArtistDisplayName(artist: Artist): string {
  return artist.name_zh || artist.name_en || artist.name_ko || artist.group_name || '未知艺人'
}

export default function ArtistDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.slug as string

  const { data: allArtists, isLoading: artistsLoading } = useSWR('artists-list', fetcher)
  const { data: allEvents, isLoading: eventsLoading } = useSWR('events-list', eventFetcher)
  const { data: allNews, isLoading: newsLoading } = useSWR('news-list', newsFetcher)

  const artist = allArtists?.find(a => a.id === id)

  if (!artistsLoading && !artist) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-20 text-center">
          <p className="text-muted-foreground">未找到该艺人</p>
          <Button variant="kpop" className="mt-4" onClick={() => router.push('/artists')}>
            返回列表
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  if (artistsLoading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-20 text-center">
          <p className="text-muted-foreground">加载中...</p>
        </main>
        <Footer />
      </div>
    )
  }

  const artistName = getArtistDisplayName(artist!)

  // Related events (by artist_id)
  const relatedEvents = (allEvents || []).filter(e => e.artist_id === id)

  // Related news (by artist_id)
  const relatedNews = (allNews || []).filter(n => n.artist_id === id)

  // Calculate rank (sorted by hot_score)
  const sortedArtists = [...(allArtists || [])].sort((a, b) => (b.hot_score || 0) - (a.hot_score || 0))
  const rank = sortedArtists.findIndex(a => a.id === artist!.id) + 1

  const displayCountry = artist!.country ? (countryLabels[artist!.country.toUpperCase()] || artist!.country) : '未知'

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6 text-muted-foreground hover:text-white" onClick={() => router.push('/artists')}>
          ← 返回艺人列表
        </Button>

        {/* Artist Hero Section */}
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-purple-900/20 via-card/80 to-pink-900/20 p-8 backdrop-blur">
          <div className="flex flex-col items-center gap-6 md:flex-row">
            {/* Avatar */}
            <div className="relative shrink-0">
              <Avatar
                src={artist!.profile_image || DEFAULT_ARTIST_IMAGE}
                alt={artistName}
                fallback={artistName.charAt(0)}
                className="h-40 w-40 ring-2 ring-purple-500/50"
              />
              <div className="absolute -top-2 -left-2 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ring-2 ring-black bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                #{rank}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-white">{artistName}</h1>
              {(artist!.name_en || artist!.name_ko) && (
                <p className="mt-1 text-lg text-muted-foreground">{artist!.name_en || artist!.name_ko}</p>
              )}

              <div className="mt-4 flex flex-wrap justify-center gap-3 md:justify-start">
                {artist!.agency && <Badge variant="outline">{artist!.agency}</Badge>}
                <Badge variant="outline">{displayCountry}</Badge>
                {artist!.member_count && <Badge variant="outline">{artist!.member_count}人组合</Badge>}
              </div>

              <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
                {(artist!.tags || []).map(tag => (
                  <Badge key={tag} className="bg-purple-500/20 text-purple-300 border-purple-500/30">{tag}</Badge>
                ))}
              </div>
            </div>

            {/* Hot Score */}
            <div className="shrink-0 text-center">
              <div className="text-5xl font-bold text-orange-400">{(artist!.hot_score || 0).toLocaleString()}</div>
              <div className="mt-1 text-sm text-muted-foreground">🔥 热度指数</div>
            </div>
          </div>
        </div>

        {/* Related Events */}
        {relatedEvents.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-2xl font-bold text-white">🎤 相关活动</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedEvents.map(event => (
                <Card key={event.id} className="group cursor-pointer overflow-hidden border-border/50 bg-card/50 backdrop-blur hover:border-purple-500/50">
                  <div className="relative aspect-video">
                    <img src={event.poster_image || DEFAULT_POSTER} alt={event.title || ''} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <Badge className={`absolute left-3 top-3 border ${statusColors[event.status || 'upcoming']}`}>
                      {statusLabels[event.status || 'upcoming']}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">{typeLabels[event.event_type || 'concert']}</Badge>
                      <span className="text-xs text-muted-foreground">{displayCountry} · {event.city}</span>
                    </div>
                    <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-1">{event.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{event.venue}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm text-purple-400">{event.event_date}</span>
                      <span className="flex items-center gap-1 text-xs text-orange-400">🔥 {(event.hot_score || 0).toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Related News */}
        {relatedNews.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-2xl font-bold text-white">📰 相关资讯</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {relatedNews.map(news => (
                <Card key={news.id} className="group cursor-pointer overflow-hidden border-border/50 bg-card/50 backdrop-blur hover:border-purple-500/50">
                  <div className="flex gap-4">
                    <div className="relative w-32 shrink-0">
                      <img src={news.image_url || DEFAULT_NEWS_IMAGE} alt={news.title || ''} className="h-full w-full object-cover" />
                      <Badge className={`absolute left-2 top-2 border ${typeColors[news.news_type || 'event']}`}>
                        {typeLabelMap[news.news_type || 'event']}
                      </Badge>
                    </div>
                    <CardContent className="flex-1 p-4">
                      <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-2">{news.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{news.summary}</p>
                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{news.source}</span>
                        <span>{news.publish_date}</span>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}
