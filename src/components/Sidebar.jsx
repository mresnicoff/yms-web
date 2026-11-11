import {
  NavLink,
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

  const linkClass = ({ isActive }) =>
    `block rounded-lg px-3 py-2 text-sm transition ${
      isActive
        ? "bg-signal text-ink font-semibold"
        : "text-slate-300 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <aside className="w-64 min-h-screen bg-ink text-white p-5 flex-shrink-0">

      <div className="font-display text-3xl font-extrabold uppercase tracking-wide mb-8 px-1">
        YMS<span className="text-signal">Pro</span>
      </div>

      <div className="mb-6 px-3 py-3 rounded-lg bg-white/5 border border-white/10">
        <div className="font-semibold text-sm break-all">
          {user?.email}
        </div>

        <div className="text-xs uppercase tracking-wider text-signal mt-1">
          {user?.role}
        </div>
      </div>

      <nav className="flex flex-col gap-1">

        {(role === "ADMIN" ||
          role === "PLANNER" ||
          role === "YARD_OPERATOR") && (
          <NavLink
            to="/dashboard"
            className={linkClass}
          >
            Dashboard
          </NavLink>
        )}

        {(role === "ADMIN" ||
          role === "PLANNER" ||
          role === "SUPPLIER") && (
          <NavLink
            to="/appointments"
            className={linkClass}
          >
            Turnos
          </NavLink>
        )}

        {(role === "ADMIN" ||
          role === "PLANNER" ||
          role === "GATE_OPERATOR") && (
          <NavLink
            to="/trucks"
            className={linkClass}
          >
            Vehículo
          </NavLink>
        )}

        {(role === "ADMIN" ||
          role === "PLANNER" ||
          role === "GATE_OPERATOR" ||
          role === "YARD_OPERATOR") && (
          <NavLink
            to="/checkout"
            className={linkClass}
          >
            Check-Out
          </NavLink>
        )}

        {(role === "ADMIN" ||
          role === "PLANNER" ||
          role === "GATE_OPERATOR") && (
          <NavLink
            to="/drivers"
            className={linkClass}
          >
            Choferes
          </NavLink>
        )}

        {(role === "ADMIN" ||
          role === "PLANNER" ||
          role === "GATE_OPERATOR") && (
          <NavLink
            to="/checkin"
            className={linkClass}
          >
            Check-In
          </NavLink>
        )}

        {(role === "ADMIN" ||
          role === "PLANNER") && (
          <>
            <NavLink
              to="/docTypes"
              className={linkClass}
            >
              Exigencias de documentos
            </NavLink>

            <NavLink
              to="/document-types"
              className={linkClass}
            >
              Tipos de documentos
            </NavLink>
          </>
        )}

        {(role === "ADMIN" ||
          role === "PLANNER" ||
          role === "YARD_OPERATOR") && (
          <NavLink
            to="/docks"
            className={linkClass}
          >
            Docks
          </NavLink>
        )}

        {role === "ADMIN" && (
          <NavLink
            to="/users"
            className={linkClass}
          >
            Usuarios
          </NavLink>
        )}

        {role === "ADMIN" && (
          <NavLink
            to="/warehouses"
            className={linkClass}
          >
            Warehouses
          </NavLink>
        )}

        <button
          onClick={handleLogout}
          className="mt-8 text-left rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/10 hover:text-white"
        >
          Cerrar sesión
        </button>

      </nav>

    </aside>
  );

}
