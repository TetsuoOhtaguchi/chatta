/** @jsxImportSource @emotion/react */
import React, { ChangeEvent, MouseEventHandler, useState } from 'react'
// import { css } from '@emotion/react'
import Button from '../ui/button/Button'
import Input from '../ui/input/Input'

// const title = css`
//   color: red;
// `

const Home: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('')
  const [resultValue, setResultValue] = useState<string>('')

  const inputUpdateHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const buttonClickHandler: MouseEventHandler<HTMLButtonElement> = () => {
    setResultValue(inputValue)
  }

  return (
    <>
      <h1>This is the Home component!</h1>
      <Input
        modelValue={inputValue}
        label='label'
        onUpdateModelValue={inputUpdateHandler}
      />
      <Button onClick={buttonClickHandler} child='click' />
      <span>value:{resultValue}</span>
    </>
  )
}

export default Home
