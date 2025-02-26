import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  ChangeEvent
} from 'react'

import { useNavigate } from 'react-router-dom'

import { css } from '@emotion/react'

import { auth, functions } from '../../firebase'
import { httpsCallable } from 'firebase/functions'

import { LoginUserContext } from '../../context/auth/LoginUserProvider'
import { UsersContext } from '../../context/users/UsersProvider'
import { MessagesContext } from '../../context/messages/MessagesProvider'

import { handlePostDate } from '../../utils/helpers/handlePostDate'
import { debounce } from '../../utils/helpers/debounce'

import { ExtendedMessage } from '../../types'

import SendMessage from '../ui/sendMessage/SendMessage'
import Spinner from '../ui/modal/Spinner'
import Balloon from '../ui/balloon/Balloon'

const chatsList = css`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 16px;
`

const chatsList__postDate = css`
  display: block;
  margin: 8px auto;
  width: fit-content;
  font-size: 10px;
  background-color: var(--bg-blackRgb);
  color: var(--text-white);
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 50px;
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
  const scrollRef = useRef<HTMLElement>(null)

  const [message, setMessage] = useState<string>('')

  const loginUser = useContext(LoginUserContext)
  const users = useContext(UsersContext)
  const messages = useContext(MessagesContext)

  const [chatmessageList, setChatmessageList] = useState<ExtendedMessage[]>([])

  const [atBottom, setAtBottom] = useState(true)

  const [height, setHeight] = useState<number>(0)
  const chatsListSection = css`
    margin-top: 40px;
    height: calc(100vh - ${height + 40}px);
    overflow-y: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;
    background-color: var(--bg-grey);
    ::-webkit-scrollbar {
      display: none;
    }
  `

  useEffect(() => {
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

    const initMessages = messages?.map(chat => {
      const extendedChat = chat as ExtendedMessage
      users?.find(user => {
        if (user.id === chat.sendUid) {
          extendedChat.chattaName = user.chattaName
          extendedChat.src = user.src
        }
      })
      return chat
    })

    setChatmessageList(initMessages as ExtendedMessage[])

    return () => {
      // timeoutIdRef.currentがnullでない場合
      if (timeoutIdRef.current) {
        // タイムアウト処理をリセットする
        clearTimeout(timeoutIdRef.current)
      }
    }
  }, [loginUser, users, messages])

  useEffect(() => {
    // チャットリストが存在しない場合、処理を終了する
    if (!chatsListRef.current) return

    // チャットリストが存在する場合、最下部へ自動スクロールさせる
    chatsListRef.current.scrollIntoView(false)
  }, [chatmessageList])

  const messageUpdate = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value)
  }

  // モーダルのcloseボタンを押下した際に、以下の処理を実行する
  const modalCloseHandler = async () => {
    if (modalState && loginUser) {
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

        // チャットリストが存在しない場合、処理を終了する
        if (!chatsListRef.current) return

        // チャットリストが存在する場合、最下部へ自動スクロールさせる
        chatsListRef.current.scrollIntoView(false)
      }
    } catch (error) {
      console.error(error)
      setModalState(true)
      setSpinnerState(false)
      setModalSppinerMessage('')
      setModalCompletionMessage('Error!!')
    }
  }

  // スクロール関数
  const handleScroll = () => {
    const scrollElement = scrollRef.current
    if (scrollElement) {
      // スクロール位置が最下部にある場合true、最下部にいない場合falseをセットする
      const isAtBottom =
        scrollElement.scrollTop + scrollElement.clientHeight >=
        scrollElement.scrollHeight
      setAtBottom(isAtBottom)
    }
  }

  useEffect(() => {
    const scrollElement = scrollRef.current
    if (scrollElement) {
      const debouncedHandleScroll = debounce(handleScroll, 100)
      scrollElement.addEventListener('scroll', debouncedHandleScroll)
      return () => {
        scrollElement.removeEventListener('scroll', debouncedHandleScroll)
      }
    }
  }, [])

  const handleHeightChange = (newHeight: number) => {
    // 高さを設定する
    setHeight(newHeight)

    // スクロール位置が最下部にあり、チャットリストが存在する場合
    if (atBottom && chatsListRef.current) {
      // 最下部へ自動スクロールさせる
      chatsListRef.current.scrollIntoView(false)
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

      <section css={chatsListSection} ref={scrollRef}>
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
                  // ログインユーザーではない場合
                  <Balloon message={chatmessage} />
                ) : (
                  // ログインユーザーの場合
                  <Balloon sent message={chatmessage} />
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
        onHeightChange={handleHeightChange}
      />
    </>
  )
}

export default ChatroomPage
