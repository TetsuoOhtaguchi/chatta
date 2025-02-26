import React, { MouseEventHandler } from 'react'
import { css } from '@emotion/react'

const button = css`
  padding: 0;
  outline: none;
  font: inherit;
  color: inherit;
  background-color: var(--bg-white);
  cursor: pointer;
  border: solid 1px var(--border-black);
  width: 100%;
  height: 36px;
  font-size: 14px;
  font-weight: var(--font-weight);
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
`

const modalButton = css`
  background-color: var(--bg-black);
  color: var(--text-white);
  max-width: 390px;
  width: calc(100vw - 32px);
  border: solid 1px var(--border-white);
`

interface ButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>
  child: React.ReactNode
  modal?: boolean
}

const Button: React.FC<ButtonProps> = ({ onClick, child, modal = false }) => {
  return (
    <button css={[button, modal ? modalButton : null]} onClick={onClick}>
      {child}
    </button>
  )
}

export default Button
