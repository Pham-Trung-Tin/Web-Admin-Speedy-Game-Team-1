import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './page/Login/login'
import Admin from './page/Admin/Admin'
import Games from "./pages/Games";
import './App.css'

function App() {
  return (
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Admin default (Dashboard) */}
        <Route path="/admin" element={<Admin />} />

        {/* Admin + Games */}
        <Route 
          path="/admin/games" 
          element={
            <>
              <Admin />
              <div className="games-wrapper">
                <Games />
              </div>
            </>
          } 
        />
        {/* Thêm route này nếu muốn truy cập trực tiếp /games */}
        <Route path="/games" element={<Games />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App