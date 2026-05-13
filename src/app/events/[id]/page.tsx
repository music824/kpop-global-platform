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

type Event = Database['public']['Tables']['events']['Row']
type Artist = Database['public']['Tables']['artists']['Row']

const supabase = createClient()

const eventFetcher = async (): Promise<Event[]> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: true })
  if (error) throw error
  return data || []
}

const artistFetcher = async (): Promise<Artist[]> => {
  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .order('hot_score', { ascending: false })
  if (error) throw error
  return data || []
}

const DEFAULT_ARTIST_IMAGE = 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400'
const DEFAULT_POSTER = 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800'

// ============ Venue & Country Translation ============
const countryLabels: Record<string, string> = {
  KR: '韩国',
  JP: '日本',
  US: '美国',
  CN: '中国',
}

const venueLabels: Record<string, string> = {
  'Olympic Stadium': '奥林匹克体育场',
  'Gocheok Sky Dome': '高尺天空巨蛋',
  'Jamsil Arena': '综合运动场',
  'TOKYO DOME': '东京巨蛋',
  '梅赛德斯奔驰中心': '梅赛德斯奔驰文化中心',
  'Mercedes-Benz Arena': '梅赛德斯奔驰文化中心',
  'IMPACT Arena': 'IMPACT竞技场',
}

function translateCountry(country: string | null): string {
  if (!country) return '未知'
  return countryLabels[country.toUpperCase()] || country
}

function translateVenue(venue: string | null): string {
  if (!venue) return '未知场馆'
  return venueLabels[venue] || venue
}

function getArtistDisplayName(artist: Artist): string {
  return artist.name_zh || artist.name_en || artist.name_ko || artist.group_name || '未知艺人'
}

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

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { data: allEvents, isLoading: eventsLoading } = useSWR('events-list', eventFetcher)
  const { data: allArtists, isLoading: artistsLoading } = useSWR('artists-list', artistFetcher)

  const event = allEvents?.find(e => e.id === id)

  if (!eventsLoading && !event) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-20 text-center">
          <p className="text-muted-foreground">未找到该活动</p>
          <Button variant="kpop" className="mt-4" onClick={() => router.push('/events')}>
            返回列表
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  if (eventsLoading) {
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

  const displayCountry = translateCountry(event!.country)
  const displayVenue = translateVenue(event!.venue)

  // Find related artists (by artist_id)
  const relatedArtists = (allArtists || []).filter(a => a.id === event!.artist_id)

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6 text-muted-foreground hover:text-white" onClick={() => router.push('/events')}>
          ← 返回活动列表
        </Button>

        {/* Event Hero */}
        <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur">
          {/* Cover Image */}
          <div className="relative aspect-video">
            <img
              src={event!.poster_image || DEFAULT_POSTER}
              alt={event!.title || ''}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <Badge className={`absolute left-4 top-4 border ${statusColors[event!.status || 'upcoming']}`}>
              {statusLabels[event!.status || 'upcoming']}
            </Badge>
          </div>

          {/* Info */}
          <div className="p-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="outline">{typeLabels[event!.event_type || 'concert']}</Badge>
              <Badge variant="outline">{displayCountry}</Badge>
              <span className="text-sm text-muted-foreground">🔥 {(event!.hot_score || 0).toLocaleString()} 热度</span>
            </div>
            <h1 className="text-3xl font-bold text-white">{event!.title}</h1>
            <p className="mt-2 text-lg text-muted-foreground">{displayVenue}</p>

            {/* Details Grid */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-border/50 bg-black/40 p-4 text-center">
                <div className="text-sm text-muted-foreground">日期</div>
                <div className="mt-1 text-lg font-semibold text-purple-300">{event!.event_date}</div>
              </div>
              <div className="rounded-lg border border-border/50 bg-black/40 p-4 text-center">
                <div className="text-sm text-muted-foreground">城市</div>
                <div className="mt-1 text-lg font-semibold text-white">{event!.city || '未知'}</div>
              </div>
              <div className="rounded-lg border border-border/50 bg-black/40 p-4 text-center">
                <div className="text-sm text-muted-foreground">类型</div>
                <div className="mt-1 text-lg font-semibold text-white">{typeLabels[event!.event_type || 'concert']}</div>
              </div>
              <div className="rounded-lg border border-border/50 bg-black/40 p-4 text-center">
                <div className="text-sm text-muted-foreground">艺人</div>
                <div className="mt-1 text-lg font-semibold text-pink-300">
                  {relatedArtists.length > 0 ? getArtistDisplayName(relatedArtists[0]) : '待定'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Artists */}
        {relatedArtists.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-2xl font-bold text-white">🎤 参与艺人</h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {relatedArtists.map(artist => (
                <Card key={artist.id} className="group cursor-pointer overflow-hidden border-border/50 bg-card/50 backdrop-blur hover:border-purple-500/50">
                  <CardContent className="p-4 text-center">
                    <Avatar
                      src={artist.profile_image || DEFAULT_ARTIST_IMAGE}
                      alt={getArtistDisplayName(artist)}
                      fallback={getArtistDisplayName(artist).charAt(0)}
                      className="h-20 w-20 mx-auto mb-3"
                    />
                    <h3 className="font-bold text-white group-hover:text-purple-400 transition-colors">{getArtistDisplayName(artist)}</h3>
                    <p className="text-sm text-muted-foreground">{artist.agency}</p>
                    <div className="mt-2 flex items-center justify-center gap-1 text-xs text-orange-400">
                      <span>🔥</span>
                      <span>{(artist.hot_score || 0).toLocaleString()}</span>
                    </div>
                    <Button
                      variant="kpop"
                      size="sm"
                      className="mt-3 w-full"
                      onClick={() => router.push(`/artists/${artist.id}`)}
                    >
                      查看详情
                    </Button>
                  </CardContent>
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
