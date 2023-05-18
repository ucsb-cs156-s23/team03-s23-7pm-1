import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "main/pages/HomePage";
import ProfilePage from "main/pages/ProfilePage";
import AdminUsersPage from "main/pages/AdminUsersPage";

import TodosIndexPage from "main/pages/Todos/TodosIndexPage";
import TodosCreatePage from "main/pages/Todos/TodosCreatePage";
import TodosEditPage from "main/pages/Todos/TodosEditPage";

import UCSBDatesIndexPage from "main/pages/UCSBDates/UCSBDatesIndexPage";
import UCSBDatesCreatePage from "main/pages/UCSBDates/UCSBDatesCreatePage";
import UCSBDatesEditPage from "main/pages/UCSBDates/UCSBDatesEditPage";


import ParkCreatePage from "main/pages/Parks/ParkCreatePage";
import ParkEditPage from "main/pages/Parks/ParkEditPage";
import ParkIndexPage from "main/pages/Parks/ParkIndexPage";
import ParkDetailsPage from "main/pages/Parks/ParkDetailsPage";

import SchoolIndexPage from "main/pages/Schools/SchoolIndexPage";
import SchoolDetailsPage from "main/pages/Schools/SchoolDetailsPage";
import SchoolCreatePage from "main/pages/Schools/SchoolCreatePage";
import SchoolEditPage from "main/pages/Schools/SchoolEditPage";

import RestaurantIndexPage from "main/pages/Restaurants/RestaurantIndexPage";
import RestaurantDetailsPage from "main/pages/Restaurants/RestaurantDetailsPage";
import RestaurantCreatePage from "main/pages/Restaurants/RestaurantCreatePage";
import RestaurantEditPage from "main/pages/Restaurants/RestaurantEditPage";

import { hasRole, useCurrentUser } from "main/utils/currentUser";

import "bootstrap/dist/css/bootstrap.css";


function App() {

  const { data: currentUser } = useCurrentUser();

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/profile" element={<ProfilePage />} />
        {
          hasRole(currentUser, "ROLE_ADMIN") && <Route exact path="/admin/users" element={<AdminUsersPage />} />
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/todos/list" element={<TodosIndexPage />} />
              <Route exact path="/todos/create" element={<TodosCreatePage />} />
              <Route exact path="/todos/edit/:todoId" element={<TodosEditPage />} />
            </>
          )
        }

        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/ucsbdates/list" element={<UCSBDatesIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/ucsbdates/edit/:id" element={<UCSBDatesEditPage />} />
              <Route exact path="/ucsbdates/create" element={<UCSBDatesCreatePage />} />
            </>
          )
        }

        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/parks/create" element={<ParkCreatePage />} />
              <Route exact path="/parks/edit/:id" element={<ParkEditPage />} />
              <Route exact path="/parks/details/:id" element={<ParkDetailsPage />} />
              <Route exact path="/parks/" element={<ParkIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/schools/" element={<SchoolIndexPage />} />
              <Route exact path="/schools/details/:id" element={<SchoolDetailsPage />} />
              <Route exact path="/schools/edit/:id" element={<SchoolEditPage />} />
              <Route exact path="/schools/create" element={<SchoolCreatePage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/restaurants/" element={<RestaurantIndexPage />} />
              <Route exact path="/restaurants/details/:id" element={<RestaurantDetailsPage />} />
              <Route exact path="/restaurants/edit/:id" element={<RestaurantEditPage />} />
              <Route exact path="/restaurants/create" element={<RestaurantCreatePage />} />
            </>
          )
        }
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
