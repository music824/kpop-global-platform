'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
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

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800'

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

export default function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const fetcher = async (): Promise<News> => {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    if (!data) throw new Error('News not found')
    return data
  }

  const { data: news, error, isLoading } = useSWR(id ? `news-detail-${id}` : null, fetcher)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-20 text-center">
          <div className="text-muted-foreground">加载中...</div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-white">新闻不存在</h1>
          <Button onClick={() => router.back()} className="mt-6">返回</Button>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-6 text-muted-foreground hover:text-white"
        >
          ← 返回
        </Button>

        {/* Cover Image */}
        <div className="relative aspect-video overflow-hidden rounded-xl">
          <img
            src={news.image_url || DEFAULT_IMAGE}
            alt={news.title || ''}
            className="h-full w-full object-cover"
            onError={(e) => { e.currentTarget.src = DEFAULT_IMAGE }}
          />
          <Badge className={`absolute left-4 top-4 border ${typeColors[news.news_type || 'event']}`}>
            {typeLabels[news.news_type || 'event']}
          </Badge>
        </div>

        {/* Article Content */}
        <article className="mt-8">
          <h1 className="text-3xl font-bold text-white">{news.title}</h1>
          
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span>{news.source}</span>
            <span>·</span>
            <span>{news.publish_date}</span>
          </div>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {(news.tags || []).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
            ))}
          </div>

          {/* Summary */}
          {news.summary && (
            <div className="mt-8 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-6 border border-border/50">
              <p className="text-lg text-muted-foreground">{news.summary}</p>
            </div>
          )}

          {/* Main Content */}
          {news.content && (
            <div className="mt-8 space-y-4 text-muted-foreground leading-relaxed">
              {news.content.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}
        </article>
      </main>
      <Footer />
    </div>
  )
}