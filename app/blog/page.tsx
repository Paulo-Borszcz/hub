import { Suspense } from 'react'
import { getPosts, getAuthors } from '@/lib/mongodb'
import PostList from '@/components/blog/PostList'
import { Post } from '@/lib/models/Post'
import { Author } from '@/lib/models/Author'
import { ObjectId } from 'mongodb'

export const metadata = {
  title: 'Blog',
  description: 'Leia nossos últimos posts',
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PostWithAuthor extends Omit<Post, 'author'> {
  author: Author
}

async function getPostsWithAuthors(): Promise<PostWithAuthor[]> {
  const [posts, authors] = await Promise.all([getPosts(), getAuthors()])
  return posts.map(post => ({
    ...post,
    author: authors.find(author => author._id.toString() === post.author.toString()) || {
      _id: new ObjectId(),
      name: 'Unknown Author',
      email: '',
      bio: '',
      avatar: ''
    }
  }))
}

export default async function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <Suspense fallback={<div>Carregando posts...</div>}>
        <PostListWrapper />
      </Suspense>
    </div>
  )
}

async function PostListWrapper() {
  const postsWithAuthors = await getPostsWithAuthors()
  return <PostList initialPosts={postsWithAuthors} />
}