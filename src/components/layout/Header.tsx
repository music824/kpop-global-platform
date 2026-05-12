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
    <header className="sticky top-0 z-50 w-full border-b border-purple-500/20 bg-black/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo - More prominent */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30 transition-transform duration-300 group-hover:scale-110">
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 blur-md opacity-50" />
            <span className="relative text-xl font-black text-white">K</span>
          </div>
          <span className="font-black text-xl tracking-tight">
            <span className="text-white">🔥 KPOP GLOBAL 2026</span>
          </span>
        </Link>

        {/* Navigation - Better spacing with glow effects */}
        <nav className="flex items-center gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group relative px-5 py-2.5 text-sm font-semibold transition-all duration-300',
                pathname === item.href
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              {/* Hover glow background */}
              <span className={cn(
                "absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 transition-opacity duration-300",
                pathname === item.href ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              )} />
              
              <span className="relative">
                {item.label}
              </span>

              {/* Active underline with glow */}
              {pathname === item.href && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 shadow-lg shadow-pink-500/50" />
              )}
              
              {/* Subtle hover underline */}
              {pathname !== item.href && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 scale-x-0 rounded-full bg-gradient-to-r from-purple-500/50 to-pink-500/50 transition-transform duration-300 group-hover:scale-x-100" />
              )}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 text-gray-400 transition-all duration-300 hover:border-purple-500/60 hover:bg-purple-500/20 hover:text-white hover:shadow-lg hover:shadow-purple-500/20">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button className="group relative flex h-10 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-[length:200%_100%] px-6 text-sm font-bold text-white shadow-lg shadow-pink-500/30 transition-all duration-500 hover:bg-[position:100%_0] hover:shadow-pink-500/50 hover:shadow-2xl">
            <span className="relative">AI 快讯</span>
            {/* Shimmer effect */}
            <span className="absolute inset-0 overflow-hidden rounded-xl">
              <span className="absolute -left-full top-0 h-full w-1/2 bg-gradient-to-r from-transparent to-white/20 skew-x-[-20deg] animate-[shimmer_2s_infinite]" />
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}