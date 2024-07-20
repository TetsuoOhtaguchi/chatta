import React, { ChangeEvent, MouseEventHandler, useState, useRef } from 'react'

import { Link } from 'react-router-dom'

import { css } from '@emotion/react'

import { functions } from '../../firebase'
import { httpsCallable } from 'firebase/functions'
import { storage } from '../../firebase'
import { uploadFile } from '../../utils/firebase/storage/uploadFile'

import { validationCheck } from '../../utils/helpers/validation'

import { ErrorType } from '../../types'

import Button from '../ui/button/Button'
import Input from '../ui/input/Input'
import Spinner from '../ui/modal/Spinner'

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

const SignupPage: React.FC = () => {
  const [src, setSrc] = useState('noimage.png')
  const [fileObject, setFileObject] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState<string>('')
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

    const userData = {
      file: fileObject,
      name: name,
      email: email,
      password: password
    }

    // 入力チェックを行う
    const validationCheckResult = validationCheck('signup', userData)
    setError(validationCheckResult)

    // エラーが存在する場合、処理を終了する
    if (validationCheckResult.errorCode && validationCheckResult.errorMessage)
      return

    // モーダルを展開する
    setModalState(true)
    setModalSppinerMessage('New registration')

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
          setError({
            errorCode: '',
            errorMessage: ''
          })
          setSpinnerState(false)
          setModalSppinerMessage('')
          setModalCompletionMessage('Completion!!')
        }
      }
    } catch (error) {
      setError({
        errorCode: 'auth',
        errorMessage: 'Sign-up failed.'
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
    if (!modalCompletionMessage) {
      setError({
        errorCode: 'auth',
        errorMessage: 'Sign-up failed.'
      })
    } else {
      setError({
        errorCode: '',
        errorMessage: ''
      })
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
        modalSppinerMessage={modalSppinerMessage}
        modalCompletionMessage={modalCompletionMessage}
        onClose={modalCloseHandler}
      />
      <form css={signupSection}>
        <div css={flexBox}>
          <img
            src={src}
            alt='profile image'
            css={[
              profileImageStyle,
              (error.errorCode === 'fileError' || error.errorCode === 'auth') &&
                profileImageErrorStyle
            ]}
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
            error={
              error.errorCode === 'nameError' || error.errorCode === 'auth'
            }
            icon=''
            onUpdateModelValue={nameUpdate}
          />
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
          <Button onClick={signupHandler} child='Signup' />
          <Link css={loginLink} to={'/'}>
            Login
          </Link>
          <p css={errorMessageText}>{error.errorMessage}</p>
        </div>
      </form>
    </>
  )
}

export default SignupPage
