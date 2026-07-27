function getStatusColor(status) {

  switch (status) {

    case "SCHEDULED":
      return "bg-slate-100 text-slate-700";

    case "WAITING_DOCK":
      return "bg-yellow-100 text-yellow-800";

    case "IN_OPERATION":
      return "bg-blue-100 text-blue-700";

    case "COMPLETED":
      return "bg-green-100 text-green-700";

    case "CANCELLED":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";

  }

}

export default function AppointmentTable({
  appointments,
  actionLabel,
  onAction
}) {

  return (
    <div
      className="
        bg-white
        border
        rounded-xl
        shadow-sm
        overflow-hidden
      "
    >

      <table className="w-full">

        <thead
          className="
            bg-slate-50
            border-b
          "
        >
          <tr>

            <th className="text-left p-4">
              Fecha
            </th>

            <th className="text-left p-4">
              Hora
            </th>

            <th className="text-left p-4">
              Proveedor
            </th>

            <th className="text-left p-4">
              Operación
            </th>

            <th className="text-left p-4">
              Estado
            </th>

            {onAction && (
              <th className="text-left p-4">
                Acción
              </th>
            )}

          </tr>
        </thead>

        <tbody>

          {appointments.map(
            (appointment) => (

              <tr
                key={appointment.id}
                className="
                  border-b
                  hover:bg-slate-50
                "
              >

                <td className="p-4">

                  {new Date(
                    appointment.startTime
                  ).toLocaleDateString()}

                </td>

                <td className="p-4">

                  {new Date(
                    appointment.startTime
                  ).toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute: "2-digit"
                    }
                  )}

                </td>

                <td className="p-4">

                  {
                    appointment.supplier
                      ?.name
                  }

                </td>

                <td className="p-4">

                  {
                    appointment.operationType
                  }

                </td>

                <td className="p-4">

                  <span
                    className={`
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      font-medium
                      ${getStatusColor(
                        appointment.status
                      )}
                    `}
                  >
                    {appointment.status}
                  </span>

                </td>

                {onAction && (

                  <td className="p-4">

                    <button
                      onClick={() =>
                        onAction(
                          appointment
                        )
                      }
                      className="
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        px-3
                        py-1
                        rounded-lg
                        text-sm
                      "
                    >
                      {actionLabel}
                    </button>

                  </td>

                )}

              </tr>

            )
          )}

          {appointments.length === 0 && (

            <tr>

              <td
                colSpan={
                  onAction
                    ? 6
                    : 5
                }
                className="
                  p-8
                  text-center
                  text-slate-500
                "
              >
                No hay turnos registrados
              </td>

            </tr>

          )}

        </tbody>

      </table>

    </div>
  );

}