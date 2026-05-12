'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// Mock data
const newsItems = [
  { id: '1', title: 'BTS 成员陆续完成兵役，即将完整体回归', summary: '据韩媒报道，BTS成员将于2025年陆续完成兵役，预计2026年将以完整体形式回归。这次回归将是BTS自2019年以来的首次完整体活动...', imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop', source: '韩娱新闻', publishDate: '2026-05-13', newsType: 'schedule', tags: ['BTS', '兵役', '回归'] },
  { id: '2', title: 'NewJeans 签约美国唱片公司，进军全球市场', summary: 'NewJeans 宣布与美国知名唱片公司签约，正式启动全球扩张计划。这一举措标志着Kpop女团在国际市场的又一次突破...', imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&h=400&fit=crop', source: '音乐周刊', publishDate: '2026-05-12', newsType: 'achievement', tags: ['NewJeans', '美国', '签约'] },
  { id: '3', title: 'IVE 新专辑预告片发布，概念照公开', summary: 'IVE 发布了新专辑《I\'VE MINE》的预告片和概念照，引发粉丝热议。新专辑预计将于6月中旬正式发布...', imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=400&fit=crop', source: 'KPOP Daily', publishDate: '2026-05-11', newsType: 'comeback', tags: ['IVE', '专辑', '预告'] },
  { id: '4', title: 'Stray Kids 东京巨蛋演唱会门票秒空', summary: 'Stray Kids 东京巨蛋演唱会门票开售即秒空，创下今年最快的票务记录。本次演唱会将于8月在东京巨蛋举行...', imageUrl: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=600&h=400&fit=crop', source: '票务网', publishDate: '2026-05-10', newsType: 'event', tags: ['Stray Kids', '演唱会', '东京'] },
  { id: '5', title: 'BLACKPINK 世界巡演收入创纪录', summary: 'BLACKPINK 世界巡演总收入超过10亿美元，成为Kpop艺人中最高的巡演收入记录。这次巡演覆盖了全球50多个城市...', imageUrl: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=600&h=400&fit=crop', source: 'Billboard', publishDate: '2026-05-09', newsType: 'achievement', tags: ['BLACKPINK', '巡演', '收入'] },
  { id: '6', title: 'LE SSERAFIM 出演美国音乐节', summary: 'LE SSERAFIM 确认将出演美国最大的音乐节之一，这是她们首次在美国音乐节上表演。此次演出将在下个月举行...', imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop', source: '音乐节官方', publishDate: '2026-05-08', newsType: 'schedule', tags: ['LE SSERAFIM', '美国', '音乐节'] },
]

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

  const filteredNews = selectedType === 'all'
    ? newsItems
    : newsItems.filter(news => news.newsType === selectedType)

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">📰 最新资讯</h1>
          <p className="mt-2 text-muted-foreground">AI精选全球KPOP新闻与动态</p>
        </div>

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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredNews.map((news) => (
            <Card key={news.id} className="group cursor-pointer overflow-hidden border-border/50 bg-card/50 backdrop-blur hover:border-purple-500/50">
              <div className="relative aspect-video">
                <img
                  src={news.imageUrl}
                  alt={news.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <Badge className={`absolute left-3 top-3 border ${typeColors[news.newsType]}`}>
                  {typeLabels[news.newsType]}
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
                    <span>{news.publishDate}</span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {news.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">暂无符合条件的新闻</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}