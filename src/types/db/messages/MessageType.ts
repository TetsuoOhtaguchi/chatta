import { Timestamp } from 'firebase/firestore'

export interface Message {
  id: string
  sendUid: string
  message: string
  createdAt: Timestamp
  alreadyRead: boolean
}
