/** @jsxImportSource @emotion/react */
import React, { ChangeEvent } from 'react'
import { css } from '@emotion/react'

interface InputProps {
  modelValue: string | number
  type:
    | 'text'
    | 'password'
    | 'checkbox'
    | 'radio'
    | 'submit'
    | 'reset'
    | 'button'
    | 'file'
    | 'hidden'
    | 'date'
    | 'email'
    | 'number'
    | 'tel'
    | 'url'
    | 'search'
  label: string
  onUpdateModelValue: (event: ChangeEvent<HTMLInputElement>) => void
}

const inputWrapper = css`
  display: flex;
  flex-direction: column;
`

const labelStyle = css`
  font-size: 14px;
  font-weight: 600;
`

const input = css`
  margin: 0;
  padding: 0 8px;
  background: none;
  border: none;
  border-radius: 0;
  outline: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-bottom: solid 1px;
  height: 36px;
`

const Input: React.FC<InputProps> = ({
  modelValue,
  type,
  label,
  onUpdateModelValue
}) => {
  return (
    <div css={inputWrapper}>
      <label css={labelStyle} htmlFor={label}>
        {label}
      </label>
      <input
        css={input}
        type={type}
        id={label}
        value={modelValue}
        onChange={onUpdateModelValue}
        autoComplete='off'
      />
    </div>
  )
}

export default Input
