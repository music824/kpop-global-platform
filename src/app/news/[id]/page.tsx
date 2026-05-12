'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// Mock data (same as news list page)
const newsItems = [
  { id: '1', title: 'BTS 成员陆续完成兵役，即将完整体回归', summary: '据韩媒报道，BTS成员将于2025年陆续完成兵役，预计2026年将以完整体形式回归。这次回归将是BTS自2019年以来的首次完整体活动...', content: '据韩媒报道，BTS成员将于2025年陆续完成兵役，预计2026年将以完整体形式回归。这次回归将是BTS自2019年以来的首次完整体活动，引发全球ARMY的热烈讨论。\n\nBTS作为Kpop时代的标志性组合，自2019年暂停团体活动以来，每位成员都专注于个人发展。从唱歌、演戏到个人专辑，成员们在各自领域都取得了优异成绩。\n\n经纪公司Big Hit Music表示，将于2026年正式启动BTS完整体活动，具体细节将在后续公布。这将是BTS成立以来的重要里程碑。\n\n消息一出，#BTS完整体回归#话题迅速登上海外热搜榜首，粉丝们纷纷表示期待已久。', imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop', source: '韩娱新闻', publishDate: '2026-05-13', newsType: 'schedule', tags: ['BTS', '兵役', '回归'] },
  { id: '2', title: 'NewJeans 签约美国唱片公司，进军全球市场', summary: 'NewJeans 宣布与美国知名唱片公司签约，正式启动全球扩张计划。这一举措标志着Kpop女团在国际市场的又一次突破...', content: 'NewJeans 宣布与美国知名唱片公司签约，正式启动全球扩张计划。这一举措标志着Kpop女团在国际市场的又一次突破。\n\nNewJeans作为2022年出道的新生代女团，凭借独特的音乐风格和视觉美学迅速走红。此次签约将使她们获得更广泛的发行渠道和制作资源。\n\n据知情人士透露，新专辑预计将在下半年发布，将融合更多国际化元素。\n\nADOR CEO表示：这是一个重要的里程碑，我们将继续坚持NewJeans独特的音乐风格，同时让更多全球粉丝听到她们的声音。', imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&h=400&fit=crop', source: '音乐周刊', publishDate: '2026-05-12', newsType: 'achievement', tags: ['NewJeans', '美国', '签约'] },
  { id: '3', title: 'IVE 新专辑预告片发布，概念照公开', summary: 'IVE 发布了新专辑《I\'VE MINE》的预告片和概念照，引发粉丝热议。新专辑预计将于6月中旬正式发布...', content: 'IVE 发布了新专辑《I\'VE MINE》的预告片和概念照，引发粉丝热议。新专辑预计将于6月中旬正式发布。\n\n预告片中展现了IVE成员们更加成熟和自信的一面，概念照则采用了大胆的色彩对比和时尚造型。\n\n新专辑将包含多首新歌，其中主打曲已经完成了MV拍摄。据悉，这次的MV将打破IVE以往的制作规模。\n\nStarship Entertainment表示：《I\'VE MINE》将展现IVE成长的蜕变，敬请期待。', imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=400&fit=crop', source: 'KPOP Daily', publishDate: '2026-05-11', newsType: 'comeback', tags: ['IVE', '专辑', '预告'] },
  { id: '4', title: 'Stray Kids 东京巨蛋演唱会门票秒空', summary: 'Stray Kids 东京巨蛋演唱会门票开售即秒空，创下今年最快的票务记录。本次演唱会将于8月在东京巨蛋举行...', content: 'Stray Kids 东京巨蛋演唱会门票开售即秒空，创下今年最快的票务记录。本次演唱会将于8月在东京巨蛋举行。\n\n东京巨蛋是日本最大的室内演出场馆，可容纳约5万人。Stray Kids能够在此举办演唱会，标志着他们已成为Kpop新生代的顶流代表。\n\n门票开售仅3秒钟即告售罄，多个二手平台的价格已经涨到原价的数倍。\n\nJYP Entertainment表示：为满足更多粉丝需求，正在考虑增加场次或加开周边活动。', imageUrl: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=600&h=400&fit=crop', source: '票务网', publishDate: '2026-05-10', newsType: 'event', tags: ['Stray Kids', '演唱会', '东京'] },
  { id: '5', title: 'BLACKPINK 世界巡演收入创纪录', summary: 'BLACKPINK 世界巡演总收入超过10亿美元，成为Kpop艺人中最高的巡演收入记录。这次巡演覆盖了全球50多个城市...', content: 'BLACKPINK 世界巡演总收入超过10亿美元，成为Kpop艺人中最高的巡演收入记录。这次巡演覆盖了全球50多个城市。\n\nBLACKPINK世界巡演自启动以来，每场演出都座无虚席。她们不仅在亚洲市场保持顶流地位，在欧美市场同样掀起热潮。\n\n巡演期间，BLACKPINK还与多个国际品牌达成合作，进一步提升了商业价值。\n\nYG Entertainment表示：BLACKPINK创造了历史，这是对她们努力的最好回报。', imageUrl: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=600&h=400&fit=crop', source: 'Billboard', publishDate: '2026-05-09', newsType: 'achievement', tags: ['BLACKPINK', '巡演', '收入'] },
  { id: '6', title: 'LE SSERAFIM 出演美国音乐节', summary: 'LE SSERAFIM 确认将出演美国最大的音乐节之一，这是她们首次在美国音乐节上表演。此次演出将在下个月举行...', content: 'LE SSERAFIM 确认将出演美国最大的音乐节之一，这是她们首次在美国音乐节上表演。此次演出将在下个月举行。\n\nLE SSERAFIM作为Source Music旗下女团，近年来在国际市场发展迅速。此次出演美国音乐节，将进一步提升她们的全球知名度。\n\n音乐节组织方表示：很高兴邀请到LE SSERAFIM，她们的音乐风格与我们的观众非常契合。\n\nSource Music透露，成员们正在进行高强度的练习，准备为全球粉丝带来一场难忘的表演。', imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop', source: '音乐节官方', publishDate: '2026-05-08', newsType: 'schedule', tags: ['LE SSERAFIM', '美国', '音乐节'] },
]

// Related artists mock data
const relatedArtists = [
  { id: '1', name: 'BTS', imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop', fans: '42.5M' },
  { id: '2', name: 'NewJeans', imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=200&h=200&fit=crop', fans: '28.3M' },
  { id: '3', name: 'BLACKPINK', imageUrl: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=200&h=200&fit=crop', fans: '38.1M' },
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

export default function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  
  const news = newsItems.find(item => item.id === id)

  if (!news) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-white">新闻不存在</h1>
          <Button onClick={() => router.back()} className="mt-6">返回</Button>
        </main>
        <Footer />
      </div>
    )
  }

  // Get related news (excluding current)
  const relatedNews = newsItems.filter(item => item.id !== id).slice(0, 3)

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
            src={news.imageUrl}
            alt={news.title}
            className="h-full w-full object-cover"
          />
          <Badge className={`absolute left-4 top-4 border ${typeColors[news.newsType]}`}>
            {typeLabels[news.newsType]}
          </Badge>
        </div>

        {/* Article Content */}
        <article className="mt-8">
          <h1 className="text-3xl font-bold text-white">{news.title}</h1>
          
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span>{news.source}</span>
            <span>·</span>
            <span>{news.publishDate}</span>
          </div>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {news.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-8 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-6 border border-border/50">
            <p className="text-lg text-muted-foreground">{news.summary}</p>
          </div>

          {/* Main Content */}
          <div className="mt-8 space-y-4 text-muted-foreground leading-relaxed">
            {news.content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>

        {/* Related Artists */}
        <section className="mt-12">
          <h2 className="mb-6 text-xl font-semibold text-white">相关艺人</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {relatedArtists.map((artist) => (
              <Card 
                key={artist.id} 
                className="cursor-pointer overflow-hidden border-border/50 bg-card/50 hover:border-purple-500/50"
                onClick={() => router.push(`/artists/${artist.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={artist.imageUrl}
                      alt={artist.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-white">{artist.name}</h3>
                      <p className="text-sm text-muted-foreground">{artist.fans} 粉丝</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Related News */}
        <section className="mt-12">
          <h2 className="mb-6 text-xl font-semibold text-white">相关新闻</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {relatedNews.map((item) => (
              <Card 
                key={item.id} 
                className="cursor-pointer overflow-hidden border-border/50 bg-card/50 hover:border-purple-500/50"
                onClick={() => router.push(`/news/${item.id}`)}
              >
                <CardContent className="p-4">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="aspect-video w-full rounded-lg object-cover"
                  />
                  <h3 className="mt-3 line-clamp-2 text-sm font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">{item.publishDate}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
