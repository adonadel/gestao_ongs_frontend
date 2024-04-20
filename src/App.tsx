import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Error from './modules/error/Error'
import Login from './modules/login/Login'
import Logout from './modules/logout/Logout'
import UserList from './modules/usersManagement/UserList'
import DefaultAppBar from './shared/components/app-bar/AppBar'
import Home from './modules/home/Home'

function App() {
  return (
    <BrowserRouter>
      <DefaultAppBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
