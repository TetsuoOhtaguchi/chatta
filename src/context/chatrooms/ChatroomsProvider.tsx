import { createContext, useState, useContext, useEffect, useRef } from 'react'
import { db } from '../../firebase'
import { collection, query, where } from 'firebase/firestore'
import { LoginUserContext } from '../auth/LoginUserProvider'
import { onSnapshot, orderBy } from 'firebase/firestore'
import { Timestamp } from 'firebase/firestore/lite'
import { Message, MessageWithAdditionalInfo } from '../../types'

interface Chatroom {
  id: string
  createdAt: Timestamp
  messages: MessageWithAdditionalInfo[]
}

export const ChatroomsContext = createContext<Chatroom[] | null>(null)

export const ChatroomsProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [chatrooms, setChatrooms] = useState<Chatroom[] | null>(null)
  const [loadingState, setLoadingState] = useState<boolean>(true)
  const containerRef = useRef<HTMLDivElement>(null)

  const loginUser = useContext(LoginUserContext)

  useEffect(() => {
    if (!loginUser) {
      setChatrooms(null)
      setLoadingState(false)
      return
    }

    const unsubscribeList: (() => void)[] = []

    const fetchChatroomsData = async () => {
      try {
        loginUser.chatroomKeys.forEach(chatroomKey => {
          // チャットルームのデータを取得する
          const chatroomsQuery = query(
            collection(db, 'chatrooms'),
            where('id', '==', chatroomKey)
          )

          const unsubscribeChatrooms = onSnapshot(
            chatroomsQuery,
            chatroomsSnapshot => {
              const chatroomsData = chatroomsSnapshot
                .docChanges()
                .map(chatroomChange => {
                  const chatroomData = chatroomChange.doc.data() as Chatroom

                  // メッセージサブコレクションのデータを取得する
                  const messagesQuery = query(
                    collection(db, 'chatrooms', chatroomData.id, 'messages'),
                    orderBy('createdAt', 'desc')
                  )

                  const unsubscribeMessages = onSnapshot(
                    messagesQuery,
                    messagesSnapshot => {
                      const newMessagesData: MessageWithAdditionalInfo[] = []

                      messagesSnapshot.docChanges().map(messageChange => {
                        if (messageChange.type === 'added') {
                          const messageData =
                            messageChange.doc.data() as Message
                          newMessagesData.push({
                            ...messageData,
                            id: messageChange.doc.id
                          })
                        }
                      })

                      newMessagesData.reverse()

                      if (newMessagesData.length > 0) {
                        setChatrooms(prevChatrooms => {
                          const newChatrooms = prevChatrooms
                            ? [...prevChatrooms]
                            : []
                          const chatroomIndex = newChatrooms.findIndex(
                            room => room.id === chatroomData.id
                          )

                          if (chatroomIndex >= 0) {
                            const existingMessages =
                              newChatrooms[chatroomIndex].messages || []
                            newChatrooms[chatroomIndex] = {
                              ...chatroomData,
                              messages: [
                                ...existingMessages,
                                ...newMessagesData
                              ]
                            }
                          } else {
                            newChatrooms.push({
                              ...chatroomData,
                              messages: newMessagesData
                            })
                          }

                          const uniqueChatrooms = Array.from(
                            new Map(
                              newChatrooms.map(chatroom => [
                                chatroom.id,
                                chatroom
                              ])
                            ).values()
                          )

                          return uniqueChatrooms
                        })
                        setLoadingState(false)
                      }
                    }
                  )

                  unsubscribeList.push(unsubscribeMessages)
                  return {
                    ...chatroomData,
                    unsubscribeMessages
                  }
                })

              setChatrooms(prevChatrooms => {
                const newChatrooms = prevChatrooms
                  ? [...prevChatrooms, ...chatroomsData]
                  : chatroomsData
                const uniqueChatrooms = Array.from(
                  new Map(
                    newChatrooms.map(chatroom => [chatroom.id, chatroom])
                  ).values()
                )
                return uniqueChatrooms
              })
              setLoadingState(false)
            }
          )

          unsubscribeList.push(unsubscribeChatrooms)
        })
      } catch (error) {
        console.error('Error fetching friends data:', error)
        setLoadingState(false)
      }
    }

    fetchChatroomsData()
  }, [loginUser])

  return (
    <ChatroomsContext.Provider value={chatrooms}>
      <div ref={containerRef}>{loadingState ? null : children}</div>
    </ChatroomsContext.Provider>
  )
}
