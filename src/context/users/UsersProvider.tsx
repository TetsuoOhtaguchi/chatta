import { createContext, useState, useContext, useEffect } from 'react'
import { db } from '../../firebase'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { LoginUserContext } from '../auth/LoginUserProvider'
import { User } from '../../types/db/users/UserType'

export const UsersContext = createContext<User[] | null>(null)

export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [users, setUsers] = useState<User[] | null>(null)
  const [loadingState, setLoadingState] = useState<boolean>(true)

  const loginUser = useContext(LoginUserContext)

  useEffect(() => {
    if (!loginUser) {
      setUsers(null)
      setLoadingState(false)
      return
    }

    const unsubscribeList: (() => void)[] = []

    const fetchUsersData = async () => {
      try {
        loginUser.chatroomKeys.forEach(chatroomKey => {
          const usersQuery = query(
            collection(db, 'users'),
            where('chatroomKeys', 'array-contains', chatroomKey),
            where('id', '!=', loginUser.id)
          )

          const unsubscribe = onSnapshot(usersQuery, snapshot => {
            const usersData = snapshot
              .docChanges()
              .map(change => change.doc.data() as User)

            setUsers(prevUsers => {
              const newUsers = prevUsers
                ? [...prevUsers, ...usersData]
                : usersData
              const uniqueUsers = Array.from(
                new Map(newUsers.map(user => [user.id, user])).values()
              )
              return uniqueUsers
            })
            setLoadingState(false)
          })

          unsubscribeList.push(unsubscribe)

          return () => unsubscribe()
        })
      } catch (error) {
        console.error('Error fetching users data:', error)
        setLoadingState(false)
      }
    }

    fetchUsersData()
  }, [loginUser])

  return (
    <UsersContext.Provider value={users}>
      {loadingState ? null : children}
    </UsersContext.Provider>
  )
}
