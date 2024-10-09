'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalendarIcon, RefreshCw } from 'lucide-react'
import { Post } from '@/lib/models/Post'
import { Author } from '@/lib/models/Author'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ObjectId } from 'mongodb'

interface PostWithAuthor extends Omit<Post, 'author'> {
  author: Author
}

interface PostListProps {
  initialPosts: PostWithAuthor[]
}

export default function PostList({ initialPosts }: PostListProps) {
  const [posts, setPosts] = useState<PostWithAuthor[]>(initialPosts)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refreshPosts = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch('/api/posts-with-authors')
      if (!response.ok) throw new Error('Failed to fetch posts')
      const newPosts = await response.json()
      setPosts(newPosts)
    } catch (error) {
      console.error('Error refreshing posts:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post._id.toString()} className="flex flex-col">
            <CardHeader>
              <Image
                src={post.featuredImage.url || `/api/placeholder?width=400&height=200&text=${encodeURIComponent(post.title)}`}
                alt={post.featuredImage.alt}
                width={400}
                height={200}
                className="object-cover w-full h-48 rounded-t-lg"
              />
              <CardTitle className="text-xl mt-4">{post.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">{post.excerpt}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-sm font-medium">{post.author.name}</div>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarIcon className="mr-1 h-4 w-4" />
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </CardFooter>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/blog/${post._id}`}>Ler mais</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}