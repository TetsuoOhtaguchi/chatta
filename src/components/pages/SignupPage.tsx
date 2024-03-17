import React, { ChangeEvent, MouseEventHandler, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { css } from '@emotion/react'
import '../../assets/css/variable.css'
import { validationCheck } from '../../utils/helpers/validation'
import Button from '../ui/button/Button'
import Input from '../ui/input/Input'
import Spinner from '../ui/modal/Spinner'
import { functions } from '../../firebase'
import { httpsCallable } from 'firebase/functions'
import { storage } from '../../firebase'
import { uploadFile } from '../../utils/firebase/storage/uploadFile'

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
  width: var(--page-width);
`

const profileImageStyle = css`
  width: 100px;
  height: 100px;
  background-color: var(--bg-grey);
  padding: 1px;
  border-radius: 50%;
  cursor: pointer;
  object-fit: cover;
  vertical-align: top;
  margin: 0 auto;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
`

const profileImageErrorStyle = css`
  background-color: var(--bg-error);
`

const loginLink = css`
  text-decoration: none;
  font-size: 14px;
  font-weight: var(--font-weight);
  color: var(--text-black);
  cursor: pointer;
  text-align: center;
`

const SignupPage: React.FC = () => {
  const [src, setSrc] = useState('noimage.png')
  const [fileObject, setFileObject] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const [fileError, setFileError] = useState<boolean>(false)
  const [nameError, setNameError] = useState<boolean>(false)
  const [emailError, setEmailError] = useState<boolean>(false)
  const [passwordError, setPasswordError] = useState<boolean>(false)

  const [modalState, setModalState] = useState<boolean>(false)
  const [spinnerState, setSpinnerState] = useState<boolean>(true)
  const [modalMessage, setModalMessage] = useState<string>('')

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const targetFile = e.target.files[0]
    setFileObject(targetFile)
    setSrc(window.URL.createObjectURL(targetFile))
  }

  const onImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const nameUpdate = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const emailUpdate = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  const passwordUpdate = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  // 新規登録処理を実行する
  const signupHandler: MouseEventHandler<HTMLButtonElement> = async event => {
    event.preventDefault()

    // 入力チェックを実行する
    setFileError(validationCheck('', fileObject, 'file'))
    setNameError(validationCheck(name, null, 'name'))
    setEmailError(validationCheck(email, null, 'email'))
    setPasswordError(validationCheck(password, null, 'password'))
    const fileErrorCheck = validationCheck('', fileObject, 'file')
    const nameErrorCheck = validationCheck(name, null, 'name')
    const emailErrorCheck = validationCheck(email, null, 'email')
    const passwordErrorCheck = validationCheck(password, null, 'password')

    if (
      fileErrorCheck ||
      nameErrorCheck ||
      emailErrorCheck ||
      passwordErrorCheck
    )
      return

    // モーダルを展開する
    setModalState(true)

    // Firebase処理を実行する
    try {
      // Firebase Cloud Functionsを呼び出す
      // Authにユーザー情報を登録し、Firestoreにユーザー情報を保存する
      const createUserFunction = httpsCallable(functions, 'createUser')
      const createUserResult = await createUserFunction({
        name,
        email,
        password
      })
      const uid = createUserResult.data

      // 新規登録が成功した場合
      if (uid) {
        // Firestorageに画像を保存する
        const srcUrl = await uploadFile(storage, `users/${uid}`, fileObject!)

        // ユーザー情報を更新する
        const updateUserFunction = httpsCallable(functions, 'updateUser')
        const updateUserResult = await updateUserFunction({
          id: uid,
          src: srcUrl
        })

        const data = updateUserResult.data as { success: boolean }

        // 全ての情報保存処理が成功した場合、スピナーを停止する
        if (data.success) {
          setSpinnerState(false)
          setModalMessage('Completion!!')
        }
      }
    } catch (error) {
      setSpinnerState(false)
      setModalMessage('')
    }
  }

  // モーダルのcloseボタンを押下した際に、以下の処理を実行する
  const modalCloseHandler = () => {
    setModalState(false)
    setSpinnerState(true)
    setModalMessage('')
    if (!modalMessage) {
      setFileError(true)
      setNameError(true)
      setEmailError(true)
      setPasswordError(true)
    } else {
      setSrc('noimage.png')
      setName('')
      setEmail('')
      setPassword('')
    }
  }

  return (
    <>
      <Spinner
        modalToggle={modalState}
        sppinerToggle={spinnerState}
        modalMessage={modalMessage}
        onClose={modalCloseHandler}
      />
      <form css={signupSection}>
        <div css={flexBox}>
          <img
            src={src}
            alt='profile image'
            css={[profileImageStyle, fileError && profileImageErrorStyle]}
            onClick={onImageClick}
          />
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            onChange={onFileInputChange}
            style={{ display: 'none' }}
          />
          <Input
            modelValue={name}
            type='text'
            label='Name'
            error={nameError}
            icon=''
            onUpdateModelValue={nameUpdate}
          />
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
          <Button onClick={signupHandler} child='Signup' />
          <Link css={loginLink} to={'/'}>
            Login
          </Link>
        </div>
      </form>
    </>
  )
}

export default SignupPage
