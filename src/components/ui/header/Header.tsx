import React, { useEffect, useState } from 'react'
import { css } from '@emotion/react'
import Menu from '@mui/icons-material/Menu'
import Close from '@mui/icons-material/Close'
import { useWindowWidth } from '../../../utils/helpers/resize'
import Confirmatory from '../modal/Confirmatory'
import { auth } from '../../../firebase'
import { useNavigate, useLocation } from 'react-router-dom'
import { ProceedChild } from '../../../types'

const header = css`
  position: fixed;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 390px;
  width: 100%;
  height: 40px;
  padding: 0 16px;
  background-color: var(--bg-white);
`

const headerTitle = css`
  color: var(--text-black);
  font-weight: var(--font-weight);
`

const menuIcon = css`
  position: absolute;
  right: 16px;
  cursor: pointer;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
`

const menuList = css`
  display: none;
  @keyframes slideIn {
    from {
      width: 100%;
      max-width: 0px;
    }
    to {
      width: 100%;
      max-width: 390px;
    }
  }

  @keyframes slideOut {
    from {
      width: 100%;
      max-width: 390px;
    }
    to {
      width: 100%;
      max-width: 0px;
    }
  }
`

const menuListItem = css`
  display: none;
`

const Header: React.FC = () => {
  const navigate = useNavigate()
  const isLocation = useLocation()

  const [isProceedChild, setProceedChild] = useState<ProceedChild>('')
  const [isModalState, setModalState] = useState(false)
  const [isModalMessage, setModalMessage] = useState('')

  const [isHeaderTitle, setHeaderTitle] = useState('')

  const [isMenuState, setMenuState] = useState(false)
  const [isMenuListStyle, setMenuListStyle] = useState(menuList)
  const [isMenuListItemStyle, setMenuListItemStyle] = useState(menuListItem)

  const [isAppWidth, setAppWidth] = useState(0)
  const windowWidth = useWindowWidth()

  useEffect(() => {
    if (isLocation.pathname.includes('/friends')) setHeaderTitle('Friends')
  }, [isLocation])

  useEffect(() => {
    if (windowWidth <= 390) {
      setAppWidth(0)
    } else {
      setAppWidth(windowWidth / 2 - 390 / 2)
    }
  }, [windowWidth])

  // メニューを開くまたは閉じる
  const menuOpenAndCloseHandler = () => {
    const isNewMenuState = !isMenuState
    setMenuState(isNewMenuState)

    if (!isNewMenuState) {
      // 閉じる場合
      setMenuListStyle(css`
        background-color: var(--bg-blackRgb);
        animation: slideOut 0.5s forwards;
        position: absolute;
        top: 40px;
        right: ${isAppWidth}px;
        height: calc(100vh - 40px);
        padding: 16px 0;
      `)
      setMenuListItemStyle(css`
        display: none;
      `)
    } else {
      // 開く場合
      setMenuListStyle(css`
        background-color: var(--bg-blackRgb);
        animation: slideIn 0.5s forwards;
        position: absolute;
        top: 40px;
        right: ${isAppWidth}px;
        height: calc(100vh - 40px);
        padding: 16px 0;
      `)
      setTimeout(() => {
        setMenuListItemStyle(css`
          display: block;
          cursor: pointer;
          padding: 8px 16px;
          color: var(--text-white);
          font-weight: 600;
          font-size: 16px;
          text-align: center;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          :hover {
            color: var(--text-hover);
          }
        `)
      }, 500)
    }
  }

  // 確認モーダルを開く
  const modalOpenHandler = (proceedChild: ProceedChild) => {
    setModalState(true)
    setProceedChild(proceedChild)

    // proceedChildごとにメッセージの値を変更する
    if (proceedChild === 'Logout') {
      setModalMessage('Would you like to logout?')
    }
  }

  // 確認モーダルを閉じる
  const modalCloseHandler = () => {
    setModalState(false)
    setProceedChild('')
    setModalMessage('')
  }

  // 確認モーダルの処理を実行する
  const modalSubmitHandler = async (proceedChild: ProceedChild) => {
    // ログイン処理を行う
    if (proceedChild === 'Logout') {
      try {
        // 確認モーダルを閉じる
        setModalState(false)
        // メニューを閉じる
        setMenuState(false)
        setMenuListStyle(css`
          display: none;
        `)
        setMenuListItemStyle(css`
          display: none;
        `)
        await auth.signOut()
        navigate('/')
      } catch (error) {
        console.error('ログアウト中にエラーが発生しました: ', error)
        alert('ログアウト中にエラーが発生しました。もう一度お試しください。')
      }
    }
  }

  // ヘッダー表示フラグ true: 表示 / false: 非表示
  const headerShowFlug = !/^(\/|\/signup)$/.test(isLocation.pathname)

  return headerShowFlug ? (
    <div>
      {/* 確認モーダル */}
      <Confirmatory
        proceedChild={isProceedChild}
        modalState={isModalState}
        message={isModalMessage}
        onCancel={modalCloseHandler}
        onSubmit={() => modalSubmitHandler(isProceedChild)}
      />

      {/* ヘッダー */}
      <header css={header}>
        <h1 css={headerTitle}>{isHeaderTitle}</h1>
        {isMenuState ? (
          <Close css={menuIcon} onClick={menuOpenAndCloseHandler} />
        ) : (
          <Menu css={menuIcon} onClick={menuOpenAndCloseHandler} />
        )}
      </header>

      {/* メニュー */}
      <nav>
        <ul css={isMenuListStyle}>
          <li
            css={isMenuListItemStyle}
            onClick={() => modalOpenHandler('Logout')}
          >
            Logout
          </li>
        </ul>
      </nav>
    </div>
  ) : null
}

export default Header
