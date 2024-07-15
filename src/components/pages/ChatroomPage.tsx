import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  ChangeEvent
} from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { css } from '@emotion/react'
import SendMessage from '../ui/sendMessage/SendMessage'
import { LoginUserContext } from '../../context/auth/LoginUserProvider'
import { UsersContext } from '../../context/users/UsersProvider'
import { MessagesContext } from '../../context/messages/MessagesProvider'
import { auth, functions } from '../../firebase'
import { httpsCallable } from 'firebase/functions'
import Spinner from '../ui/modal/Spinner'
import { dateFormater } from '../../utils/helpers/dateFormater'
import { handlePostDate } from '../../utils/helpers/handlePostDate'
import { ExtendedMessage } from '../../types'

const chatsListSection = css`
  margin-top: 40px;
  height: calc(100vh - 97px);
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
`

const chatsList = css`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background-color: var(--bg-grey);
`

const chatsList__postDate = css`
  display: block;
  margin: 8px auto;
  width: fit-content;
  font-size: 12px;
  background-color: var(--bg-blackRgb);
  color: var(--text-white);
  font-weight: 600;
  padding: 8px;
  border-radius: 50px;
`

const messages__wrapper = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: fit-content;
`

const loginUserMessages__wrapper = css`
  position: relative;
  display: flex;
  gap: 4px;
  width: fit-content;
  margin-left: auto;
`

const userImage = css`
  height: 40px;
  width: 40px;
  object-fit: cover;
  border-radius: 50%;
  flex-shrink: 0;
`

const messages__chatBalloonAndTime__wrapper = css`
  position: relative;
  display: flex;
  gap: 4px;
`

const chatBalloon = css`
  max-width: calc(100vw / 1.5);
  width: fit-content;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.5;
`

const users__chatBalloon = css`
  background-color: var(--bg-black);
  color: var(--text-white);
`

const loginUser__chatBalloon = css`
  background-color: var(--bg-white);
  color: var(--text-black);
`

const loginUserMessages__alreadyReadAndTime__wrapper = css`
  position: absolute;
  bottom: 0;
  left: -34px;
  display: flex;
  flex-direction: column;
  font-size: 10px;
  color: var(--text-black);
  gap: 4px;
  width: fit-content;
  margin-left: auto;
`

const chatTime = css`
  font-size: 10px;
`

const users__chatTime = css`
  position: absolute;
  bottom: 0;
  right: -34px;
`

const ChatroomPage: React.FC = () => {
  const navigate = useNavigate()

  const [modalState, setModalState] = useState<boolean>(true)
  const [spinnerState, setSpinnerState] = useState<boolean>(true)
  const [modalSppinerMessage, setModalSppinerMessage] = useState<string>('')
  const [modalCompletionMessage, setModalCompletionMessage] =
    useState<string>('')

  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null)
  const chatsListRef = useRef<HTMLUListElement>(null)

  const [message, setMessage] = useState<string>('')

  const location = useLocation().search
  const locationQuery = new URLSearchParams(location)
  const chatroomKeyParam = locationQuery.get('key')

  const loginUser = useContext(LoginUserContext)
  const users = useContext(UsersContext)
  const chatrooms = useContext(MessagesContext)

  const [chatmessageList, setChatmessageList] = useState<ExtendedMessage[]>([])

  useEffect(() => {
    if (!loginUser) return

    const loadingState = loginUser ? true : false

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

    const chatlist = chatrooms?.map(chat => {
      const extendedChat = chat as ExtendedMessage
      users?.find(user => {
        if (user.id === chat.sendUid) {
          extendedChat.name = user.name
          extendedChat.src = user.src
        }
      })
      return chat
    })

    setChatmessageList(chatlist as ExtendedMessage[])

    return () => {
      // timeoutIdRef.currentがnullでない場合
      if (timeoutIdRef.current) {
        // タイムアウト処理をリセットする
        clearTimeout(timeoutIdRef.current)
      }
    }
  }, [loginUser, chatroomKeyParam, users, chatrooms])

  useEffect(() => {
    // チャットリストが存在しない場合、即時リターンする
    if (!chatsListRef.current) return

    chatsListRef.current.scrollIntoView(false)
  }, [chatmessageList])

  const messageUpdate = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value)
  }

  // バルーンに改行を加える関数
  const newLineFormater = (message: string) => {
    return message.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ))
  }

  // モーダルのcloseボタンを押下した際に、以下の処理を実行する
  const modalCloseHandler = async () => {
    if (modalState) {
      // 送信処理が失敗した場合、以下の処理を実行する
      setModalState(false)
      setSpinnerState(true)
      setModalSppinerMessage('')
      setModalCompletionMessage('')
    } else {
      // ログインに失敗した場合、以下の処理を実行する
      await auth.signOut()
      navigate('/')
      setModalState(true)
      setSpinnerState(true)
      setModalSppinerMessage('')
      setModalCompletionMessage('')
    }
  }

  // 送信ボタンをクリックした場合、以下の処理を実行する
  const clickSendMessageButton = async () => {
    if (!message) return

    // スピナーモーダルを表示させる
    setModalState(true)

    try {
      // Firebase Cloud Functionsを呼び出す
      const addMessageFunction = httpsCallable(functions, 'addMessage')

      // messagesコレクションにメッセージを保存する
      const addMessageResult = await addMessageFunction({
        createdAt: new Date(),
        message: message,
        sendUid: loginUser?.id
      })

      // メッセージ送信のレスポンスを受け取った場合
      if (addMessageResult.data) {
        // スピナーモーダルを表示させる
        setModalState(false)
        // textareaの値を空白にする
        setMessage('')
        // チャットリストが存在する場合、最下部へ自動スクロールさせる
        if (chatsListRef.current) {
          chatsListRef.current.scrollIntoView(false)
        }
      }
    } catch (error) {
      console.error(error)
      setModalState(true)
      setSpinnerState(false)
      setModalSppinerMessage('')
      setModalCompletionMessage('Error!!')
    }
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

      <section css={chatsListSection}>
        {chatmessageList?.length ? (
          <ul ref={chatsListRef} css={chatsList}>
            {chatmessageList.map((chatmessage, index) => (
              <li key={chatmessage.id}>
                {handlePostDate(chatmessage.createdAt, index) ? (
                  <time css={chatsList__postDate}>
                    {handlePostDate(chatmessage.createdAt, index)}
                  </time>
                ) : null}

                {chatmessage.sendUid !== loginUser?.id ? (
                  <div css={messages__wrapper}>
                    <img
                      css={userImage}
                      src={chatmessage.src}
                      alt='user image'
                    />
                    <div css={messages__chatBalloonAndTime__wrapper}>
                      <p css={[chatBalloon, users__chatBalloon]}>
                        {newLineFormater(chatmessage.message)}
                      </p>
                      <time css={[chatTime, users__chatTime]}>
                        {dateFormater(chatmessage.createdAt, 'hh/mm')}
                      </time>
                    </div>
                  </div>
                ) : (
                  <div css={loginUserMessages__wrapper}>
                    <div css={loginUserMessages__alreadyReadAndTime__wrapper}>
                      <time css={chatTime}>
                        {dateFormater(chatmessage.createdAt, 'hh/mm')}
                      </time>
                    </div>
                    <p css={[chatBalloon, loginUser__chatBalloon]}>
                      {newLineFormater(chatmessage.message)}
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <SendMessage
        modelValue={message}
        onUpdateModelValue={messageUpdate}
        onClick={clickSendMessageButton}
      />
    </>
  )
}

export default ChatroomPage
