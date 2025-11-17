'use client'

// Using regular anchor tag instead of Next.js Link for framework independence
import { Card, CardContent } from '../../components/Card'
import { Badge } from '../../components/Badge'
import { Avatar, AvatarFallback } from '../../ui/avatar'
import { cn } from '../../utils/cn'
import type { BlogCardProps } from '../types'

export function BlogCard({ post, className, showAuthor = true, showReadTime = true }: BlogCardProps) {
  return (
    <a href={`/magazine/${post.slug}`} className="block">
      <Card hover className={cn('group cursor-pointer overflow-hidden', className)}>
        {post.image && (
          <div className="relative aspect-video overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        
        <CardContent className="p-6 space-y-3">
          {post.category && <Badge variant="default">{post.category}</Badge>}
          
          <h3 className="text-white text-xl font-normal leading-tight group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          
          <p className="text-[var(--muted-foreground)] text-sm leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>
          
          {(showAuthor || showReadTime) && (
            <div className="flex items-center justify-between text-sm text-[var(--muted-foreground)] pt-2">
              {showAuthor && post.author && (
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">{post.author[0]}</AvatarFallback>
                  </Avatar>
                  <span>{post.author}</span>
                </div>
              )}
              {showReadTime && post.readTime && <span>{post.readTime}</span>}
            </div>
          )}
        </CardContent>
      </Card>
    </a>
  )
}

BlogCard.displayName = 'BlogCard'
