import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginPage from './components/pages/LoginPage'
import SignupPage from './components/pages/SignupPage'

function App () {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
