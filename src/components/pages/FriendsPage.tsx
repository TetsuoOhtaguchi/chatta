import React, { useState, useEffect, useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginUserContext } from '../../context/auth/LoginUserProvider'
import { UsersContext } from '../../context/users/UsersProvider'
import { ChatroomsContext } from '../../context/chatrooms/ChatroomsProvider'
import { css } from '@emotion/react'
import { auth } from '../../firebase'
import Spinner from '../ui/modal/Spinner'
import { dateFormater } from '../../utils/helpers/dateFormater'
import { UserWithAdditionalInfo } from '../../types/db/users/ExtendedUserType'

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
  display: flex;
  gap: 8px;
  align-items: center;
  height: 52px;
  padding: 8px 0;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
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
  display: flex;
  align-items: center;
  width: 100%;
  gap: 8px;
`

const friendsList__nameAndMessage__container = css`
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

const friendsList__messageBadge = css`
  display: grid;
  place-items: center;
  width: 16px;
  height: 16px;
  font-size: 10px;
  background-color: var(--bg-black);
  border-radius: 50%;
  margin: 4px 0 0 4px;
  font-weight: 600;
  color: var(--text-white);
`

const FriendsPage: React.FC = () => {
  const navigate = useNavigate()

  const loginUser = useContext(LoginUserContext)
  const users = useContext(UsersContext)
  const chatrooms = useContext(ChatroomsContext)

  const [friendList, setfriendList] = useState<UserWithAdditionalInfo[]>([])

  const [modalState, setModalState] = useState<boolean>(true)
  const [spinnerState, setSpinnerState] = useState<boolean>(true)
  const [modalSppinerMessage, setModalSppinerMessage] = useState<string>('')
  const [modalCompletionMessage, setModalCompletionMessage] =
    useState<string>('')

  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!users) return

    // 読み込みステート
    const loadingState = users ? true : false

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

    const newUsers = users
      .map(user => {
        const updatedUser: UserWithAdditionalInfo = {
          ...user,
          chatroomKey: '',
          latestMessage: '',
          latestMessageCreatedAt: undefined,
          alreadyReadFalseNumber: 0
        }

        updatedUser.chatroomKeys.forEach((chatroomKey: string) => {
          const chatroom = chatrooms?.find(
            chatroom => chatroomKey === chatroom.id
          )
          if (chatroom && chatroom.messages && chatroom.messages.length > 0) {
            const latestMessage = chatroom.messages[0].message
            const latestMessageCreatedAt = chatroom.messages[0].createdAt
            const alreadyReadFalseNumber = chatroom.messages.filter(message => {
              if (message.sendUid !== loginUser?.id && !message.alreadyRead) {
                return message
              }
            }).length

            updatedUser.chatroomKey = chatroomKey
            updatedUser.latestMessage = latestMessage
            updatedUser.latestMessageCreatedAt = latestMessageCreatedAt
            updatedUser.alreadyReadFalseNumber = alreadyReadFalseNumber
          }
        })
        return updatedUser
      })
      .sort(
        (a, b) =>
          Number(b.latestMessageCreatedAt) - Number(a.latestMessageCreatedAt)
      )
    setfriendList(newUsers)

    return () => {
      // timeoutIdRef.currentがnullでない場合
      if (timeoutIdRef.current) {
        // タイムアウト処理をリセットする
        clearTimeout(timeoutIdRef.current)
      }
    }
  }, [loginUser, users, chatrooms])

  // モーダルのcloseボタンを押下した際に、以下の処理を実行する
  const modalCloseHandler = async () => {
    await auth.signOut()
    navigate('/')
    setModalState(true)
    setSpinnerState(true)
    setModalSppinerMessage('')
    setModalCompletionMessage('')
  }

  // チャットルームへページ遷移する
  const chatroomNavigationHandler = (
    chatroomKey: string | undefined,
    friendName: string
  ) => {
    if (!chatroomKey) return
    navigate(
      `/chatroom?key=${chatroomKey}&friend=${encodeURIComponent(friendName)}`
    )
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
        {friendList?.length ? (
          <ul css={friendsList}>
            {friendList.map(friend => (
              <li
                key={friend.id}
                css={friendsList__list}
                onClick={() =>
                  chatroomNavigationHandler(friend.chatroomKey, friend.name)
                }
              >
                <img src={friend.src} alt='' css={friendsList__image} />

                {friend.latestMessage ? (
                  <div css={friendsList__itemWrapper}>
                    <div css={friendsList__nameAndMessage__container}>
                      <span css={friendsList__name}>{friend.name}</span>
                      <p css={friendsList__message}>{friend.latestMessage}</p>
                    </div>
                    <div>
                      <time css={friendsList__messageTime}>
                        {dateFormater(
                          friend.latestMessageCreatedAt,
                          'yyyy/mm/dd'
                        )}
                      </time>
                      {friend.alreadyReadFalseNumber! > 0 ? (
                        <span css={friendsList__messageBadge}>
                          {friend.alreadyReadFalseNumber}
                        </span>
                      ) : null}
                    </div>
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
