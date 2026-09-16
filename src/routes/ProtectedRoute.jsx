import {
  Navigate
} from "react-router-dom";

import {
  useAuth
} from "../context/AuthContext";

import { getHomeRouteForRole } from "../utils/roleHomeRoute";

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
  // ninguno de ellos, lo mandamos a la pantalla "home" de su propio rol
  // en vez de mostrarle la pantalla. Esto es lo que faltaba: antes los
  // roles solo ocultaban links en el menú, pero cualquier usuario logueado
  // podía entrar a una pantalla escribiendo la URL directamente.
  // Importante: no todos los roles tienen acceso a /dashboard, así que no
  // podemos redirigir siempre ahí (generaría un loop de redirección para
  // esos roles).
  if (roles && roles.length > 0 && !roles.includes(user?.role)) {
    return (
      <Navigate to={getHomeRouteForRole(user?.role)} />
    );
  }

  return children;
}
