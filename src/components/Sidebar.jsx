import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  useAuth
} from "../context/AuthContext";

export default function Sidebar() {

  const navigate = useNavigate();

  const {
    user,
    logout
  } = useAuth();

  const handleLogout = () => {

    logout();

    navigate("/");

  };

  const role = user?.role;

  return (
    <aside
      className="
        w-64
        min-h-screen
        bg-white
        border-r
        p-6
      "
    >

      <h1
        className="
          text-2xl
          font-bold
          mb-8
        "
      >
        YMS
      </h1>

      <div
        className="
          mb-8
          p-4
          rounded-lg
          bg-slate-50
          border
        "
      >
        <div className="font-semibold">
          {user?.email}
        </div>

        <div
          className="
            text-sm
            text-slate-500
            mt-1
          "
        >
          {user?.role}
        </div>
      </div>

      <nav
        className="
          flex
          flex-col
          gap-3
        "
      >

        {(role === "ADMIN" ||
          role === "PLANNER" ||
          role === "YARD_OPERATOR") && (
          <Link
            to="/dashboard"
            className="hover:text-blue-600"
          >
            Dashboard
          </Link>
        )}

        {(role === "ADMIN" ||
          role === "PLANNER" ||
          role === "SUPPLIER") && (
          <Link
            to="/appointments"
            className="hover:text-blue-600"
          >
            Turnos
          </Link>
        )}

        {(role === "ADMIN" ||
          role === "PLANNER" ||
          role === "GATE_OPERATOR") && (
          <Link
            to="/trucks"
            className="hover:text-blue-600"
          >
            Vehículo
          </Link>
        )}

        {(role === "ADMIN" ||
          role === "PLANNER" ||
          role === "GATE_OPERATOR" ||
          role === "YARD_OPERATOR") && (
          <Link
            to="/checkout"
            className="hover:text-blue-600"
          >
            Check-Out
          </Link>
        )}

        {(role === "ADMIN" ||
          role === "PLANNER" ||
          role === "GATE_OPERATOR") && (
          <Link
            to="/drivers"
            className="hover:text-blue-600"
          >
            Choferes
          </Link>
        )}

        {(role === "ADMIN" ||
          role === "PLANNER" ||
          role === "GATE_OPERATOR") && (
          <Link
            to="/checkin"
            className="hover:text-blue-600"
          >
            Check-In
          </Link>
        )}

        {(role === "ADMIN" ||
          role === "PLANNER") && (
          <>
            <Link
              to="/docTypes"
              className="hover:text-blue-600"
            >
              Exigencias de documentos
            </Link>

            <Link
              to="/document-types"
              className="hover:text-blue-600"
            >
              Tipos de documentos
            </Link>
          </>
        )}

        {(role === "ADMIN" ||
          role === "PLANNER" ||
          role === "YARD_OPERATOR") && (
          <Link
            to="/docks"
            className="hover:text-blue-600"
          >
            Docks
          </Link>
        )}

        {role === "ADMIN" && (
          <Link
            to="/users"
            className="hover:text-blue-600"
          >
            Usuarios
          </Link>
        )}

        {role === "ADMIN" && (
          <Link
            to="/warehouses"
            className="hover:text-blue-600"
          >
            Warehouses
          </Link>
        )}

        <button
          onClick={handleLogout}
          className="
            mt-8
            text-left
            text-red-600
            hover:text-red-700
          "
        >
          Logout
        </button>

      </nav>

    </aside>
  );

}
