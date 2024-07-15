import { createContext, useState, useContext, useEffect } from 'react'
import { db } from '../../firebase'
import { collection, query, onSnapshot } from 'firebase/firestore'
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

    const fetchUsersData = async () => {
      try {
        const usersQuery = query(collection(db, 'users'))

        let usersData: User[] = []

        onSnapshot(usersQuery, snapshot => {
          const newUsersData: User[] = []

          snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
              const userData = change.doc.data() as User
              newUsersData.push(userData)
            }
          })

          usersData = [...usersData, ...newUsersData]
          setUsers(usersData)
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
