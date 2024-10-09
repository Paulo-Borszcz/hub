import { NextResponse } from 'next/server'
import { getPosts, getAuthors } from '@/lib/mongodb'
import { Post } from '@/lib/models/Post'
import { Author } from '@/lib/models/Author'
import { ObjectId } from 'mongodb'

interface PostWithAuthor extends Omit<Post, 'author'> {
  author: Author
}

export async function GET() {
  try {
    const [posts, authors] = await Promise.all([getPosts(), getAuthors()])
    const postsWithAuthors: PostWithAuthor[] = posts.map(post => ({
      ...post,
      author: authors.find(author => author._id.toString() === post.author.toString()) || {
        _id: new ObjectId(),
        name: 'Unknown Author',
        email: '',
        bio: '',
        avatar: ''
      }
    }))
    return NextResponse.json(postsWithAuthors)
  } catch (error) {
    console.error('Failed to fetch posts with authors:', error)
    return NextResponse.json({ error: 'Failed to fetch posts with authors' }, { status: 500 })
  }
}