/** @jsxImportSource @emotion/react */
import React, { ChangeEvent } from 'react'
import { css } from '@emotion/react'

interface InputProps {
  modelValue: string | number
  label: string
  onUpdateModelValue: (event: ChangeEvent<HTMLInputElement>) => void
}

const inputWrapper = css`
  display: flex;
  flex-direction: column;
`

const Input: React.FC<InputProps> = ({
  modelValue,
  label,
  onUpdateModelValue
}) => {
  return (
    <div css={inputWrapper}>
      <label htmlFor={label}>{label}</label>
      <input id={label} value={modelValue} onChange={onUpdateModelValue} />
    </div>
  )
}

export default Input
