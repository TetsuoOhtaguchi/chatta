import { Timestamp } from 'firebase/firestore'

export interface Message {
  id: string
  createdAt: Timestamp
  message: string
  sendUid: string
}

// Message型を拡張する
export interface ExtendedMessage extends Message {
  chattaName?: string
  src?: string
}
