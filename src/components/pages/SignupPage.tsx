/** @jsxImportSource @emotion/react */
import React, { ChangeEvent, MouseEventHandler, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { css } from '@emotion/react'
import Button from '../ui/button/Button'
import Input from '../ui/input/Input'
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
`

const profileImageStyle = css`
  width: 100px;
  height: 100px;
  background-color: #dcdcdc;
  padding: 1px;
  border-radius: 50%;
  cursor: pointer;
  object-fit: cover;
  vertical-align: top;
  margin: 0 auto;
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
  const [src, setSrc] = useState('noimage.png')
  const [fileObject, setFileObject] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

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
        const uploadUserFunction = httpsCallable(functions, 'uploadUser')
        const uploadUserResult = await uploadUserFunction({
          id: uid,
          src: srcUrl
        })

        const data = uploadUserResult.data as { success: boolean }

        if (data.success) {
          navigate('/')
          setSrc('noimage.png')
          setName('')
          setEmail('')
          setPassword('')
        }
      }
    } catch (error) {
      alert('Error')
    }
  }

  return (
    <>
      <form css={signupSection}>
        <div css={flexBox}>
          <img
            src={src}
            alt='profile image'
            css={profileImageStyle}
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
            onUpdateModelValue={nameUpdate}
          />
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
