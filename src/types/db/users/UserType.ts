import { Timestamp } from 'firebase/firestore'

export interface User {
  id: string
  name: string
  email: string
  src: string
  chatroomKeys: string[]
  createdAt: Timestamp
}
