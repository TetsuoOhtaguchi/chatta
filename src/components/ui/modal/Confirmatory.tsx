import React from 'react'
import { css } from '@emotion/react'
import Button from '../button/Button'

interface ConfirmatoryProps {
  proceedChild: 'Logout'
  modalState: boolean
  message: string
  onCancel: () => void
  onSubmit: () => void
}

const modal = css`
  position: fixed;
  z-index: 10;
  left: 0;
  background: var(--bg-blackRgb);
  width: 100vw;
  height: 100vh;
  display: grid;
  place-items: center;
  padding: 0 16px;
`

const modal__items__wrapper = css`
  display: flex;
  flex-direction: column;
  gap: 32px;
`

const modal__message__text = css`
  color: var(--text-white);
  font-size: 24px;
  font-weight: var(--font-weight);
  text-align: center;
  line-height: 1.5;
`

const modal__buttons__wrapper = css`
  display: flex;
  gap: 16px;
`

const Confirmatory: React.FC<ConfirmatoryProps> = ({
  proceedChild,
  modalState,
  message,
  onCancel,
  onSubmit
}) => {
  return modalState ? (
    <div css={modal}>
      <div css={modal__items__wrapper}>
        <span css={modal__message__text}>{message}</span>
        <div css={modal__buttons__wrapper}>
          <Button onClick={onCancel} child='Cancel' />
          <Button onClick={onSubmit} child={proceedChild} />
        </div>
      </div>
    </div>
  ) : null
}

export default Confirmatory
