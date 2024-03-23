import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Error from './modules/error/Error'
import Login from './modules/login/Login'
import Logout from './modules/logout/Logout'
import UserList from './modules/usersManagement/UserList'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/user" element={<UserList />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
