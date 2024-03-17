import React, { useEffect, useState } from 'react'
import { css } from '@emotion/react'
import Menu from '@mui/icons-material/Menu'
import Close from '@mui/icons-material/Close'
import { useWindowWidth } from '../../../utils/helpers/resize'
import Confirmatory from '../modal/Confirmatory'
import { auth } from '../../../firebase'
import { useNavigate, useLocation } from 'react-router-dom'

const header = css`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 390px;
  width: 100%;
  height: 40px;
  padding: 0 16px;
`

const title = css`
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
  const location = useLocation()

  const [headerTitle, setHeaderTitle] = useState('')

  const [menuState, setMenuState] = useState(false)
  const [menuListStyle, setMenuListStyle] = useState(menuList)
  const [menuListItemStyle, setMenuListItemStyle] = useState(menuListItem)

  const [logoutModalState, setLogoutModalState] = useState(false)

  const [appWidth, setAppWidth] = useState(0)
  const windowWidth = useWindowWidth()

  useEffect(() => {
    if (location.pathname.includes('/friends')) setHeaderTitle('Friends')
  }, [location])

  useEffect(() => {
    if (windowWidth <= 390) {
      setAppWidth(0)
    } else {
      setAppWidth(windowWidth / 2 - 390 / 2)
    }
  }, [windowWidth])

  // メニューを開くまたは閉じる
  const menuOpenAndCloseHandler = () => {
    const newMenuState = !menuState
    setMenuState(newMenuState)

    if (!newMenuState) {
      // 閉じる場合
      setMenuListStyle(css`
        background-color: var(--bg-blackRgb);
        animation: slideOut 0.5s forwards;
        position: absolute;
        top: 40px;
        right: ${appWidth}px;
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
        right: ${appWidth}px;
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

  // ログアウトモーダルを開く
  const logoutModalOpenHandler = () => {
    setLogoutModalState(true)
  }

  // ログアウトモーダルを閉じる
  const logoutModalCloseHandler = () => {
    setLogoutModalState(false)
  }

  // ログアウトを実行する
  const logoutSubmitHandler = async () => {
    try {
      // モーダルを閉じる
      setLogoutModalState(false)
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

  return location.pathname !== '/' ? (
    <div>
      {/* ログアウト確認モーダル */}
      <Confirmatory
        proceedChild='Logout'
        modalState={logoutModalState}
        message='Would you like to logout?'
        onCancel={logoutModalCloseHandler}
        onSubmit={logoutSubmitHandler}
      />

      {/* ヘッダー */}
      <header css={header}>
        <h1 css={title}>{headerTitle}</h1>
        {menuState ? (
          <Close css={menuIcon} onClick={menuOpenAndCloseHandler} />
        ) : (
          <Menu css={menuIcon} onClick={menuOpenAndCloseHandler} />
        )}
      </header>

      {/* メニュー */}
      <nav>
        <ul css={menuListStyle}>
          <li css={menuListItemStyle} onClick={logoutModalOpenHandler}>
            Logout
          </li>
        </ul>
      </nav>
    </div>
  ) : null
}

export default Header
