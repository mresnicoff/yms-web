import {
  Navigate
} from "react-router-dom";

import {
  useAuth
} from "../context/AuthContext";

export default function ProtectedRoute({
  children,
  roles
}) {

  const {
    user,
    loading
  } = useAuth();

  if (loading) {
    return (
      <div>
        Cargando...
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate to="/" />
    );
  }

  // Si la ruta exige roles específicos y el usuario logueado no tiene
  // ninguno de ellos, lo mandamos al dashboard en vez de mostrarle la
  // pantalla. Esto es lo que faltaba: antes los roles solo ocultaban
  // links en el menú, pero cualquier usuario logueado podía entrar a
  // una pantalla escribiendo la URL directamente.
  if (roles && roles.length > 0 && !roles.includes(user?.role)) {
    return (
      <Navigate to="/dashboard" />
    );
  }

  return children;
}
