import React, { ChangeEvent } from 'react'

interface InputProps {
  modelValue: string | number
  onUpdateModelValue: (event: ChangeEvent<HTMLInputElement>) => void
}

const Input: React.FC<InputProps> = ({ modelValue, onUpdateModelValue }) => {
  return <input value={modelValue} onChange={onUpdateModelValue} />
}

export default Input
