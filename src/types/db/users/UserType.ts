import { Timestamp } from 'firebase/firestore'

export interface User {
  id: string
  chattaName: string
  firstName: string
  lastName: string
  email: string
  src: string
  chatroomKeys: string[]
  createdAt: Timestamp
}
