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

        <Link
          to="/dashboard"
          className="
            hover:text-blue-600
          "
        >
          Dashboard
        </Link>

        {(user?.role === "ADMIN" ||
          user?.role === "PLANNER" ||
          user?.role === "SUPPLIER") && (<>
          <Link
            to="/appointments"
            className="
              hover:text-blue-600
            "
          >
            Appointments
          </Link>
          <Link
  to="/trucks"
  className="
    hover:text-blue-600
  "
>
  Trucks
</Link>
<Link
  to="/checkout"
>
  Check-Out
</Link>
<Link
  to="/drivers"
>
  Drivers
</Link>
</>
        )}

        {(user?.role === "ADMIN" ||
 user?.role === "GATE_OPERATOR" ||
 user?.role === "PLANNER") && (
          <Link
            to="/checkin"
            className="
              hover:text-blue-600
            "
          >
            Check-In
          </Link>
          
        )}

        {(user?.role === "ADMIN" ||
          user?.role === "YARD_OPERATOR" ||
          user?.role === "PLANNER") && (
          <>
            <Link
              to="/queue"
              className="
                hover:text-blue-600
              "
            >
              Queue
            </Link>
                        <Link
              to="/wsp"
              className="
                hover:text-blue-600
              "
            >
              Levantar WSP
            </Link>
            
            <Link
              to="/docTypes"
              className="
                hover:text-blue-600
              "
            >
             Exigencias de documentos
            </Link>
            <Link
  to="/document-types"
>
  Tipos de documentos
</Link>

            <Link
              to="/docks"
              className="
                hover:text-blue-600
              "
            >
              Docks
            </Link>
          </>
        )}

        {user?.role === "ADMIN" && (
          <Link
            to="/suppliers"
            className="
              hover:text-blue-600
            "
          >
            Suppliers
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