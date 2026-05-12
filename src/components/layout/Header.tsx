'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: '首页' },
  { href: '/events', label: '活动' },
  { href: '/artists', label: '艺人' },
  { href: '/news', label: '新闻' },
  { href: '/map', label: '地图' },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#EC4899]">
            <span className="text-lg font-bold text-white">K</span>
          </div>
          <span className="hidden font-bold text-xl tracking-tight sm:block">
            <span className="text-white">KPOP</span>
            <span className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent"> Global</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative px-4 py-2 text-sm font-medium transition-colors',
                pathname === item.href
                  ? 'text-white'
                  : 'text-muted-foreground hover:text-white'
              )}
            >
              {item.label}
              {pathname === item.href && (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899]" />
              )}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-white">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button className="flex h-9 items-center justify-center rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-4 text-sm font-medium text-white transition-opacity hover:opacity-90">
            AI 快讯
          </button>
        </div>
      </div>
    </header>
  )
}