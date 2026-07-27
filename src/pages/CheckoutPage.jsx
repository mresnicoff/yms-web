import {
  useEffect,
  useState
} from "react";

import MainLayout
  from "../layouts/MainLayout";

import {
  getActiveOperations,
  finishDockOperation
} from "../services/dockOperationService";

export default function CheckoutPage() {

  const [
    operations,
    setOperations
  ] = useState([]);

  useEffect(() => {

    loadOperations();

  }, []);

  const loadOperations =
    async () => {

      try {

        const data =
          await getActiveOperations();

        setOperations(
          data
        );

      } catch (error) {

        console.error(error);

      }

    };

  const handleFinish =
    async (operation) => {

      try {

        const result =
          await finishDockOperation({
            dockOperationId:
              operation.id
          });

        if (
          result.autoAssigned
        ) {

          alert(
            `✅ Operación finalizada\n\nDock liberado: ${result.dockReleased}\n\nNuevo camión asignado automáticamente al dock.`
          );

        } else {

          alert(
            `✅ Operación finalizada\n\nDock liberado: ${result.dockReleased}`
          );

        }

        await loadOperations();

      } catch (error) {

        alert(
          error.response?.data?.message ||
          "Error finalizando operación"
        );

      }

    };

  return (

    <MainLayout>

      <h1
        className="
          text-3xl
          font-bold
          mb-6
        "
      >
        Check-Out
      </h1>

      <div
        className="
          bg-white
          border
          rounded-xl
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

              <th className="p-4 text-left">
                Dock
              </th>

              <th className="p-4 text-left">
                Proveedor
              </th>

              <th className="p-4 text-left">
                Operación
              </th>

              <th className="p-4 text-left">
                Inicio
              </th>

              <th className="p-4 text-left">
                Acción
              </th>

            </tr>

          </thead>

          <tbody>

            {operations.map(
              (operation) => (

                <tr
                  key={operation.id}
                  className="
                    border-b
                    hover:bg-slate-50
                  "
                >

                  <td className="p-4">
                    {
                      operation.dock.code
                    }
                  </td>

                  <td className="p-4">
                    {
                      operation.checkIn
                        .appointment
                        .supplier
                        .name
                    }
                  </td>

                  <td className="p-4">
                    {
                      operation.checkIn
                        .appointment
                        .operationType
                    }
                  </td>

                  <td className="p-4">

                    {new Date(
                      operation.startedAt
                    ).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit"
                      }
                    )}

                  </td>

                  <td className="p-4">

                    <button
                      onClick={() =>
                        handleFinish(
                          operation
                        )
                      }
                      className="
                        bg-green-600
                        hover:bg-green-700
                        text-white
                        px-3
                        py-1
                        rounded-lg
                      "
                    >
                      Finalizar
                    </button>

                  </td>

                </tr>

              )
            )}

            {operations.length === 0 && (

              <tr>

                <td
                  colSpan={5}
                  className="
                    p-8
                    text-center
                    text-slate-500
                  "
                >
                  No hay operaciones activas
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </MainLayout>

  );

}