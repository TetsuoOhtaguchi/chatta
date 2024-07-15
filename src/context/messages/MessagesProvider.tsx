import { createContext, useState, useContext, useEffect, useRef } from 'react'
import { db } from '../../firebase'
import { collection, query, orderBy } from 'firebase/firestore'
import { LoginUserContext } from '../auth/LoginUserProvider'
import { onSnapshot } from 'firebase/firestore'
import { Message } from '../../types'

export const MessagesContext = createContext<Message[] | null>(null)

export const MessagesProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [loadingState, setLoadingState] = useState<boolean>(true)
  const containerRef = useRef<HTMLDivElement>(null)

  const loginUser = useContext(LoginUserContext)

  const [messages, setMessages] = useState<Message[] | null>(null)

  useEffect(() => {
    if (!loginUser) {
      setMessages(null)
      setLoadingState(false)
      return
    }

    const fetchMessagesData = async () => {
      try {
        const messagesQuery = query(
          collection(db, 'messages'),
          orderBy('createdAt', 'asc')
        )

        let messagesData: Message[] = []

        onSnapshot(messagesQuery, messagesSnapshot => {
          const newMessagesData: Message[] = []

          messagesSnapshot.docChanges().forEach(messageChange => {
            if (messageChange.type === 'added') {
              const messageData = messageChange.doc.data() as Message
              newMessagesData.push(messageData)
            }
          })

          messagesData = [...messagesData, ...newMessagesData]
          setMessages(messagesData)
        })
      } catch (error) {
        console.error('Error fetching messages data:', error)
        setLoadingState(false)
      }
    }

    fetchMessagesData()
  }, [loginUser])

  return (
    <MessagesContext.Provider value={messages}>
      <div ref={containerRef}>{loadingState ? null : children}</div>
    </MessagesContext.Provider>
  )
}
