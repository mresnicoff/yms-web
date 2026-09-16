// A dónde mandamos a cada rol después de loguearse, y a dónde lo mandamos
// si intenta entrar a una pantalla para la que no tiene permiso. No todos
// los roles tienen acceso a /dashboard, así que no podemos asumir esa ruta
// como default para todos (eso generaba loops de redirección).
const ROLE_HOME_ROUTE = {
  ADMIN: "/dashboard",
  PLANNER: "/dashboard",
  YARD_OPERATOR: "/dashboard",
  GATE_OPERATOR: "/checkin",
  SUPPLIER: "/appointments"
};

export const getHomeRouteForRole = (role) =>
  ROLE_HOME_ROUTE[role] || "/dashboard";
