'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Mock map data - in production this would use Leaflet or Mapbox
const mapEvents = [
  { id: '1', title: 'BTS 演唱会', city: '首尔', country: '韩国', lat: 37.5665, lng: 126.9780, date: '2026-06-01', type: 'concert' },
  { id: '2', title: 'BLACKPINK 签售会', city: '东京', country: '日本', lat: 35.6762, lng: 139.6503, date: '2026-06-10', type: 'fansign' },
  { id: '3', title: 'Stray Kids 演唱会', city: '上海', country: '中国', lat: 31.2304, lng: 121.4737, date: '2026-06-15', type: 'concert' },
  { id: '4', title: 'NewJeans 快闪店', city: '新加坡', country: '新加坡', lat: 1.3521, lng: 103.8198, date: '2026-06-20', type: 'popup' },
  { id: '5', title: 'TWICE 演唱会', city: '洛杉矶', country: '美国', lat: 34.0522, lng: -118.2437, date: '2026-07-01', type: 'concert' },
  { id: '6', title: 'IVE 粉丝会', city: '曼谷', country: '泰国', lat: 13.7563, lng: 100.5018, date: '2026-07-05', type: 'fanmeeting' },
]

const typeIcons: Record<string, string> = {
  concert: '🎤',
  fansign: '✍️',
  popup: '🏪',
  fanmeeting: '💝',
}

export default function MapPage() {
  const [selectedEvent, setSelectedEvent] = useState<typeof mapEvents[0] | null>(null)

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">🗺️ 全球活动地图</h1>
          <p className="mt-2 text-muted-foreground">可视化全球KPOP活动分布</p>
        </div>

        {/* Map Container */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Map Placeholder */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden border-border/50 bg-card/50">
              <CardContent className="p-0">
                {/* Map placeholder - would use Leaflet/Mapbox in production */}
                <div className="relative aspect-[16/10] bg-gradient-to-br from-gray-900 to-gray-800">
                  {/* Grid pattern */}
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: `linear-gradient(to right, #333 1px, transparent 1px),
                                     linear-gradient(to bottom, #333 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                  }} />

                  {/* Event markers */}
                  {mapEvents.map((event) => (
                    <div
                      key={event.id}
                      className="absolute cursor-pointer transition-transform hover:scale-125"
                      style={{
                        left: `${((event.lng + 180) / 360) * 100}%`,
                        top: `${((90 - event.lat) / 180) * 100}%`,
                      }}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-sm shadow-lg">
                        {typeIcons[event.type]}
                      </div>
                    </div>
                  ))}

                  {/* Map info overlay */}
                  <div className="absolute bottom-4 left-4 rounded-lg bg-black/70 px-3 py-2 text-xs text-white">
                    🌍 点击标记查看活动详情
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Event Types Legend */}
            <div className="mt-4 flex flex-wrap gap-4">
              {Object.entries(typeIcons).map(([type, icon]) => (
                <div key={type} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{icon}</span>
                  <span className="capitalize">{type === 'concert' ? '演唱会' : type === 'fansign' ? '签售会' : type === 'popup' ? '快闪店' : '粉丝会'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar - Event List */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">📍 最近活动</h3>
            {mapEvents.map((event) => (
              <Card
                key={event.id}
                className={`cursor-pointer border-border/50 bg-card/50 backdrop-blur transition-all ${
                  selectedEvent?.id === event.id ? 'border-purple-500 bg-purple-500/10' : 'hover:border-purple-500/50'
                }`}
                onClick={() => setSelectedEvent(event)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-lg">
                      {typeIcons[event.type]}
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{event.title}</h4>
                      <p className="mt-1 text-sm text-muted-foreground">{event.city} · {event.country}</p>
                      <p className="mt-1 text-xs text-purple-400">{event.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Selected Event Detail */}
        {selectedEvent && (
          <Card className="mt-6 border-purple-500/50 bg-purple-500/10">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{typeIcons[selectedEvent.type]}</span>
                    <h3 className="text-xl font-bold text-white">{selectedEvent.title}</h3>
                  </div>
                  <p className="mt-2 text-muted-foreground">{selectedEvent.city} · {selectedEvent.country}</p>
                  <p className="mt-1 text-purple-400">{selectedEvent.date}</p>
                </div>
                <button
                  className="text-muted-foreground hover:text-white"
                  onClick={() => setSelectedEvent(null)}
                >
                  ✕
                </button>
              </div>
              <div className="mt-4 flex gap-3">
                <button className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-medium text-white hover:opacity-90">
                  查看详情
                </button>
                <button className="rounded-lg border border-purple-500/50 px-4 py-2 text-sm font-medium text-purple-400 hover:bg-purple-500/10">
                  提醒我
                </button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  )
}