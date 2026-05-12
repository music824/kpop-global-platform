import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Mock data - will be replaced with real Supabase data
const latestNews = [
  {
    id: '1',
    title: 'BTS 成员陆续完成兵役，即将完整体回归',
    summary: '据韩媒报道，BTS成员将于2025年陆续完成兵役，预计2026年将以完整体形式回归...',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop',
    source: '韩娱新闻',
    publishDate: '2小时前',
    newsType: 'schedule',
    tags: ['BTS', '兵役', '回归']
  },
  {
    id: '2',
    title: 'NewJeans 签约美国唱片公司，进军全球市场',
    summary: 'NewJeans 宣布与美国知名唱片公司签约，正式启动全球扩张计划...',
    imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&h=400&fit=crop',
    source: '音乐周刊',
    publishDate: '5小时前',
    newsType: 'achievement',
    tags: ['NewJeans', '美国', '签约']
  },
  {
    id: '3',
    title: 'IVE 新专辑预告片发布，概念照公开',
    summary: "IVE 发布了新专辑《I'VE MINE》的预告片和概念照，引发粉丝热议...",
    imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=400&fit=crop',
    source: 'KPOP Daily',
    publishDate: '8小时前',
    newsType: 'comeback',
    tags: ['IVE', '专辑', '预告']
  },
  {
    id: '4',
    title: 'Stray Kids 东京巨蛋演唱会门票秒空',
    summary: 'Stray Kids 东京巨蛋演唱会门票开售即秒空，创下今年最快的票务记录...',
    imageUrl: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=600&h=400&fit=crop',
    source: '票务网',
    publishDate: '12小时前',
    newsType: 'event',
    tags: ['Stray Kids', '演唱会', '东京']
  },
]

const typeLabels: Record<string, string> = {
  schedule: '日程',
  achievement: '成就',
  comeback: '回归',
  event: '活动',
}

const typeColors: Record<string, string> = {
  schedule: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  achievement: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  comeback: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  event: 'bg-green-500/20 text-green-400 border-green-500/30',
}

export function LatestNews() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">📰 最新资讯</h2>
            <p className="text-sm text-muted-foreground">AI精选全球KPOP新闻</p>
          </div>
          <Link href="/news" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
            查看全部 →
          </Link>
        </div>

        {/* Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Featured News */}
          <Link href={`/news/${latestNews[0].id}`}>
            <Card className="group cursor-pointer overflow-hidden border-border/50 bg-card/50 backdrop-blur hover:border-purple-500/50">
              <div className="relative aspect-video">
                <img
                  src={latestNews[0].imageUrl}
                  alt={latestNews[0].title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <Badge className={`absolute left-4 top-4 border ${typeColors[latestNews[0].newsType]}`}>
                  {typeLabels[latestNews[0].newsType]}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-2">
                  {latestNews[0].title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {latestNews[0].summary}
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{latestNews[0].source}</span>
                  <span>·</span>
                  <span>{latestNews[0].publishDate}</span>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* News List */}
          <div className="space-y-4">
            {latestNews.slice(1).map((news) => (
              <Link key={news.id} href={`/news/${news.id}`}>
                <Card className="group cursor-pointer border-border/50 bg-card/50 backdrop-blur hover:border-purple-500/50">
                  <CardContent className="flex gap-4 p-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                      <img
                        src={news.imageUrl}
                        alt={news.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={`text-xs border ${typeColors[news.newsType]}`}>
                          {typeLabels[news.newsType]}
                        </Badge>
                      </div>
                      <h3 className="font-medium text-sm text-white group-hover:text-purple-400 transition-colors line-clamp-2">
                        {news.title}
                      </h3>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{news.source}</span>
                        <span>·</span>
                        <span>{news.publishDate}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}