import React, { useState, useEffect, useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/auth/AuthProvider'
import { css } from '@emotion/react'
import 'firebase/auth'
import { auth } from '../../firebase'
import Spinner from '../ui/modal/Spinner'

const friendsListSection = css`
  margin-top: 56px;
`

const friendsList = css`
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const friendsList__items = css`
  display: flex;
  gap: 8px;
  align-items: center;
  height: 52px;
  padding: 8px 0;
  cursor: pointer;
  color: var(--text-black);
`

const friendsList__items__image = css`
  width: 40px;
  height: 40px;
  object-fit: cover;
  background-color: var(--bg-grey);
  border-radius: 50px;
`

const friendsList__items__details = css`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  max-width: 240px;
`

const friendsList__items__name = css`
  font-size: 12px;
  font-weight: 600;
  color: var(--text-black);
  white-space: nowrap;
  overflow: hidden;
`

const friendsList__items__message = css`
  word-wrap: break-word;
  overflow: hidden;
  max-height: 2.8em;
  line-height: 1.4;
  text-align: justify;
  text-justify: inter-ideograph;
  font-size: 10px;
  color: var(--text-gray);
`

const friendsList__items__time = css`
  width: 62px;
  font-size: 10px;
  color: var(--text-gray);
`

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

  return (
    <>
      <Spinner
        modalToggle={modalState}
        sppinerToggle={spinnerState}
        modalMessage={modalMessage}
        onClose={modalCloseHandler}
      />

      <section css={friendsListSection}>
        <ul css={friendsList}>
          <li css={friendsList__items}>
            <img src='../noimage.png' alt='' css={friendsList__items__image} />
            <div css={friendsList__items__details}>
              <span css={friendsList__items__name}>
                山田太郎山田太郎山田太郎山田太郎山田太郎山田太郎
              </span>
              <p css={friendsList__items__message}>
                テストテキストテストテキストテストテキストテストテキストテストテキストテストテキスト
              </p>
            </div>
            <time css={friendsList__items__time}>2024/03/21</time>
          </li>

          <li css={friendsList__items}>
            <img src='../noimage.png' alt='' css={friendsList__items__image} />
            <div css={friendsList__items__details}>
              <span css={friendsList__items__name}>山田太郎</span>
              <p css={friendsList__items__message}>
                テストテキストテストテキストテストテキストテストテキストテストテキストテストテキスト
              </p>
            </div>
            <time css={friendsList__items__time}>2024/03/21</time>
          </li>
        </ul>
      </section>
    </>
  )
}

export default FriendsPage
