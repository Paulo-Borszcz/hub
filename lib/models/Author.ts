import { ObjectId } from 'mongodb'

export interface Author {
  _id: ObjectId
  name: string
  email: string
  bio: string
  avatar: string
}