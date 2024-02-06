/** @jsxImportSource @emotion/react */
import React, { MouseEventHandler } from 'react'
import { css } from '@emotion/react'

const button = css`
  padding: 0;
  outline: none;
  font: inherit;
  color: inherit;
  background: none;
  cursor: pointer;
  border: solid 1px;
  width: 100%;
  height: 36px;
  font-size: 14px;
  font-weight: 600;
`

interface ButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>
  child: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({ onClick, child }) => {
  return (
    <button css={button} onClick={onClick}>
      {child}
    </button>
  )
}

export default Button
