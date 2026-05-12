import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'KPOP Global Platform',
  description: 'AI驱动的全球KPOP实时活动与数据平台',
  keywords: ['KPOP', '韩流', '演唱会', '签售会', '艺人', '韩娱'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" className="dark">
      <body className="min-h-screen bg-black antialiased">
        {children}
      </body>
    </html>
  )
}