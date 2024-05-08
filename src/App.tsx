import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Error from './modules/error/Error'
import Home from './modules/home/Home'
import Login from './modules/login/Login'
import Logout from './modules/logout/Logout'
import UserList from './modules/usersManagement/UserList'
import UserUpdate from './modules/usersManagement/UserUpdate'
import DefaultAppBar from './shared/components/app-bar/AppBar'

function App() {
  return (
    <BrowserRouter>
      <DefaultAppBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/new" element={<UserUpdate />} />
        <Route path="/users/:id" element={<UserUpdate />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
