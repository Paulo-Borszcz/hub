import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb'
import { Post } from './models/Post'
import { Author } from './models/Author'

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export async function getPosts(): Promise<Post[]> {
  const client = await clientPromise
  const collection = client.db('blog').collection<Post>('posts')
  return collection.find({}).sort({ createdAt: -1 }).toArray()
}

export async function getPostById(id: string): Promise<Post | null> {
  const client = await clientPromise
  const collection = client.db('blog').collection<Post>('posts')
  return collection.findOne({ _id: new ObjectId(id) })
}

export async function getAuthors(): Promise<Author[]> {
  const client = await clientPromise
  const collection = client.db('blog').collection<Author>('authors')
  return collection.find({}).toArray()
}

export async function getAuthorById(id: string): Promise<Author | null> {
  const client = await clientPromise
  const collection = client.db('blog').collection<Author>('authors')
  return collection.findOne({ _id: new ObjectId(id) })
}

export { clientPromise }