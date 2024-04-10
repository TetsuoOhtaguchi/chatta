import { createContext, useEffect, useState } from 'react'
import { auth, db } from '../../firebase'
import {
  collection,
  getDocs,
  query,
  Timestamp,
  where
} from 'firebase/firestore'

interface User {
  id: string
  name: string
  email: string
  src: string
  friends: string[]
  createdAt: null | Date | Timestamp
}

export const LoginUserContext = createContext<User | undefined>(undefined)

export const LoginUserProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [loginUser, setLoginUser] = useState<User | undefined>()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async authUser => {
      if (authUser) {
        // ログインユーザーの情報をusersコレクションから取得
        const loginUserQuery = query(
          collection(db, 'users'),
          where('id', '==', authUser.uid)
        )
        getDocs(loginUserQuery).then(querySnapshot => {
          setLoginUser(querySnapshot.docs.map(doc => doc.data())[0] as User)
        })
      } else {
        setLoginUser(undefined)
      }
    })

    return unsubscribe
  }, [])

  return (
    <LoginUserContext.Provider value={loginUser}>
      {children}
    </LoginUserContext.Provider>
  )
}
