'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'

type News = Database['public']['Tables']['news']['Row']

const supabase = createClient()

const fetcher = async (): Promise<News[]> => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('publish_date', { ascending: false })
  if (error) throw error
  return data || []
}

const typeFilters = [
  { value: 'all', label: '全部' },
  { value: 'schedule', label: '日程' },
  { value: 'comeback', label: '回归' },
  { value: 'achievement', label: '成就' },
  { value: 'event', label: '活动' },
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

export default function NewsPage() {
  const [selectedType, setSelectedType] = useState('all')
  const { data: newsItems, error, isLoading } = useSWR('news-list', fetcher)

  const filteredNews = selectedType === 'all'
    ? (newsItems || [])
    : (newsItems || []).filter((news) => news.news_type === selectedType)

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">📰 最新资讯</h1>
          <p className="mt-2 text-muted-foreground">AI精选全球KPOP新闻与动态</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400">
            加载失败: {error.message}
          </div>
        )}

        {/* Filters */}
        <div className="mb-8 flex gap-2">
          {typeFilters.map((filter) => (
            <Button
              key={filter.value}
              variant={selectedType === filter.value ? 'kpop' : 'outline'}
              size="sm"
              onClick={() => setSelectedType(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* News Grid */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="border-border/50 bg-card/50">
                <div className="aspect-video bg-secondary animate-pulse" />
                <CardContent className="p-4">
                  <div className="h-5 w-full bg-secondary rounded animate-pulse mb-2" />
                  <div className="h-4 w-32 bg-secondary rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">暂无符合条件的新闻</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredNews.map((news) => (
              <Card key={news.id} className="group cursor-pointer overflow-hidden border-border/50 bg-card/50 backdrop-blur hover:border-purple-500/50">
                <div className="relative aspect-video">
                  <img
                    src={news.image_url || ''}
                    alt={news.title || ''}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <Badge className={`absolute left-3 top-3 border ${typeColors[news.news_type || 'event']}`}>
                    {typeLabels[news.news_type || 'event']}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {news.summary}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{news.source}</span>
                      <span>·</span>
                      <span>{news.publish_date}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {(news.tags || []).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}