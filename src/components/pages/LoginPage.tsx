import React, {
  ChangeEvent,
  MouseEventHandler,
  useEffect,
  useState,
  useContext
} from 'react'

import { Link, useNavigate } from 'react-router-dom'

import { css } from '@emotion/react'

import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth'
import { auth } from '../../firebase'

import { LoginUserContext } from '../../context/auth/LoginUserProvider'

import { validationCheck } from '../../utils/helpers/validation'

import { ErrorType } from '../../types'

import Button from '../ui/button/Button'
import Input from '../ui/input/Input'
import Spinner from '../ui/modal/Spinner'

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
  width: var(--page-width);
`

const signupLink = css`
  text-decoration: none;
  font-size: 14px;
  font-weight: var(--font-weight);
  color: var(--text-black);
  cursor: pointer;
  text-align: center;
`

const errorMessageText = css`
  display: grid;
  place-items: center;
  text-align: center;
  color: var(--text-error);
  font-size: 12px;
  font-weight: 600;
  background-color: var(--bg-white);
  line-height: 1.4;
  height: 52px;
`

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const loginUser = useContext(LoginUserContext)

  useEffect(() => {
    // ログインしている場合、ChatroomPageへリダイレクトする
    if (loginUser) {
      navigate('/chatroom')
    }
  }, [loginUser, navigate])

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const [error, setError] = useState<ErrorType>({
    errorCode: '',
    errorMessage: ''
  })

  const [modalState, setModalState] = useState<boolean>(false)
  const [spinnerState, setSpinnerState] = useState<boolean>(true)
  const [modalSppinerMessage, setModalSppinerMessage] = useState<string>('')
  const [modalCompletionMessage, setModalCompletionMessage] =
    useState<string>('')

  const emailUpdate = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  const passwordUpdate = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  // ログイン処理を実行する
  const loginHandler: MouseEventHandler<HTMLButtonElement> = async event => {
    event.preventDefault()

    const userData = {
      file: null,
      name: '',
      email: email,
      password: password
    }

    // 入力チェックを行う
    const validationCheckResult = validationCheck('login', userData)
    setError(validationCheckResult)

    // エラーが存在する場合、処理を終了する
    if (validationCheckResult.errorCode && validationCheckResult.errorMessage)
      return

    // モーダルを展開する
    setModalState(true)
    setModalSppinerMessage('You are logged in')

    try {
      const credential: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = credential.user

      if (user) {
        setError({
          errorCode: '',
          errorMessage: ''
        })
        navigate('/chatroom')
        setEmail('')
        setPassword('')
        setModalState(false)
      }
    } catch (error) {
      setError({
        errorCode: 'auth',
        errorMessage: 'Email address or password is incorrect'
      })
      setSpinnerState(false)
      setModalSppinerMessage('')
      setModalCompletionMessage('')
    }
  }

  // モーダルのcloseボタンを押下した際に、以下の処理を実行する
  const modalCloseHandler = () => {
    setModalState(false)
    setSpinnerState(true)
    setModalSppinerMessage('')
    setModalCompletionMessage('')
  }

  return (
    <>
      <Spinner
        modalToggle={modalState}
        sppinerToggle={spinnerState}
        modalSppinerMessage={modalSppinerMessage}
        modalCompletionMessage={modalCompletionMessage}
        onClose={modalCloseHandler}
      />
      <form css={loginSection}>
        <div css={flexBox}>
          <Input
            modelValue={email}
            type='text'
            label='Email'
            error={
              error.errorCode === 'emailError' || error.errorCode === 'auth'
            }
            icon=''
            onUpdateModelValue={emailUpdate}
          />
          <Input
            modelValue={password}
            type='password'
            label='Password'
            error={
              error.errorCode === 'passwordError' || error.errorCode === 'auth'
            }
            icon='password'
            onUpdateModelValue={passwordUpdate}
          />
          <Button onClick={loginHandler} child='Login' />
          <Link css={signupLink} to={'/signup'}>
            Signup
          </Link>
          <p css={errorMessageText}>{error.errorMessage}</p>
        </div>
      </form>
    </>
  )
}

export default LoginPage
