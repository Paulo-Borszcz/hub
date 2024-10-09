import { getPostById, getAuthorById } from '@/lib/mongodb'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarIcon, UserIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import React from 'react'

export async function generateMetadata({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id)
  if (!post) return { title: 'Post não encontrado' }
  return { title: post.title }
}

export default async function BlogPost({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id)
  if (!post) notFound()

  const author = await getAuthorById(post.author.toString())
  if (!author) notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="overflow-hidden">
        <div className="relative w-full bg-black" style={{ height: '500px' }}>
          <Image
            src={post.featuredImage.url || `/api/placeholder?width=800&height=400&text=${encodeURIComponent(post.title)}`}
            alt={post.featuredImage.alt}
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
        <CardHeader>
          <CardTitle className="text-3xl mt-4 mb-2">{post.title}</CardTitle>
          <hr/>
          <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
            <div className="flex items-center my-3 space-x-2">
              <Avatar>
                <AvatarImage src={author.avatar} alt={author.name} />
                <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="font-medium">{author.name}</div>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="mr-1 h-4 w-4" />
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
        </CardContent>
      </Card>
    </div>
  )
}