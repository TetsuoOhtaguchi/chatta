import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/auth/AuthProvider'
import LoginPage from './components/pages/LoginPage'
import SignupPage from './components/pages/SignupPage'
import FriendsPage from './components/pages/FriendsPage'

function App () {
  return (
    <Router>
      <AuthProvider>
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
