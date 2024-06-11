import { User } from './UserType'
import { Timestamp } from 'firebase/firestore'

export interface UserWithAdditionalInfo extends User {
  chatroomKey?: string
  latestMessage?: string
  latestMessageCreatedAt?: Timestamp
  alreadyReadFalseNumber?: number
}
