import React, { MouseEventHandler } from 'react'

interface ButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>
  child: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({ onClick, child }) => {
  return <button onClick={onClick}>{child}</button>
}

export default Button
