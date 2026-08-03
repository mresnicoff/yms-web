import {
  useEffect,
  useState
} from "react";
import {
  createDispatch
} from "../services/dispatchService";
import MainLayout
  from "../layouts/MainLayout";

import {
  getActiveOperations,
  finishDockOperation
} from "../services/dockOperationService";

export default function CheckoutPage() {
  const [
  selectedOperation,
  setSelectedOperation
] = useState(null);

const [
  routeSheetNumber,
  setRouteSheetNumber
] = useState("");

const [
  sealNumbers,
  setSealNumbers
] = useState([""]);

const [
  showDispatchModal,
  setShowDispatchModal
] = useState(false);

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

    if (
      operation.checkIn
        .appointment
        .operationType ===
      "LOAD"
    ) {

      setSelectedOperation(
        operation
      );

      setRouteSheetNumber(
        ""
      );

      setSealNumbers(
        [""]
      );

      setShowDispatchModal(
        true
      );

      return;

    }

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
          `✅ Operación finalizada\n\nDock liberado: ${result.dockReleased}`
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

  const handleDispatchCheckout =
  async () => {

    try {

      await createDispatch({
        dockOperationId:
          selectedOperation.id,
        routeSheetNumber,
        sealNumbers:
          sealNumbers.filter(
            seal =>
              seal.trim() !== ""
          )
      });

      await finishDockOperation({
        dockOperationId:
          selectedOperation.id
      });

      setShowDispatchModal(
        false
      );

      setSelectedOperation(
        null
      );

      await loadOperations();

      alert(
        "Checkout realizado correctamente"
      );

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Error realizando checkout"
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
      {showDispatchModal && (

  <div
    className="
      fixed inset-0
      bg-black/50
      flex items-center
      justify-center
    "
  >

    <div
      className="
        bg-white
        p-6
        rounded-xl
        w-[500px]
      "
    >

      <h2
        className="
          text-xl
          font-bold
          mb-4
        "
      >
        Checkout Despacho
      </h2>

      <div className="mb-4">

        <label>
          Hoja de Ruta
        </label>

        <input
          value={
            routeSheetNumber
          }
          onChange={(e) =>
            setRouteSheetNumber(
              e.target.value
            )
          }
          className="
            w-full
            border
            rounded
            p-2
          "
        />

      </div>

      <div className="mb-4">

        <label>
          Precintos
        </label>

        {sealNumbers.map(
          (
            seal,
            index
          ) => (

            <input
              key={index}
              value={seal}
              onChange={(e) => {

                const copy =
                  [...sealNumbers];

                copy[index] =
                  e.target.value;

                setSealNumbers(
                  copy
                );

              }}
              className="
                w-full
                border
                rounded
                p-2
                mb-2
              "
            />

          )
        )}

        <button
          onClick={() =>
            setSealNumbers([
              ...sealNumbers,
              ""
            ])
          }
          className="
            text-blue-600
          "
        >
          + Agregar Precinto
        </button>

      </div>

      <div
        className="
          flex
          justify-end
          gap-2
        "
      >

        <button
          onClick={() =>
            setShowDispatchModal(
              false
            )
          }
        >
          Cancelar
        </button>

        <button
          onClick={
            handleDispatchCheckout
          }
          className="
            bg-green-600
            text-white
            px-4
            py-2
            rounded
          "
        >
          Confirmar
        </button>

      </div>

    </div>

  </div>

)}

    </MainLayout>

  );

}