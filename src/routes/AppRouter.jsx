import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import DocumentTypesPage from "../pages/DocumentTypesPage";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import AppointmentsPage from "../pages/AppointmentsPage";
import CheckInPage from "../pages/CheckInPage";
import DocksPage from "../pages/DocksPage";
import TrucksPage from "../pages/TrucksPage";
import CheckoutPage from "../pages/CheckoutPage";
import DriversPage from "../pages/DriversPage";
import UsersPage from "../pages/UsersPage";
import WarehousesPage from "../pages/WarehousesPage";
import ProtectedRoute
  from "./ProtectedRoute";
import DocumentRulesPage from "../pages/DocumentRulesPage";

// Matriz de permisos por pantalla (repaso de permisos, ver Sidebar.jsx
// para el detalle de qué ve cada rol en el menú). Admin siempre está
// incluido porque "debe tener acceso a todo".
const ROLES = {
  DASHBOARD: ["ADMIN", "PLANNER", "YARD_OPERATOR"],
  APPOINTMENTS: ["ADMIN", "PLANNER", "SUPPLIER"],
  TRUCKS: ["ADMIN", "PLANNER", "GATE_OPERATOR"],
  CHECKOUT: ["ADMIN", "PLANNER", "GATE_OPERATOR", "YARD_OPERATOR"],
  DRIVERS: ["ADMIN", "PLANNER", "GATE_OPERATOR"],
  CHECKIN: ["ADMIN", "PLANNER", "GATE_OPERATOR"],
  DOCKS: ["ADMIN", "PLANNER", "YARD_OPERATOR"],
  DOCUMENT_TYPES: ["ADMIN", "PLANNER"]
};

export default function AppRouter() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<LoginPage />}
        />

        <Route
          path="/document-types"
          element={
            <ProtectedRoute roles={ROLES.DOCUMENT_TYPES}>
              <DocumentTypesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={ROLES.DASHBOARD}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/trucks"
          element={
            <ProtectedRoute roles={ROLES.TRUCKS}>
              <TrucksPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute roles={ROLES.CHECKOUT}>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointments"
          element={
            <ProtectedRoute roles={ROLES.APPOINTMENTS}>
              <AppointmentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkin"
          element={
            <ProtectedRoute roles={ROLES.CHECKIN}>
              <CheckInPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/docks"
          element={
            <ProtectedRoute roles={ROLES.DOCKS}>
              <DocksPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/docTypes"
          element={
            <ProtectedRoute roles={ROLES.DOCUMENT_TYPES}>
              <DocumentRulesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/drivers"
          element={
            <ProtectedRoute roles={ROLES.DRIVERS}>
              <DriversPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <UsersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/warehouses"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <WarehousesPage />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );

}
