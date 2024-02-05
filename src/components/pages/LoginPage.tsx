/** @jsxImportSource @emotion/react */
import React, { ChangeEvent, MouseEventHandler, useState } from 'react'
import { Link } from 'react-router-dom'
import { css } from '@emotion/react'
import Button from '../ui/button/Button'
import Input from '../ui/input/Input'
import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth'
import { auth } from '../../firebase'

const title = css`
  color: skyblue;
`

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const emailUpdate = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  const passwordUpdate = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const loginHandler: MouseEventHandler<HTMLButtonElement> = async () => {
    try {
      const credential: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = credential.user

      if (user) {
        alert('Success')
        setEmail('')
        setPassword('')
      }
    } catch (error) {
      alert('Error')
      setEmail('')
      setPassword('')
    }
  }

  return (
    <>
      <h1 css={title}>Login</h1>
      <Input
        modelValue={email}
        label='email'
        onUpdateModelValue={emailUpdate}
      />
      <Input
        modelValue={password}
        label='password'
        onUpdateModelValue={passwordUpdate}
      />
      <Button onClick={loginHandler} child='Login' />
      <Link to={'/signup'}>Signup</Link>
    </>
  )
}

export default LoginPage
