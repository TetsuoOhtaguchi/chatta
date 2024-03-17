import React, { ChangeEvent, useState } from 'react'
import { css } from '@emotion/react'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

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
  error: boolean
  icon: string
  onUpdateModelValue: (event: ChangeEvent<HTMLInputElement>) => void
}

const inputWrapper = css`
  display: flex;
  flex-direction: column;
  position: relative;
`

const labelStyle = css`
  font-size: 14px;
  font-weight: var(--font-weight);
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

const errorInput = css`
  background-color: var(--bg-error);
`

const iconInput = css`
  padding-right: 40px;
`

const iconStyle = css`
  position: absolute;
  bottom: 4px;
  right: 8px;
  cursor: pointer;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
`

const Input: React.FC<InputProps> = ({
  modelValue,
  type,
  label,
  error,
  icon,
  onUpdateModelValue
}) => {
  const [inputType, setInputType] = useState(type)
  const [passwordIconState, setPasswordIconState] = useState(true)

  // iconをクリックした場合、下記の処理を実行する
  const clickPasswordHandler = (icon: string) => {
    if (icon === 'password') {
      setInputType(passwordIconState ? 'text' : 'password')
      setPasswordIconState(!passwordIconState)
    }
  }

  return (
    <div css={inputWrapper}>
      <label css={labelStyle} htmlFor={label}>
        {label}
      </label>
      <input
        css={[input, error && errorInput, icon && iconInput]}
        type={inputType}
        id={label}
        value={modelValue}
        onChange={onUpdateModelValue}
        autoComplete='off'
      />
      {icon ? (
        <div css={iconStyle} onClick={() => clickPasswordHandler('password')}>
          {passwordIconState ? <VisibilityOff /> : <Visibility />}
        </div>
      ) : null}
    </div>
  )
}

export default Input
