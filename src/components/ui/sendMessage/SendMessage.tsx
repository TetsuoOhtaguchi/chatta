import React, { ChangeEvent, MouseEventHandler, useRef, useEffect } from 'react'
import { css } from '@emotion/react'
import TextareaAutosize from 'react-textarea-autosize'
import Send from '@mui/icons-material/Send'

interface SendMessageProps {
  modelValue: string | number
  onUpdateModelValue: (event: ChangeEvent<HTMLTextAreaElement>) => void
  onClick: MouseEventHandler<HTMLDivElement>
  onHeightChange: (height: number) => void
}

const sendMessage = css`
  background-color: var(--bg-black);
  position: fixed;
  z-index: 2;
  bottom: 0;
  max-width: 390px;
  width: 100%;
  padding: 8px;
  display: flex;
`

const sendMessage__textarea = css`
  display: block;
  resize: none;
  border: none;
  outline: none;
  width: calc(100vw - 64px);
  border-radius: 4px;
  padding: 10px;
  line-height: 1.5;
  font-size: 14px;
  text-align: justify;
  text-justify: inter-ideograph;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
`

const sendButton = css`
  position: absolute;
  right: 8px;
  bottom: 8px;
  cursor: pointer;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  background-color: var(--bg-white);
  height: 40px;
  width: 40px;
  display: grid;
  place-items: center;
  border-radius: 50%;
`

const sendButton__icon = css`
  width: 24px;
  height: 24px;
`

const SendMessage: React.FC<SendMessageProps> = ({
  modelValue,
  onUpdateModelValue,
  onClick,
  onHeightChange
}) => {
  const sendMessageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (sendMessageRef.current) {
      const observer = new ResizeObserver(entries => {
        for (const entry of entries) {
          if (entry.target === sendMessageRef.current) {
            onHeightChange(entry.contentRect.height + 16)
          }
        }
      })

      observer.observe(sendMessageRef.current)

      return () => {
        observer.disconnect()
      }
    }
  }, [onHeightChange])

  // テキストエリアに値が入力された場合、以下の処理を実行する
  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    // テキストエリアの高さが230pxになった場合、テキストエリアの最下部へ自動スクロールする
    if (event.target.clientHeight === 230) {
      event.target.scrollTop = event.target.scrollHeight
    }

    onUpdateModelValue(event)
  }

  return (
    <div css={sendMessage} ref={sendMessageRef}>
      <TextareaAutosize
        css={sendMessage__textarea}
        value={modelValue}
        onChange={handleTextareaChange}
        placeholder='Enter your message'
        maxRows={10}
      />
      <div css={sendButton} onClick={onClick}>
        <Send css={sendButton__icon} />
      </div>
    </div>
  )
}

export default SendMessage
