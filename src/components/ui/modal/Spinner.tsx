import React from 'react'
import { css } from '@emotion/react'
import Button from '../button/Button'

interface SpinnerProps {
  modalToggle: boolean
  sppinerToggle?: boolean
  modalMessage: string
  onClose: () => void
}

const modal = css`
  position: fixed;
  left: 0;
  background: var(--bg-blackRgb);
  width: 100vw;
  height: 100vh;
  display: grid;
  place-items: center;
`

const modal__spinner = css`
  width: 32px;
  height: 32px;
  margin: 10px auto;
  border: 4px var(--border-black) solid;
  border-top: 4px var(--border-white) solid;
  border-radius: 50%;
  animation: sp-anime 1s infinite linear;

  @keyframes sp-anime {
    100% {
      transform: rotate(360deg);
    }
  }
`

const modal__completion = css`
  display: flex;
  flex-direction: column;
  gap: 48px;
`

const modal__message__text = css`
  color: var(--text-white);
  font-size: 24px;
  font-weight: var(--font-weight);
  text-align: center;
`

const Spinner: React.FC<SpinnerProps> = ({
  modalToggle,
  sppinerToggle = true,
  modalMessage,
  onClose
}) => {
  return modalToggle ? (
    <div css={modal}>
      {sppinerToggle ? (
        <div css={modal__spinner} />
      ) : (
        <div css={modal__completion}>
          <span css={modal__message__text}>
            {modalMessage ? modalMessage : 'Error!!'}
          </span>
          <Button modal onClick={onClose} child='Close' />
        </div>
      )}
    </div>
  ) : null
}

export default Spinner
