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
    const [imgSrc, setImgSrc] = React.useState<string | null>(null)

    React.useEffect(() => {
      // Reset when src changes
      if (src && src.trim() !== '') {
        setImgSrc(src)
      } else {
        setImgSrc(DEFAULT_AVATAR)
      }
    }, [src])

    const handleError = () => {
      setImgSrc(DEFAULT_AVATAR)
    }

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
          className
        )}
        {...props}
      >
        {imgSrc ? (
          <img
            className="aspect-square h-full w-full object-cover"
            src={imgSrc}
            alt={alt || 'Avatar'}
            onError={handleError}
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