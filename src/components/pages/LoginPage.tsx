/** @jsxImportSource @emotion/react */
import React, { ChangeEvent, MouseEventHandler, useState } from 'react'
import { Link } from 'react-router-dom'
import { css } from '@emotion/react'
import Button from '../ui/button/Button'
import Input from '../ui/input/Input'
import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth'
import { auth } from '../../firebase'

const loginSection = css`
  display: grid;
  place-items: center;
  height: 100vh;
`

const flexBox = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 40px;
`

const title = css`
  font-size: 36px;
  font-weight: 600;
`

const signupLink = css`
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  color: #000;
  cursor: pointer;
  text-align: center;
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
    <section css={loginSection}>
      <div css={flexBox}>
        <div css={title}>Login</div>
        <Input
          modelValue={email}
          type='text'
          label='Email'
          onUpdateModelValue={emailUpdate}
        />
        <Input
          modelValue={password}
          type='password'
          label='Password'
          onUpdateModelValue={passwordUpdate}
        />
        <Button onClick={loginHandler} child='Login' />
        <Link css={signupLink} to={'/signup'}>
          Signup
        </Link>
      </div>
    </section>
  )
}

export default LoginPage
