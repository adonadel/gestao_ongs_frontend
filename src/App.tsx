import { ThemeProvider } from '@mui/material'
import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AnimalList } from './modules/admin/animalsManagement/AnimalList'
import { AnimalUpdate } from './modules/admin/animalsManagement/AnimalUpdate'
import { BannerList } from './modules/admin/bannersManagement/BannerList'
import { BannerUpdate } from './modules/admin/bannersManagement/BannerUpdate'
import { Dashboard } from './modules/admin/dashboard/Dashboard'
import { DonationList } from './modules/admin/donationsManagement/DonationList'
import { DonationUpdate } from './modules/admin/donationsManagement/DonationUpdate'
import Error from './modules/admin/error/Error'
import { FinancialList } from './modules/admin/financialManagement/FinancialList'
import { FinancialUpdate } from './modules/admin/financialManagement/FinancialUpdate'
import { GiverList } from './modules/admin/giversManagement/GiverList'
import { GiverUpdate } from './modules/admin/giversManagement/GiverUpdate'
import { UserManagement } from './modules/admin/userManagement/UserManagement'
import UserList from './modules/admin/usersManagement/UserList'
import UserUpdate from './modules/admin/usersManagement/UserUpdate'
import Home from './modules/home/Home'
import Login from './modules/login/Login'
import { DefaultDrawer } from './shared/components/drawer/DefaultDrawer'
import { theme } from './shared/styles/theme'

function App() {
  const [open, setOpen] = useState(false);

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <DefaultDrawer setOpen={setOpen} open={open}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            /* Users Management */
            <Route path="/users" element={<UserList />} />
            <Route path="/users/new" element={<UserUpdate />} />
            <Route path="/users/:id" element={<UserUpdate />} />

            /* Animals Management */
            <Route path="/animals" element={<AnimalList />} />
            <Route path="/animals/new" element={<AnimalUpdate />} />
            <Route path="/animals/:id" element={<AnimalUpdate />} />

            /* Banners Management */
            <Route path="/banners" element={<BannerList />} />
            <Route path="/banners/new" element={<BannerUpdate />} />
            <Route path="/banners/:id" element={<BannerUpdate />} />

            /* Donations Management */
            <Route path="/donations" element={<DonationList />} />
            <Route path="/donations/new" element={<DonationUpdate />} />
            <Route path="/donations/:id" element={<DonationUpdate />} />

            /* Financial Management */
            <Route path="/financial" element={<FinancialList />} />
            <Route path="/financial/new" element={<FinancialUpdate />} />
            <Route path="/financial/:id" element={<FinancialUpdate />} />

            /* Givers Management */
            <Route path="/givers" element={<GiverList />} />
            <Route path="/givers/new" element={<GiverUpdate />} />
            <Route path="/givers/:id" element={<GiverUpdate />} />

            /* Auth */
            <Route path="/login" element={<Login />} />
            <Route path="/user" element={<UserManagement />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </DefaultDrawer>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
