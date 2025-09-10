import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './page/Login/login'
import Admin from './page/Admin/Admin'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
