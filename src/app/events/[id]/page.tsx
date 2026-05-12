'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

// ============ Mock Data ============
const events = [
  { id: '1', title: 'BTS 演唱会', artist: 'BTS', type: 'concert', country: '韩国', city: '首尔', venue: '奥林匹克体育场', date: '2026-06-01', status: 'upcoming', hotScore: 9999, image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop' },
  { id: '2', title: 'BLACKPINK 签售会', artist: 'BLACKPINK', type: 'fansign', country: '日本', city: '东京', venue: 'TOKYO DOME', date: '2026-06-10', status: 'ticketing', hotScore: 9500, image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop' },
  { id: '3', title: 'Stray Kids 世界巡演', artist: 'Stray Kids', type: 'concert', country: '中国', city: '上海', venue: '梅赛德斯奔驰中心', date: '2026-06-15', status: 'upcoming', hotScore: 9200, image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=300&fit=crop' },
  { id: '4', title: 'NewJeans 快闪店', artist: 'NewJeans', type: 'popup', country: '新加坡', city: '新加坡', venue: '滨海湾金沙', date: '2026-06-20', status: 'upcoming', hotScore: 8800, image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop' },
  { id: '5', title: 'TWICE 演唱会', artist: 'TWICE', type: 'concert', country: '美国', city: '洛杉矶', venue: 'Crypto.com Arena', date: '2026-07-01', status: 'upcoming', hotScore: 8600, image: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=400&h=300&fit=crop' },
  { id: '6', title: 'IVE 粉丝见面会', artist: 'IVE', type: 'fanmeeting', country: '泰国', city: '曼谷', venue: 'IMPACT Arena', date: '2026-07-05', status: 'upcoming', hotScore: 8200, image: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=400&h=300&fit=crop' },
]

const artists = [
  { id: '1', name: 'BTS', nameEn: 'Bangtan Boys', agency: 'HYBE', memberCount: 7, hotScore: 9999, country: '韩国', profileImage: 'https://images.unsplash.com/photo-1614644147798-f8c0fc9da7f6?w=300&h=300&fit=crop', tags: ['防弹少年团', 'Kpop', '男子团体'] },
  { id: '2', name: 'BLACKPINK', nameEn: 'BLACKPINK', agency: 'YG', memberCount: 4, hotScore: 9850, country: '韩国', profileImage: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=300&h=300&fit=crop', tags: ['粉墨', 'Kpop', '女子团体'] },
  { id: '3', name: 'Stray Kids', nameEn: 'Stray Kids', agency: 'JYP', memberCount: 8, hotScore: 9720, country: '韩国', profileImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop', tags: ['迷路孩子', 'Kpop', '男团'] },
  { id: '4', name: 'NewJeans', nameEn: 'NewJeans', agency: 'HYBE', memberCount: 5, hotScore: 9600, country: '韩国', profileImage: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=300&h=300&fit=crop', tags: ['鲸鱼', 'Kpop', '女团'] },
  { id: '5', name: 'TWICE', nameEn: 'TWICE', agency: 'JYP', memberCount: 9, hotScore: 9450, country: '韩国', profileImage: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=300&h=300&fit=crop', tags: ['两次', 'Kpop', '女团'] },
  { id: '6', name: 'IVE', nameEn: 'IVE', agency: 'Starship', memberCount: 6, hotScore: 9300, country: '韩国', profileImage: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=300&h=300&fit=crop', tags: ['爱豆', 'Kpop', '女团'] },
]

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

  const event = events.find(e => e.id === id)
  if (!event) {
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

  // Find related artists (by artist name)
  const relatedArtists = artists.filter(a => a.name === event.artist)

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
              src={event.image}
              alt={event.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <Badge className={`absolute left-4 top-4 border ${statusColors[event.status]}`}>
              {statusLabels[event.status]}
            </Badge>
          </div>

          {/* Info */}
          <div className="p-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="outline">{typeLabels[event.type]}</Badge>
              <Badge variant="outline">{event.country}</Badge>
              <span className="text-sm text-muted-foreground">🔥 {event.hotScore.toLocaleString()} 热度</span>
            </div>
            <h1 className="text-3xl font-bold text-white">{event.title}</h1>
            <p className="mt-2 text-lg text-muted-foreground">{event.venue}</p>

            {/* Details Grid */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-border/50 bg-black/40 p-4 text-center">
                <div className="text-sm text-muted-foreground">日期</div>
                <div className="mt-1 text-lg font-semibold text-purple-300">{event.date}</div>
              </div>
              <div className="rounded-lg border border-border/50 bg-black/40 p-4 text-center">
                <div className="text-sm text-muted-foreground">城市</div>
                <div className="mt-1 text-lg font-semibold text-white">{event.city}</div>
              </div>
              <div className="rounded-lg border border-border/50 bg-black/40 p-4 text-center">
                <div className="text-sm text-muted-foreground">类型</div>
                <div className="mt-1 text-lg font-semibold text-white">{typeLabels[event.type]}</div>
              </div>
              <div className="rounded-lg border border-border/50 bg-black/40 p-4 text-center">
                <div className="text-sm text-muted-foreground">艺人</div>
                <div className="mt-1 text-lg font-semibold text-pink-300">{event.artist}</div>
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
                      src={artist.profileImage}
                      alt={artist.name}
                      fallback={artist.name.charAt(0)}
                      className="h-20 w-20 mx-auto mb-3"
                    />
                    <h3 className="font-bold text-white group-hover:text-purple-400 transition-colors">{artist.name}</h3>
                    <p className="text-sm text-muted-foreground">{artist.agency}</p>
                    <div className="mt-2 flex items-center justify-center gap-1 text-xs text-orange-400">
                      <span>🔥</span>
                      <span>{artist.hotScore.toLocaleString()}</span>
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
