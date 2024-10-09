import { Post } from './models/Post'
import { Author } from './models/Author'

export async function fetchPosts(): Promise<Post[]> {
  const response = await fetch('/api/posts', { next: { revalidate: 0 } })
  if (!response.ok) throw new Error('Failed to fetch posts')
  return response.json()
}

export async function fetchAuthors(): Promise<Author[]> {
  const response = await fetch('/api/authors', { next: { revalidate: 0 } })
  if (!response.ok) throw new Error('Failed to fetch authors')
  return response.json()
}