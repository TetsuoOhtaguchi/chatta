import { Message } from './MessageType'

export interface MessageWithAdditionalInfo extends Message {
  src?: string
  name?: string
}
