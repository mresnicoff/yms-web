import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import AppointmentsPage from "../pages/AppointmentsPage";
import QueuePage from "../pages/QueuePage";
import CheckInPage from "../pages/CheckInPage";
import DocksPage from "../pages/DocksPage";
import TrucksPage from "../pages/TrucksPage";
import CheckoutPage from "../pages/CheckoutPage";
import DriversPage from "../pages/DriversPage";

import ProtectedRoute
  from "./ProtectedRoute";

export default function AppRouter() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<LoginPage />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trucks"
          element={
           <ProtectedRoute>
          <TrucksPage />
          </ProtectedRoute>}
/>
<Route
  path="/checkout"
  element={
    <ProtectedRoute>
      <CheckoutPage />
    </ProtectedRoute>
  }
/>
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <AppointmentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkin"
          element={
            <ProtectedRoute>
              <CheckInPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/queue"
          element={
            <ProtectedRoute>
              <QueuePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/docks"
          element={
            <ProtectedRoute>
              <DocksPage />
            </ProtectedRoute>
          }
        />
        <Route
  path="/drivers"
  element={
    <ProtectedRoute>
      <DriversPage />
    </ProtectedRoute>
  }
/>
        

      </Routes>

    </BrowserRouter>
  );

}