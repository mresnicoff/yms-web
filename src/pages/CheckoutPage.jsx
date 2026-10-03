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

import {
  createAtraco
} from "../services/atracoService";

const emptyAtracoForm = {
  cunasColocadas: "0",
  llavesOk: true,
  horaAtraco: "",
  clienteFinal: "",
  receptor: "",
  auditor: "",
  cargador: ""
};

// Formatea un Date al formato que espera un <input type="datetime-local">
// (hora local del navegador, que para los operadores es la de Bs. As.).
const toDatetimeLocalValue = (date) => {

  const pad = (n) => String(n).padStart(2, "0");

  return (
    date.getFullYear() +
    "-" + pad(date.getMonth() + 1) +
    "-" + pad(date.getDate()) +
    "T" + pad(date.getHours()) +
    ":" + pad(date.getMinutes())
  );

};

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

  const [showAtracoModal, setShowAtracoModal] = useState(false);
  const [atracoForm, setAtracoForm] = useState(emptyAtracoForm);

  const [pallets, setPallets] = useState("");

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

  const needsAtraco = (operation) =>
    !operation.checkIn.atraco;

  const isClientPalletsMode = (operation) =>
    operation.checkIn.appointment.warehouse?.checkoutMode ===
    "CLIENT_PALLETS";

  const handleOpenAtraco = (operation) => {

    setSelectedOperation(operation);

    setAtracoForm({
      ...emptyAtracoForm,
      horaAtraco: toDatetimeLocalValue(new Date())
    });

    setShowAtracoModal(true);

  };

  const handleSubmitAtraco = async () => {

    try {

      await createAtraco({
        checkInId: selectedOperation.checkIn.id,
        cunasColocadas: Number(atracoForm.cunasColocadas) || 0,
        llavesOk: atracoForm.llavesOk,
        horaAtraco: atracoForm.horaAtraco
          ? new Date(atracoForm.horaAtraco).toISOString()
          : undefined,
        clienteFinal: atracoForm.clienteFinal,
        receptor: atracoForm.receptor,
        auditor: atracoForm.auditor,
        cargador: atracoForm.cargador
      });

      setShowAtracoModal(false);
      setSelectedOperation(null);

      await loadOperations();

      alert("Atraco registrado correctamente");

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Error registrando el Atraco"
      );

    }

  };

 const handleFinish =
  async (operation) => {

    if (needsAtraco(operation)) {

      handleOpenAtraco(operation);

      return;

    }

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
        operation.checkIn
          .appointment
          .externalTripId
          // Para turnos de Infolog, el Proveedor del turno YA es el
          // código de Hoja de Ruta: se precarga (editable) desde ahí.
          ? operation.checkIn
              .appointment
              .supplier?.name || ""
          : ""
      );

      setSealNumbers(
        [""]
      );

      setPallets("");

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

      const clientPalletsMode =
        isClientPalletsMode(selectedOperation);

      await createDispatch(
        clientPalletsMode
          ? {
              dockOperationId:
                selectedOperation.id,
              pallets: Number(pallets) || 0
            }
          : {
              dockOperationId:
                selectedOperation.id,
              routeSheetNumber,
              sealNumbers:
                sealNumbers.filter(
                  seal =>
                    seal.trim() !== ""
                )
            }
      );

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
                Proveedor o Ruta
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
                      // Para turnos de Infolog, el Proveedor del turno es
                      // directamente el código de Hoja de Ruta (se resuelve
                      // así desde el sync, no hace falta distinguir acá).
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
                      className={
                        needsAtraco(operation)
                          ? "bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-lg"
                          : "bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg"
                      }
                    >
                      {needsAtraco(operation)
                        ? "Cargar Atraco"
                        : "Finalizar"}
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

      {isClientPalletsMode(selectedOperation) ? (

        <>

          <div className="mb-4">

            <label>
              Cliente
            </label>

            <div
              className="
                w-full
                border
                rounded
                p-2
                bg-slate-50
                text-slate-700
              "
            >
              {selectedOperation.checkIn.atraco?.clienteFinal}
            </div>

          </div>

          <div className="mb-4">

            <label>
              Pallets
            </label>

            <input
              type="number"
              min="0"
              value={pallets}
              onChange={(e) =>
                setPallets(e.target.value)
              }
              className="
                w-full
                border
                rounded
                p-2
              "
            />

          </div>

        </>

      ) : (

        <>

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

        </>

      )}

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

      {showAtracoModal && selectedOperation && (

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
              Atraco
            </h2>

            <div className="space-y-3 mb-4">

              <div>

                <label>
                  Cuñas colocadas
                </label>

                <input
                  type="number"
                  min="0"
                  value={atracoForm.cunasColocadas}
                  onChange={(e) =>
                    setAtracoForm({
                      ...atracoForm,
                      cunasColocadas: e.target.value
                    })
                  }
                  className="
                    w-full
                    border
                    rounded
                    p-2
                  "
                />

              </div>

              <div className="flex items-center gap-2">

                <input
                  type="checkbox"
                  checked={atracoForm.llavesOk}
                  onChange={(e) =>
                    setAtracoForm({
                      ...atracoForm,
                      llavesOk: e.target.checked
                    })
                  }
                />

                <label>
                  Llaves OK
                </label>

              </div>

              <div>

                <label>
                  Hora del Atraco
                </label>

                <input
                  type="datetime-local"
                  value={atracoForm.horaAtraco}
                  onChange={(e) =>
                    setAtracoForm({
                      ...atracoForm,
                      horaAtraco: e.target.value
                    })
                  }
                  className="
                    w-full
                    border
                    rounded
                    p-2
                  "
                />

              </div>

              <div>

                <label>
                  Cliente final
                </label>

                <input
                  value={atracoForm.clienteFinal}
                  onChange={(e) =>
                    setAtracoForm({
                      ...atracoForm,
                      clienteFinal: e.target.value
                    })
                  }
                  className="
                    w-full
                    border
                    rounded
                    p-2
                  "
                />

              </div>

              <div>

                <label>
                  Receptor
                </label>

                <input
                  value={atracoForm.receptor}
                  onChange={(e) =>
                    setAtracoForm({
                      ...atracoForm,
                      receptor: e.target.value
                    })
                  }
                  className="
                    w-full
                    border
                    rounded
                    p-2
                  "
                />

              </div>

              <div>

                <label>
                  Auditor
                </label>

                <input
                  value={atracoForm.auditor}
                  onChange={(e) =>
                    setAtracoForm({
                      ...atracoForm,
                      auditor: e.target.value
                    })
                  }
                  className="
                    w-full
                    border
                    rounded
                    p-2
                  "
                />

              </div>

              <div>

                <label>
                  Cargador
                </label>

                <input
                  value={atracoForm.cargador}
                  onChange={(e) =>
                    setAtracoForm({
                      ...atracoForm,
                      cargador: e.target.value
                    })
                  }
                  className="
                    w-full
                    border
                    rounded
                    p-2
                  "
                />

              </div>

            </div>

            <div
              className="
                flex
                justify-end
                gap-2
              "
            >

              <button
                onClick={() => {
                  setShowAtracoModal(false);
                  setSelectedOperation(null);
                }}
              >
                Cancelar
              </button>

              <button
                onClick={handleSubmitAtraco}
                className="
                  bg-amber-500
                  hover:bg-amber-600
                  text-white
                  px-4
                  py-2
                  rounded
                "
              >
                Confirmar Atraco
              </button>

            </div>

          </div>

        </div>

      )}

    </MainLayout>

  );

}