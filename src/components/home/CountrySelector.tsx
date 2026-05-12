'use client'

import { Button } from '@/components/ui/button'

const countries = [
  { code: 'KR', name: '韩国', flag: '🇰🇷', count: 156 },
  { code: 'CN', name: '中国', flag: '🇨🇳', count: 89 },
  { code: 'US', name: '美国', flag: '🇺🇸', count: 67 },
  { code: 'JP', name: '日本', flag: '🇯🇵', count: 54 },
  { code: 'SG', name: '新加坡', flag: '🇸🇬', count: 28 },
  { code: 'TH', name: '泰国', flag: '🇹🇭', count: 21 },
]

export function CountrySelector() {
  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">🌏 全球活动</h2>
          <span className="text-sm text-muted-foreground">选择国家/地区</span>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {countries.map((country) => (
            <Button
              key={country.code}
              variant="outline"
              className="h-auto flex-col gap-2 border-border/50 bg-card/50 py-4 hover:border-purple-500/50 hover:bg-card"
            >
              <span className="text-2xl">{country.flag}</span>
              <span className="text-xs font-medium text-white">{country.name}</span>
              <span className="text-xs text-muted-foreground">{country.count} 场</span>
            </Button>
          ))}
        </div>
      </div>
    </section>
  )
}