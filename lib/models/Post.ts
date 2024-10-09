import { ObjectId } from 'mongodb'

export interface Post {
  _id: ObjectId
  title: string
  slug: string
  content: string
  excerpt: string
  featuredImage: {
    url: string
    alt: string
  }
  author: ObjectId
  categories: string[]
  tags: string[]
  createdAt: Date
  updatedAt: Date
  status: 'draft' | 'published'
}