import Link from 'next/link'
import useSWR from 'swr'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'

type Artist = Database['public']['Tables']['artists']['Row']

const supabase = createClient()

const fetcher = async (): Promise<Artist[]> => {
  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .order('hot_score', { ascending: false })
    .limit(6)
  if (error) throw error
  return data || []
}

export function HotArtists() {
  const { data: hotArtists, error, isLoading } = useSWR('hot-artists', fetcher)

  if (error) {
    console.error('Failed to load hot artists:', error)
  }

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
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="border-border/50 bg-card/50">
                <CardContent className="p-3">
                  <div className="h-20 w-20 mx-auto mb-3 rounded-full bg-secondary animate-pulse" />
                  <div className="h-5 w-16 mx-auto bg-secondary rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {hotArtists?.map((artist, index) => (
              <Link key={artist.id} href={`/artists/${artist.slug || artist.id}`}>
                <Card className="group cursor-pointer overflow-hidden border-border/50 bg-card/50 backdrop-blur hover:border-purple-500/50 hover:bg-card">
                  <CardContent className="p-3">
                    {/* Avatar with Rank */}
                    <div className="relative mb-3">
                      <Avatar
                        src={artist.profile_image || ''}
                        alt={artist.name_zh || artist.name_en || ''}
                        fallback={(artist.name_zh || artist.name_en || '?').charAt(0)}
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
                        {artist.name_zh || artist.name_en}
                      </h3>
                      <p className="text-xs text-muted-foreground">{artist.name_en}</p>
                    </div>

                    {/* Hot Score */}
                    <div className="mt-2 flex items-center justify-center gap-1 text-xs text-orange-400">
                      <span>🔥</span>
                      <span>{(artist.hot_score || 0).toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}