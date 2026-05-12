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

const events = [
  { id: '1', title: 'BTS 演唱会', artist: 'BTS', type: 'concert', country: '韩国', city: '首尔', venue: '奥林匹克体育场', date: '2026-06-01', status: 'upcoming', hotScore: 9999, image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop' },
  { id: '2', title: 'BLACKPINK 签售会', artist: 'BLACKPINK', type: 'fansign', country: '日本', city: '东京', venue: 'TOKYO DOME', date: '2026-06-10', status: 'ticketing', hotScore: 9500, image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop' },
  { id: '3', title: 'Stray Kids 世界巡演', artist: 'Stray Kids', type: 'concert', country: '中国', city: '上海', venue: '梅赛德斯奔驰中心', date: '2026-06-15', status: 'upcoming', hotScore: 9200, image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=300&fit=crop' },
  { id: '4', title: 'NewJeans 快闪店', artist: 'NewJeans', type: 'popup', country: '新加坡', city: '新加坡', venue: '滨海湾金沙', date: '2026-06-20', status: 'upcoming', hotScore: 8800, image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop' },
  { id: '5', title: 'TWICE 演唱会', artist: 'TWICE', type: 'concert', country: '美国', city: '洛杉矶', venue: 'Crypto.com Arena', date: '2026-07-01', status: 'upcoming', hotScore: 8600, image: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=400&h=300&fit=crop' },
  { id: '6', title: 'IVE 粉丝见面会', artist: 'IVE', type: 'fanmeeting', country: '泰国', city: '曼谷', venue: 'IMPACT Arena', date: '2026-07-05', status: 'upcoming', hotScore: 8200, image: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=400&h=300&fit=crop' },
]

const newsItems = [
  { id: '1', title: 'BTS 成员陆续完成兵役，即将完整体回归', summary: '据韩媒报道，BTS成员将于2025年陆续完成兵役，预计2026年将以完整体形式回归。这次回归将是BTS自2019年以来的首次完整体活动...', imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop', source: '韩娱新闻', publishDate: '2026-05-13', newsType: 'schedule', tags: ['BTS', '兵役', '回归'] },
  { id: '2', title: 'NewJeans 签约美国唱片公司，进军全球市场', summary: 'NewJeans 宣布与美国知名唱片公司签约，正式启动全球扩张计划。这一举措标志着Kpop女团在国际市场的又一次突破...', imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&h=400&fit=crop', source: '音乐周刊', publishDate: '2026-05-12', newsType: 'achievement', tags: ['NewJeans', '美国', '签约'] },
  { id: '3', title: 'IVE 新专辑预告片发布，概念照公开', summary: 'IVE 发布了新专辑《I\'VE MINE》的预告片和概念照，引发粉丝热议。新专辑预计将于6月中旬正式发布...', imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=400&fit=crop', source: 'KPOP Daily', publishDate: '2026-05-11', newsType: 'comeback', tags: ['IVE', '专辑', '预告'] },
  { id: '4', title: 'Stray Kids 东京巨蛋演唱会门票秒空', summary: 'Stray Kids 东京巨蛋演唱会门票开售即秒空，创下今年最快的票务记录。本次演唱会将于8月在东京巨蛋举行...', imageUrl: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=600&h=400&fit=crop', source: '票务网', publishDate: '2026-05-10', newsType: 'event', tags: ['Stray Kids', '演唱会', '东京'] },
  { id: '5', title: 'BLACKPINK 世界巡演收入创纪录', summary: 'BLACKPINK 世界巡演总收入超过10亿美元，成为Kpop艺人中最高的巡演收入记录。这次巡演覆盖了全球50多个城市...', imageUrl: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=600&h=400&fit=crop', source: 'Billboard', publishDate: '2026-05-09', newsType: 'achievement', tags: ['BLACKPINK', '巡演', '收入'] },
  { id: '6', title: 'LE SSERAFIM 出演美国音乐节', summary: 'LE SSERAFIM 确认将出演美国最大的音乐节之一，这是她们首次在美国音乐节上表演。此次演出将在下个月举行...', imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop', source: '音乐节官方', publishDate: '2026-05-08', newsType: 'schedule', tags: ['LE SSERAFIM', '美国', '音乐节'] },
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

export default function ArtistDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const artist = artists.find(a => a.id === slug)
  if (!artist) {
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

  // Find related events (by artist name)
  const relatedEvents = events.filter(e => e.artist === artist.name)

  // Find related news (by artist name in tags)
  const relatedNews = newsItems.filter(n => n.tags.some(tag => tag === artist.name))

  // Calculate rank (sorted by hotScore)
  const sortedArtists = [...artists].sort((a, b) => b.hotScore - a.hotScore)
  const rank = sortedArtists.findIndex(a => a.id === artist.id) + 1

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
                src={artist.profileImage}
                alt={artist.name}
                fallback={artist.name.charAt(0)}
                className="h-40 w-40 ring-2 ring-purple-500/50"
              />
              <div className="absolute -top-2 -left-2 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ring-2 ring-black bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                #{rank}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-white">{artist.name}</h1>
              <p className="mt-1 text-lg text-muted-foreground">{artist.nameEn}</p>

              <div className="mt-4 flex flex-wrap justify-center gap-3 md:justify-start">
                <Badge variant="outline">{artist.agency}</Badge>
                <Badge variant="outline">{artist.country}</Badge>
                <Badge variant="outline">{artist.memberCount}人组合</Badge>
              </div>

              <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
                {artist.tags.map(tag => (
                  <Badge key={tag} className="bg-purple-500/20 text-purple-300 border-purple-500/30">{tag}</Badge>
                ))}
              </div>
            </div>

            {/* Hot Score */}
            <div className="shrink-0 text-center">
              <div className="text-5xl font-bold text-orange-400">{artist.hotScore.toLocaleString()}</div>
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
                    <img src={event.image} alt={event.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <Badge className={`absolute left-3 top-3 border ${statusColors[event.status]}`}>
                      {statusLabels[event.status]}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">{typeLabels[event.type]}</Badge>
                      <span className="text-xs text-muted-foreground">{event.country} · {event.city}</span>
                    </div>
                    <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-1">{event.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{event.venue}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm text-purple-400">{event.date}</span>
                      <span className="flex items-center gap-1 text-xs text-orange-400">🔥 {event.hotScore.toLocaleString()}</span>
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
                      <img src={news.imageUrl} alt={news.title} className="h-full w-full object-cover" />
                      <Badge className={`absolute left-2 top-2 border ${typeColors[news.newsType]}`}>
                        {typeLabelMap[news.newsType]}
                      </Badge>
                    </div>
                    <CardContent className="flex-1 p-4">
                      <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-2">{news.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{news.summary}</p>
                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{news.source}</span>
                        <span>{news.publishDate}</span>
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
