/** @jsxImportSource @emotion/react */
import emotionRset from 'emotion-reset'
import { Global, css } from '@emotion/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/auth/AuthProvider'
import LoginPage from './components/pages/LoginPage'
import SignupPage from './components/pages/SignupPage'
import FriendsPage from './components/pages/FriendsPage'
import Header from './components/ui/header/Header'

function App () {
  return (
    <Router>
      <AuthProvider>
        <Global
          styles={css`
            ${emotionRset}

            *, *::after, *::before {
              box-sizing: border-box;
              -moz-osx-font-smoothing: grayscale;
              -webkit-font-smoothing: antialiased;
              font-smoothing: antialiased;
            }
          `}
        />
        <Header />
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/friends' element={<FriendsPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
