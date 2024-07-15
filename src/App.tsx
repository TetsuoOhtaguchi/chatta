/** @jsxImportSource @emotion/react */
import emotionRset from 'emotion-reset'
import { Global, css } from '@emotion/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LoginUserProvider } from './context/auth/LoginUserProvider'
import { UsersProvider } from './context/users/UsersProvider'
import { MessagesProvider } from './context/messages/MessagesProvider'
import LoginPage from './components/pages/LoginPage'
import SignupPage from './components/pages/SignupPage'
import ChatroomPage from './components/pages/ChatroomPage'
import Header from './components/ui/header/Header'
import buildProvidersTree from './utils/buildProvidersTree'

const ProviderTree = buildProvidersTree([
  LoginUserProvider,
  UsersProvider,
  MessagesProvider
])

function App () {
  return (
    <Router>
      <ProviderTree>
        <Global
          styles={css`
            ${emotionRset}

            *, *::after, *::before {
              box-sizing: border-box;
              -moz-osx-font-smoothing: grayscale;
              -webkit-font-smoothing: antialiased;
            }
          `}
        />
        <Header />
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/chatroom' element={<ChatroomPage />} />
        </Routes>
      </ProviderTree>
    </Router>
  )
}

export default App
