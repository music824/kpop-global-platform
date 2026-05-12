'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// Mock data
const events = [
  { id: '1', title: 'BTS 演唱会', artist: 'BTS', type: 'concert', country: '韩国', city: '首尔', venue: '奥林匹克体育场', date: '2026-06-01', status: 'upcoming', hotScore: 9999, image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop' },
  { id: '2', title: 'BLACKPINK 签售会', artist: 'BLACKPINK', type: 'fansign', country: '日本', city: '东京', venue: 'TOKYO DOME', date: '2026-06-10', status: 'ticketing', hotScore: 9500, image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop' },
  { id: '3', title: 'Stray Kids 世界巡演', artist: 'Stray Kids', type: 'concert', country: '中国', city: '上海', venue: '梅赛德斯奔驰中心', date: '2026-06-15', status: 'upcoming', hotScore: 9200, image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=300&fit=crop' },
  { id: '4', title: 'NewJeans 快闪店', artist: 'NewJeans', type: 'popup', country: '新加坡', city: '新加坡', venue: '滨海湾金沙', date: '2026-06-20', status: 'upcoming', hotScore: 8800, image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop' },
  { id: '5', title: 'TWICE 演唱会', artist: 'TWICE', type: 'concert', country: '美国', city: '洛杉矶', venue: 'Crypto.com Arena', date: '2026-07-01', status: 'upcoming', hotScore: 8600, image: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=400&h=300&fit=crop' },
  { id: '6', title: 'IVE 粉丝见面会', artist: 'IVE', type: 'fanmeeting', country: '泰国', city: '曼谷', venue: 'IMPACT Arena', date: '2026-07-05', status: 'upcoming', hotScore: 8200, image: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=400&h=300&fit=crop' },
]

const eventTypes = [
  { value: 'all', label: '全部' },
  { value: 'concert', label: '演唱会' },
  { value: 'fansign', label: '签售会' },
  { value: 'popup', label: '快闪店' },
  { value: 'fanmeeting', label: '粉丝会' },
]

const countries = ['全部', '韩国', '中国', '美国', '日本', '新加坡', '泰国']

const typeLabels: Record<string, string> = {
  concert: '演唱会',
  fansign: '签售会',
  popup: '快闪店',
  fanmeeting: '粉丝会',
}

const statusColors: Record<string, string> = {
  upcoming: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  ticketing: 'bg-green-500/20 text-green-400 border-green-500/30',
  ended: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

export default function EventsPage() {
  const [selectedType, setSelectedType] = useState('all')
  const [selectedCountry, setSelectedCountry] = useState('全部')

  const filteredEvents = events.filter(event => {
    const typeMatch = selectedType === 'all' || event.type === selectedType
    const countryMatch = selectedCountry === '全部' || event.country === selectedCountry
    return typeMatch && countryMatch
  })

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">🎤 全球活动</h1>
          <p className="mt-2 text-muted-foreground">探索全球KPOP演唱会、签售会及更多活动</p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4">
          {/* Type Filter */}
          <div className="flex gap-2">
            {eventTypes.map((type) => (
              <Button
                key={type.value}
                variant={selectedType === type.value ? 'kpop' : 'outline'}
                size="sm"
                onClick={() => setSelectedType(type.value)}
              >
                {type.label}
              </Button>
            ))}
          </div>

          {/* Country Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">国家:</span>
            <div className="flex gap-1">
              {countries.map((country) => (
                <Button
                  key={country}
                  variant={selectedCountry === country ? 'kpop' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedCountry(country)}
                >
                  {country}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="group cursor-pointer overflow-hidden border-border/50 bg-card/50 backdrop-blur hover:border-purple-500/50">
              <div className="relative aspect-video">
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <Badge className={`absolute left-3 top-3 border ${statusColors[event.status]}`}>
                  {event.status === 'ticketing' ? '🎫 售票中' : event.status === 'upcoming' ? '📅 即将开始' : '已结束'}
                </Badge>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">{typeLabels[event.type]}</Badge>
                  <span className="text-xs text-muted-foreground">{event.country} · {event.city}</span>
                </div>
                <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-1">
                  {event.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{event.venue}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-purple-400">{event.date}</span>
                  <span className="flex items-center gap-1 text-xs text-orange-400">
                    🔥 {event.hotScore.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">暂无符合条件的活动</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}