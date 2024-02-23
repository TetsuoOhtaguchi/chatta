import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginPage from './components/pages/LoginPage'
import SignupPage from './components/pages/SignupPage'
import AccountPage from './components/pages/AccountPage'
import FriendsPage from './components/pages/FriendsPage'

function App () {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/account' element={<AccountPage />} />
          <Route path='/friends' element={<FriendsPage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
