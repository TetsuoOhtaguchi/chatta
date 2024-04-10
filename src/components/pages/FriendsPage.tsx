import React, { useState, useEffect, useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FriendsContext } from '../../context/users/FriendsProvider'
import { css } from '@emotion/react'
import { auth } from '../../firebase'
import Spinner from '../ui/modal/Spinner'
import { dateFormater } from '../../utils/helpers/dateFormater'

const friendsListSection = css`
  margin-top: 56px;
`

const friendsList = css`
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const friendsList__list = css`
  /* background-color: yellow; */
  display: flex;
  gap: 8px;
  align-items: center;
  height: 52px;
  padding: 8px 0;
  cursor: pointer;
  color: var(--text-black);
`

const friendsList__image = css`
  width: 40px;
  height: 40px;
  object-fit: cover;
  background-color: var(--bg-grey);
  border-radius: 50px;
  flex-shrink: 0;
`

const friendsList__itemWrapper = css`
  /* background-color: red; */
  display: flex;
  align-items: center;
  width: 100%;
  gap: 8px;
`

const friendsList__nameAndMessage__container = css`
  /* background-color: skyblue; */
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  max-width: 240px;
`

const friendsList__name = css`
  font-size: 12px;
  font-weight: 600;
  color: var(--text-black);
  white-space: nowrap;
  overflow: hidden;
`

const friendsList__message = css`
  word-wrap: break-word;
  overflow: hidden;
  max-height: 2.8em;
  line-height: 1.4;
  text-align: justify;
  text-justify: inter-ideograph;
  font-size: 10px;
  color: var(--text-gray);
`

const friendsList__messageTime = css`
  width: 62px;
  font-size: 10px;
  color: var(--text-gray);
  text-align: right;
`

const FriendsPage: React.FC = () => {
  const navigate = useNavigate()
  const friends = useContext(FriendsContext)

  const [modalState, setModalState] = useState<boolean>(true)
  const [spinnerState, setSpinnerState] = useState<boolean>(true)
  const [modalSppinerMessage, setModalSppinerMessage] = useState<string>('')
  const [modalCompletionMessage, setModalCompletionMessage] =
    useState<string>('')

  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // 読み込みステート
    const loadingState = friends ? true : false

    // 読み込み中の場合、スピナーモーダルを表示させる
    setModalState(loadingState ? false : true)
    setModalSppinerMessage(loadingState ? '' : 'Loading')

    timeoutIdRef.current = setTimeout(() => {
      // 10秒経過後、ログインステータスがfalseの場合エラー表示する
      if (!loadingState) {
        setSpinnerState(false)
        setModalSppinerMessage('')
        setModalCompletionMessage('Error!!')
      }
    }, 10000)

    return () => {
      // timeoutIdRef.currentがnullでない場合
      if (timeoutIdRef.current) {
        // タイムアウト処理をリセットする
        clearTimeout(timeoutIdRef.current)
      }
    }
  }, [friends])

  // モーダルのcloseボタンを押下した際に、以下の処理を実行する
  const modalCloseHandler = async () => {
    await auth.signOut()
    navigate('/')
    setModalState(true)
    setSpinnerState(true)
    setModalSppinerMessage('')
    setModalCompletionMessage('')
  }

  return (
    <>
      <Spinner
        modalToggle={modalState}
        sppinerToggle={spinnerState}
        modalSppinerMessage={modalSppinerMessage}
        modalCompletionMessage={modalCompletionMessage}
        onClose={modalCloseHandler}
      />

      <section css={friendsListSection}>
        {friends?.length ? (
          <ul css={friendsList}>
            {friends.map(friend => (
              <li key={friend.id} css={friendsList__list}>
                <img src={friend.src} alt='' css={friendsList__image} />

                {friend.messages[0].message ? (
                  <div css={friendsList__itemWrapper}>
                    <div css={friendsList__nameAndMessage__container}>
                      <span css={friendsList__name}>{friend.name}</span>
                      <p css={friendsList__message}>
                        {friend.messages[0].message}
                      </p>
                    </div>
                    <time css={friendsList__messageTime}>
                      {dateFormater(friend.messages[0].createdAt)}
                    </time>
                  </div>
                ) : (
                  <p css={friendsList__message}>No message</p>
                )}
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </>
  )
}

export default FriendsPage
