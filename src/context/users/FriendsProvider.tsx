import { createContext, useState, useContext, useEffect } from 'react'
import { db } from '../../firebase'
import {
  collection,
  getDocs,
  Timestamp,
  query,
  where,
  DocumentData,
  orderBy
} from 'firebase/firestore'
import { LoginUserContext } from './LoginUserProvider'

interface User {
  id: string
  name: string
  email: string
  src: string
  friends: string[]
  createdAt: null | Date | Timestamp
  messages: DocumentData[]
}

export const FriendsContext = createContext<User[] | null>(null)

export const FriendsProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [friends, setFriends] = useState<User[] | null>(null)
  const [loadingState, setLoadingState] = useState<boolean>(true)

  const loginUser = useContext(LoginUserContext)

  useEffect(() => {
    if (loginUser) {
      const fetchFriendsData = async () => {
        try {
          const friendsPromises = loginUser.friends.map(async friendId => {
            const friendQuery = query(
              collection(db, 'users'),
              where('id', '==', friendId)
            )
            const friendSnapshot = await getDocs(friendQuery)
            const friendDoc = friendSnapshot.docs.map(doc =>
              doc.data()
            )[0] as User

            // messagesサブコレクションをfriend情報に追加する
            const messagesQuery = query(
              collection(db, 'users', loginUser.id, 'messages'),
              where('friendId', '==', friendDoc.id),
              orderBy('createdAt', 'desc')
            )
            const messageSnapshot = await getDocs(messagesQuery)
            const messageDoc = messageSnapshot.docs.map(doc => doc.data())
            friendDoc.messages = messageDoc

            return friendDoc
          })

          // Promise.allを使って情報取得を並列に行う
          const friendsData = await Promise.all(friendsPromises)

          // 最新のmessage登録日順に並び替える
          friendsData.sort(
            (a, b) => b.messages[0].createdAt - a.messages[0].createdAt
          )

          setFriends(friendsData)
          setLoadingState(false)
        } catch (error) {
          console.error('Error fetching friends data:', error)
          setLoadingState(false)
        }
      }

      fetchFriendsData()
    } else {
      setFriends(null)
      setLoadingState(false)
    }
  }, [loginUser])

  return (
    <FriendsContext.Provider value={friends}>
      {loadingState ? null : children}
    </FriendsContext.Provider>
  )
}
