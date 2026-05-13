import * as React from 'react'
import { cn } from '@/lib/utils'

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: string
}

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400'

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, ...props }, ref) => {
    const [hasError, setHasError] = React.useState(false)

    // Check if src is valid (not empty, not just whitespace)
    const validSrc = src && src.trim() !== '' ? src : null

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
          className
        )}
        {...props}
      >
        {validSrc && !hasError ? (
          <img
            className="aspect-square h-full w-full object-cover"
            src={validSrc}
            alt={alt || 'Avatar'}
            onError={() => setHasError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] text-white font-semibold text-sm">
            {fallback || '?'}
          </div>
        )}
      </div>
    )
  }
)
Avatar.displayName = 'Avatar'

export { Avatar }