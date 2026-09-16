// La operación es siempre en Buenos Aires, más allá de en qué zona
// horaria esté el navegador de quien pide el turno. Usamos Intl con
// timeZone explícito (en vez de new Date().toISOString(), que da la
// fecha en UTC) para no dejar pedir turnos "de ayer" o "de mañana" por
// una diferencia de huso horario del dispositivo.
export const getBuenosAiresToday = () => {

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Argentina/Buenos_Aires"
  }).format(new Date());

};
