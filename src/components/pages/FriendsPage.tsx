/** @jsxImportSource @emotion/react */
import React, {
  MouseEventHandler,
  useState,
  useEffect,
  useContext,
  useRef
} from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/auth/AuthProvider'
// import { css } from '@emotion/react'
import 'firebase/auth'
import { auth } from '../../firebase'
import Spinner from '../ui/modal/Spinner'

const FriendsPage: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser } = useContext(AuthContext)

  const [modalState, setModalState] = useState<boolean>(true)
  const [spinnerState, setSpinnerState] = useState<boolean>(true)
  const [modalMessage, setModalMessage] = useState<string>('')

  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // ログインしている場合: true / ログインしていない場合: false
    const loginState = currentUser ? true : false

    setModalState(loginState ? false : true)

    timeoutIdRef.current = setTimeout(() => {
      // 10秒経過後、ログインステータスがfalseの場合エラー表示する
      if (!loginState) {
        setSpinnerState(false)
        setModalMessage('Error!!')
      }
    }, 10000)

    return () => {
      // timeoutIdRef.currentがnullでない場合
      if (timeoutIdRef.current) {
        // タイムアウト処理をリセットする
        clearTimeout(timeoutIdRef.current)
      }
    }
  }, [currentUser])

  // モーダルのcloseボタンを押下した際に、以下の処理を実行する
  const modalCloseHandler = async () => {
    await auth.signOut()
    navigate('/')
    setModalState(true)
    setSpinnerState(true)
    setModalMessage('')
  }

  const handleLogout: MouseEventHandler<HTMLButtonElement> = async event => {
    event.preventDefault()

    try {
      await auth.signOut()
      navigate('/')
      console.log('ログアウトしました')
    } catch (error) {
      console.error('ログアウトに失敗しました', error)
    }
  }

  return (
    <>
      <Spinner
        modalToggle={modalState}
        sppinerToggle={spinnerState}
        modalMessage={modalMessage}
        onClose={modalCloseHandler}
      />

      <button onClick={handleLogout}>logout</button>
    </>
  )
}

export default FriendsPage
