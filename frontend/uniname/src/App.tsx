import Dashboard from './page/Dashboard'
import LandingPage from './page/LandingPage'
import { Route, Routes } from 'react-router-dom'

function App() {
  

  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
  )
}

export default App

