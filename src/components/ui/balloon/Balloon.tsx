import React from 'react'
import { css } from '@emotion/react'

import { dateFormater } from '../../../utils/helpers/dateFormater'

import { ExtendedMessage } from '../../../types'

interface BalloonProps {
  sent?: boolean
  message: ExtendedMessage
}

const balloonCommon = css`
  max-width: calc(100vw / 1.5);
  min-width: 46px;
  width: fit-content;
  padding: 8px 16px;
  border-radius: 15px;
  font-size: 14px;
  line-height: 1.5;
`

const balloonLeft__wrapper = css`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: fit-content; ;
`

const balloonLeft__image = css`
  height: 36px;
  width: 36px;
  object-fit: cover;
  border-radius: 50%;
  flex-shrink: 0;
  margin-left: 24px;
`

const balloonLeft__name = css`
  position: absolute;
  z-index: 1;
  font-size: 12px;
  font-weight: 600;
  color: var(--text--black);
  top: 40px;
  left: 32px;
  width: fit-content;
  white-space: nowrap;
`

const balloonLeft__inner__wrapper = css`
  position: relative;
  display: flex;
  gap: 4px;
`

const balloonLeft = css`
  background-color: var(--bg-black);
  color: var(--text-white);

  ::before {
    content: '';
    position: absolute;
    display: block;
    width: 0;
    height: 0;
    border-radius: 50%;
    transform: rotate(45deg);
    left: 18px;
    top: -9px;
    border-left: 9px solid var(--bg-black);
    border-top: 9px solid var(--bg-black);
    border-right: 9px solid transparent;
    border-bottom: 9px solid transparent;
  }

  ::after {
    content: '';
    position: absolute;
    display: block;
    width: 0;
    height: 0;
    border-radius: 50%;
    transform: rotate(45deg);
    left: 26px;
    top: -10px;
    border-left: 10px solid var(--bg-grey);
    border-top: 10px solid var(--bg-grey);
    border-right: 10px solid transparent;
    border-bottom: 10px solid transparent;
  }
`

const balloonLeft__sendTime = css`
  position: absolute;
  bottom: 0;
  right: -34px;
  font-size: 10px;
`

const balloonRight__wrapper = css`
  position: relative;
  display: flex;
  gap: 4px;
  width: fit-content;
  margin-left: auto;
`

const balloonRight__inner__wrapper = css`
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

const balloonRight__sendTime = css`
  font-size: 10px;
`

const balloonRight = css`
  background-color: var(--bg-white);
  color: var(--text-black);

  ::before {
    content: '';
    position: absolute;
    display: block;
    width: 0;
    height: 0;
    border-radius: 50%;
    transform: rotate(225deg);
    right: 8px;
    bottom: -9px;
    border-left: 9px solid var(--bg-white);
    border-top: 9px solid var(--bg-white);
    border-right: 9px solid transparent;
    border-bottom: 9px solid transparent;
  }

  ::after {
    content: '';
    position: absolute;
    display: block;
    width: 0;
    height: 0;
    border-radius: 50%;
    transform: rotate(225deg);
    right: -1px;
    bottom: -10px;
    border-left: 10px solid var(--bg-grey);
    border-top: 10px solid var(--bg-grey);
    border-right: 10px solid transparent;
    border-bottom: 10px solid transparent;
  }
`

// バルーンに改行を加える関数
const newLineFormater = (message: string) => {
  return message.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ))
}

const Balloon: React.FC<BalloonProps> = ({ sent = false, message }) => {
  return (
    <>
      {!sent ? (
        <div css={balloonLeft__wrapper}>
          <img css={balloonLeft__image} src={message.src} alt='user image' />
          <span css={balloonLeft__name}>{message.chattaName}</span>
          <div css={balloonLeft__inner__wrapper}>
            <p css={[balloonCommon, balloonLeft]}>
              {newLineFormater(message.message)}
            </p>
            <time css={balloonLeft__sendTime}>
              {dateFormater(message.createdAt, 'hh/mm')}
            </time>
          </div>
        </div>
      ) : (
        <div css={balloonRight__wrapper}>
          <div css={balloonRight__inner__wrapper}>
            <time css={balloonRight__sendTime}>
              {dateFormater(message.createdAt, 'hh/mm')}
            </time>
          </div>
          <p css={[balloonCommon, balloonRight]}>
            {newLineFormater(message.message)}
          </p>
        </div>
      )}
    </>
  )
}

export default Balloon
