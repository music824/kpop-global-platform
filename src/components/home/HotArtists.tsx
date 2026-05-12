import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'

// Mock data - will be replaced with real Supabase data
const hotArtists = [
  { id: '1', name: 'BTS', nameEn: 'Bangtan Boys', groupName: 'BTS', profileImage: 'https://images.unsplash.com/photo-1614644147798-f8c0fc9da7f6?w=300&h=300&fit=crop', hotScore: 9999, country: '韩国' },
  { id: '2', name: 'BLACKPINK', nameEn: 'BLACKPINK', groupName: 'BLACKPINK', profileImage: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=300&h=300&fit=crop', hotScore: 9850, country: '韩国' },
  { id: '3', name: 'Stray Kids', nameEn: 'Stray Kids', groupName: 'Stray Kids', profileImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop', hotScore: 9720, country: '韩国' },
  { id: '4', name: 'NewJeans', nameEn: 'NewJeans', groupName: 'NewJeans', profileImage: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=300&h=300&fit=crop', hotScore: 9600, country: '韩国' },
  { id: '5', name: 'TWICE', nameEn: 'TWICE', groupName: 'TWICE', profileImage: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=300&h=300&fit=crop', hotScore: 9450, country: '韩国' },
  { id: '6', name: 'IVE', nameEn: 'IVE', groupName: 'IVE', profileImage: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=300&h=300&fit=crop', hotScore: 9300, country: '韩国' },
]

export function HotArtists() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">🔥 热门艺人</h2>
            <p className="text-sm text-muted-foreground">实时热度排行</p>
          </div>
          <Link href="/artists" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
            查看全部 →
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {hotArtists.map((artist, index) => (
            <Link key={artist.id} href={`/artists/${artist.id}`}>
              <Card className="group cursor-pointer overflow-hidden border-border/50 bg-card/50 backdrop-blur hover:border-purple-500/50 hover:bg-card">
                <CardContent className="p-3">
                  {/* Avatar with Rank */}
                  <div className="relative mb-3">
                    <Avatar
                      src={artist.profileImage}
                      alt={artist.name}
                      fallback={artist.name.charAt(0)}
                      className="h-20 w-20 mx-auto"
                    />
                    {/* Rank Badge */}
                    <div className={`absolute -top-1 -left-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      index === 0 ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' :
                      index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-300 text-black' :
                      index === 2 ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white' :
                      'bg-secondary text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                  </div>

                  {/* Name */}
                  <div className="text-center">
                    <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                      {artist.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">{artist.nameEn}</p>
                  </div>

                  {/* Hot Score */}
                  <div className="mt-2 flex items-center justify-center gap-1 text-xs text-orange-400">
                    <span>🔥</span>
                    <span>{artist.hotScore.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}