/** @jsxImportSource @emotion/react */
import React, { ChangeEvent, MouseEventHandler, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { css } from '@emotion/react'
import { validationCheck } from '../../utils/helpers/validation'
import Button from '../ui/button/Button'
import Input from '../ui/input/Input'
import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth'
import { auth, db } from '../../firebase'
import { getDoc, doc } from 'firebase/firestore'

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

const signupLink = css`
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  color: #000;
  cursor: pointer;
  text-align: center;
`

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const [emailError, setEmailError] = useState<boolean>(false)
  const [passwordError, setPasswordError] = useState<boolean>(false)

  const emailUpdate = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  const passwordUpdate = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const loginHandler: MouseEventHandler<HTMLButtonElement> = async event => {
    event.preventDefault()

    setEmailError(validationCheck(email, null, 'email'))
    setPasswordError(validationCheck(password, null, 'password'))
    const emailErrorCheck = validationCheck(email, null, 'email')
    const passwordErrorCheck = validationCheck(password, null, 'password')

    if (emailErrorCheck || passwordErrorCheck) return

    try {
      const credential: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = credential.user

      if (user) {
        setEmail('')
        setPassword('')

        // usersコレクションからログインユーザーの情報を取得する
        const docRef = doc(db, 'users', user.uid)
        const docSnap = await getDoc(docRef)
        const userData = docSnap.data()!
        if (!userData.name) {
          // usersコレクションに名前が登録されてない場合、アカウントページへ遷移する
          navigate('/account')
        } else {
          // usersコレクションに名前が登録されている場合、フレンズページへ遷移する
          navigate('/friends')
        }
      }
    } catch (error) {
      alert('Error')
      setEmail('')
      setPassword('')
    }
  }

  return (
    <>
      <form css={loginSection}>
        <div css={flexBox}>
          <Input
            modelValue={email}
            type='text'
            label='Email'
            error={emailError}
            onUpdateModelValue={emailUpdate}
          />
          <Input
            modelValue={password}
            type='password'
            label='Password'
            error={passwordError}
            onUpdateModelValue={passwordUpdate}
          />
          <Button onClick={loginHandler} child='Login' />
          <Link css={signupLink} to={'/signup'}>
            Signup
          </Link>
        </div>
      </form>
    </>
  )
}

export default LoginPage
