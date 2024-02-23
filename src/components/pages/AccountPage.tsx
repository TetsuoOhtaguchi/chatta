/** @jsxImportSource @emotion/react */
import React, { useState, useRef } from 'react'
import { css } from '@emotion/react'
import Button from '../ui/button/Button'
import { storage } from '../../firebase'
import { uploadFile } from '../../utils/firebase/storage/uploadFile'

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

const AccountPage: React.FC = () => {
  const [profileImageSrc, setProfileImageSrc] = useState('noimage.png')
  const [fileObject, setFileObject] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const targetFile = e.target.files[0]
    setFileObject(targetFile)
    setProfileImageSrc(window.URL.createObjectURL(targetFile))
  }

  const onImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Firestorageに画像をアップロードする
  const uploadToFirestorage = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault()

    // 保存用の画像URL配列
    const srcUrl = await uploadFile(
      storage,
      'users/furukawahageUID',
      fileObject!
    )
    console.log('Firestoreに保存するsrcの値: ', srcUrl)
  }

  return (
    <>
      <form css={loginSection}>
        <div css={flexBox}>
          <img
            src={profileImageSrc}
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
          <Button onClick={uploadToFirestorage} child='Firestorage' />
        </div>
      </form>
    </>
  )
}

export default AccountPage
