import React, {
  ChangeEvent,
  MouseEventHandler,
  useEffect,
  useState,
  useContext
} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LoginUserContext } from '../../context/auth/LoginUserProvider'
import { css } from '@emotion/react'
import { validationCheck } from '../../utils/helpers/validation'
import Button from '../ui/button/Button'
import Input from '../ui/input/Input'
import Spinner from '../ui/modal/Spinner'
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

  const [emailError, setEmailError] = useState<boolean>(false)
  const [passwordError, setPasswordError] = useState<boolean>(false)

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

  const loginHandler: MouseEventHandler<HTMLButtonElement> = async event => {
    event.preventDefault()

    setEmailError(validationCheck(email, null, 'email'))
    setPasswordError(validationCheck(password, null, 'password'))
    const emailErrorCheck = validationCheck(email, null, 'email')
    const passwordErrorCheck = validationCheck(password, null, 'password')

    if (emailErrorCheck || passwordErrorCheck) return

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
        navigate('/chatroom')
        setEmail('')
        setPassword('')
        setModalState(false)
      }
    } catch (error) {
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

    // メールアドレスとパスワードをエラー表示にする
    setEmailError(true)
    setPasswordError(true)
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
            error={emailError}
            icon=''
            onUpdateModelValue={emailUpdate}
          />
          <Input
            modelValue={password}
            type='password'
            label='Password'
            error={passwordError}
            icon='password'
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
