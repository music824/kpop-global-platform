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

type Event = Database['public']['Tables']['events']['Row']

const supabase = createClient()

const fetcher = async (): Promise<Event[]> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: true })
  if (error) throw error
  return data || []
}

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
  const { data: events, error, isLoading } = useSWR('events-list', fetcher)

  const filteredEvents = (events || []).filter((event) => {
    const typeMatch = selectedType === 'all' || event.event_type === selectedType
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

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400">
            加载失败: {error.message}
          </div>
        )}

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
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="border-border/50 bg-card/50">
                <div className="aspect-video bg-secondary animate-pulse" />
                <CardContent className="p-4">
                  <div className="h-4 w-24 bg-secondary rounded animate-pulse mb-2" />
                  <div className="h-5 w-full bg-secondary rounded animate-pulse mb-2" />
                  <div className="h-4 w-32 bg-secondary rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">暂无符合条件的活动</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="group cursor-pointer overflow-hidden border-border/50 bg-card/50 backdrop-blur hover:border-purple-500/50">
                <div className="relative aspect-video">
                  <img
                    src={event.poster_image || ''}
                    alt={event.title || ''}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <Badge className={`absolute left-3 top-3 border ${statusColors[event.status || 'upcoming']}`}>
                    {event.status === 'ticketing' ? '🎫 售票中' : event.status === 'upcoming' ? '📅 即将开始' : '已结束'}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">{typeLabels[event.event_type || 'concert']}</Badge>
                    <span className="text-xs text-muted-foreground">{event.country} · {event.city}</span>
                  </div>
                  <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-1">
                    {event.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{event.venue}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-purple-400">{event.event_date}</span>
                    <span className="flex items-center gap-1 text-xs text-orange-400">
                      🔥 {(event.hot_score || 0).toLocaleString()}
                    </span>
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