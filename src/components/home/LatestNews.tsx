import Link from 'next/link'
import useSWR from 'swr'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'

type News = Database['public']['Tables']['news']['Row']

const supabase = createClient()

const fetcher = async (): Promise<News[]> => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('publish_date', { ascending: false })
    .limit(6)
  if (error) throw error
  return data || []
}

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
  const { data: latestNews, error, isLoading } = useSWR('latest-news', fetcher)

  if (error) {
    console.error('Failed to load latest news:', error)
  }

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
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-border/50 bg-card/50">
              <div className="aspect-video bg-secondary animate-pulse" />
              <CardContent className="p-4">
                <div className="h-5 w-full bg-secondary rounded animate-pulse mb-2" />
                <div className="h-4 w-32 bg-secondary rounded animate-pulse" />
              </CardContent>
            </Card>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="border-border/50 bg-card/50">
                  <CardContent className="flex gap-4 p-4">
                    <div className="h-20 w-20 bg-secondary rounded-lg animate-pulse" />
                    <div className="flex-1">
                      <div className="h-4 w-full bg-secondary rounded animate-pulse mb-2" />
                      <div className="h-4 w-32 bg-secondary rounded animate-pulse" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : !latestNews || latestNews.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">暂无新闻</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Featured News */}
            <Link href={`/news/${latestNews[0].slug || latestNews[0].id}`}>
              <Card className="group cursor-pointer overflow-hidden border-border/50 bg-card/50 backdrop-blur hover:border-purple-500/50">
                <div className="relative aspect-video">
                  <img
                    src={latestNews[0].image_url || ''}
                    alt={latestNews[0].title || ''}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <Badge className={`absolute left-4 top-4 border ${typeColors[latestNews[0].news_type || 'event']}`}>
                    {typeLabels[latestNews[0].news_type || 'event']}
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
                    <span>{latestNews[0].publish_date}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* News List */}
            <div className="space-y-4">
              {latestNews.slice(1).map((news) => (
                <Link key={news.id} href={`/news/${news.slug || news.id}`}>
                  <Card className="group cursor-pointer border-border/50 bg-card/50 backdrop-blur hover:border-purple-500/50">
                    <CardContent className="flex gap-4 p-4">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                        <img
                          src={news.image_url || ''}
                          alt={news.title || ''}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={`text-xs border ${typeColors[news.news_type || 'event']}`}>
                            {typeLabels[news.news_type || 'event']}
                          </Badge>
                        </div>
                        <h3 className="font-medium text-sm text-white group-hover:text-purple-400 transition-colors line-clamp-2">
                          {news.title}
                        </h3>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{news.source}</span>
                          <span>·</span>
                          <span>{news.publish_date}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}