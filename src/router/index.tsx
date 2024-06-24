import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import AnimalList from "../modules/admin/animalsManagement/AnimalList";
import AnimalUpdate from "../modules/admin/animalsManagement/AnimalUpdate";
import {Dashboard} from "../modules/admin/dashboard/Dashboard";
import FinancialList from "../modules/admin/financialManagement/FinancialList";
import FinancialUpdate from "../modules/admin/financialManagement/FinancialUpdate";
import {GiverList} from "../modules/admin/giversManagement/GiverList";
import {GiverUpdate} from "../modules/admin/giversManagement/GiverUpdate";
import RolesList from "../modules/admin/rolesManagement/RolesList";
import RolesUpdate from "../modules/admin/rolesManagement/RolesUpdate";
import { UserManagement } from "../modules/admin/userManagement/UserManagement";
import UserList from "../modules/admin/usersManagement/UserList";
import UserUpdate from "../modules/admin/usersManagement/UserUpdate";
import ErrorPage from "../modules/error/Error";
import { ExternalUser } from "../modules/externalUser/ExternalUser";
import Home from "../modules/home/Home";
import Login from "../modules/login/Login";
import Register from "../modules/register/Register";
import { DefaultLayout } from "../shared/layout/Default";
import { WebLayout } from "../shared/layout/Web";
import EventList from "../modules/admin/eventsManagement/EventList.tsx";
import EventUpdate from "../modules/admin/eventsManagement/EventUpdate.tsx";
import { Donate } from "../modules/donate/Donate.tsx";
import Success from "../modules/donate/Success.tsx";
import { AnimalAdoption } from "../modules/animal/Animal.tsx";
import { StepConfirm } from "../modules/animal/steps/StepConfirm.tsx";
import { Adoption } from "../modules/animal/Adoption.tsx";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Fragment>
            <Route element={<WebLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/external" element={<ExternalUser />} />
                <Route path="*" element={<ErrorPage />} />

                /* Donate */
                <Route path="/donate" element={<Donate/>} />
                <Route path="/donate/success/:id" element={<Donate />} />
                <Route path="/donate/cancel/:id" element={<Donate />} />
                <Route path="/donate/thanks" element={<Success />} />

                /* Animal */

                <Route path="/animal/:id" element={<AnimalAdoption />} />
                <Route path="/adoption/:id" element={<Adoption />} />

            </Route>
            
            <Route element={<DefaultLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
            /* Users Management */
                <Route path="/users" element={<UserList />} />
                <Route path="/users/new" element={<UserUpdate />} />
                <Route path="/users/:id" element={<UserUpdate />} />
                <Route path="/roles" element={<RolesList />} />
                <Route path="/roles/new" element={<RolesUpdate />} />
                <Route path="/roles/:id" element={<RolesUpdate />} />

            /* Animals Management */
                <Route path="/animals" element={<AnimalList />} />
                <Route path="/animals/new" element={<AnimalUpdate />} />
                <Route path="/animals/:id" element={<AnimalUpdate />} />

            /* Banners Management */
                <Route path="/events" element={<EventList />} />
                <Route path="/events/new" element={<EventUpdate />} />
                <Route path="/events/:id" element={<EventUpdate />} />

            /* Financial Management */
                <Route path="/financial" element={<FinancialList />} />
                <Route path="/financial/new" element={<FinancialUpdate />} />
                <Route path="/financial/:id" element={<FinancialUpdate />} />                

            /* Givers Management */
                <Route path="/givers" element={<GiverList />} />
                <Route path="/givers/new" element={<GiverUpdate />} />
                <Route path="/givers/:id" element={<GiverUpdate />} />

            /* User Management */
                <Route path="/user" element={<UserManagement />} />
            </Route>
        </Fragment>

    )
)