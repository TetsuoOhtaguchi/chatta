/** @jsxImportSource @emotion/react */
import React, { ChangeEvent, MouseEventHandler, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { css } from '@emotion/react'
import Button from '../ui/button/Button'
import Input from '../ui/input/Input'
import { functions } from '../../firebase'
import { httpsCallable } from 'firebase/functions'

const signupSection = css`
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

const loginLink = css`
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  color: #000;
  cursor: pointer;
  text-align: center;
`

const SignupPage: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const emailUpdate = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  const passwordUpdate = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  // 新規登録処理を実行する
  const signupHandler: MouseEventHandler<HTMLButtonElement> = async event => {
    event.preventDefault()
    try {
      // Firebase Cloud Functionsを呼び出す
      // Authにユーザー情報を登録し、Firestoreにユーザー情報を保存する
      const createUserFunction = httpsCallable(functions, 'createUser')
      const result = await createUserFunction({ email, password })
      const data = result.data as { success: boolean }

      if (data.success) {
        // 新規登録が成功した場合、ログインページにリダイレクト
        navigate('/')
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
    <section css={signupSection}>
      <div css={flexBox}>
        <div css={title}>Signup</div>
        <Input
          modelValue={email}
          label='Email'
          onUpdateModelValue={emailUpdate}
        />
        <Input
          modelValue={password}
          label='Password'
          onUpdateModelValue={passwordUpdate}
        />
        <Button onClick={signupHandler} child='Signup' />
        <Link css={loginLink} to={'/'}>
          Login
        </Link>
      </div>
    </section>
  )
}

export default SignupPage
