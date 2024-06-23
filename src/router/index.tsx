import {createBrowserRouter, createRoutesFromElements, Route} from "react-router-dom";
import {Fragment} from "react/jsx-runtime";
import AnimalList from "../modules/admin/animalsManagement/AnimalList";
import AnimalUpdate from "../modules/admin/animalsManagement/AnimalUpdate";
import Dashboard from "../modules/admin/dashboard/Dashboard.tsx";
import EventList from "../modules/admin/eventsManagement/EventList.tsx";
import EventUpdate from "../modules/admin/eventsManagement/EventUpdate.tsx";
import FinancialList from "../modules/admin/financialManagement/FinancialList";
import FinancialUpdate from "../modules/admin/financialManagement/FinancialUpdate";
import AdoptionsList from "../modules/admin/adoptionsManagement/AdoptionsList.tsx";
import AdoptionsUpdate from "../modules/admin/adoptionsManagement/AdoptionsUpdate.tsx";
import RolesList from "../modules/admin/rolesManagement/RolesList";
import RolesUpdate from "../modules/admin/rolesManagement/RolesUpdate";
import {UserManagement} from "../modules/admin/userManagement/UserManagement";
import UserList from "../modules/admin/usersManagement/UserList";
import UserUpdate from "../modules/admin/usersManagement/UserUpdate";
import {ExternalUser} from "../modules/auth/externalUser/ExternalUser.tsx";
import ForgotPassword from "../modules/auth/forgotPassword/ForgotPassword.tsx";
import Login from "../modules/auth/login/Login.tsx";
import Register from "../modules/auth/register/Register.tsx";
import ResetPassword from "../modules/auth/resetPassword/ResetPassword.tsx";
import {Donate} from "../modules/donate/Donate.tsx";
import Success from "../modules/donate/Success.tsx";
import ErrorPage from "../modules/error/Error";
import Home from "../modules/home/Home";
import {DefaultLayout} from "../shared/layout/Default";
import {WebLayout} from "../shared/layout/Web";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Fragment>
            <Route element={<WebLayout />}>
                <Route path="/" element={<Home />} />

                /* Auth */
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/external" element={<ExternalUser />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/recover" element={<ResetPassword />} />

                <Route path="*" element={<ErrorPage />} />

                /* Donate */
                <Route path="/donate" element={<Donate />} />
                <Route path="/donate/success/:id" element={<Donate />} />
                <Route path="/donate/cancel/:id" element={<Donate />} />
                <Route path="/donate/thanks" element={<Success />} />

            </Route>

            <Route element={<DefaultLayout />}>
                <Route path="/admin/dashboard" element={<Dashboard />} />
            /* Users Management */
                <Route path="/admin/users" element={<UserList />} />
                <Route path="/admin/users/new" element={<UserUpdate />} />
                <Route path="/admin/users/:id" element={<UserUpdate />} />
                <Route path="/admin/roles" element={<RolesList />} />
                <Route path="/admin/roles/new" element={<RolesUpdate />} />
                <Route path="/admin/roles/:id" element={<RolesUpdate />} />

            /* Animals Management */
                <Route path="/admin/animals" element={<AnimalList />} />
                <Route path="/admin/animals/new" element={<AnimalUpdate />} />
                <Route path="/admin/animals/:id" element={<AnimalUpdate />} />

            /* Banners Management */
                <Route path="/admin/events" element={<EventList />} />
                <Route path="/admin/events/new" element={<EventUpdate />} />
                <Route path="/admin/events/:id" element={<EventUpdate />} />

            /* Financial Management */
                <Route path="/admin/financial" element={<FinancialList />} />
                <Route path="/admin/financial/new" element={<FinancialUpdate />} />
                <Route path="/admin/financial/:id" element={<FinancialUpdate />} />
                <Route path="payment/success/:id" element={<Home />} />
                <Route path="payment/cancel/:id" element={<Home />} />

            /* Givers Management */
                <Route path="/admin/adoptions" element={<AdoptionsList />} />
                <Route path="/admin/adoptions/new" element={<AdoptionsUpdate />} />
                <Route path="/admin/adoptions/:id" element={<AdoptionsUpdate />} />

            /* User Management */
                <Route path="/admin/user" element={<UserManagement />} />
            </Route>
        </Fragment>

    )
)