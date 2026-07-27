import {
  useEffect,
  useState
} from "react";
import {
  assignDock
} from "../services/dockOperationService";

import MainLayout
  from "../layouts/MainLayout";

import AppointmentTable
  from "../components/AppointmentTable";

import {
  getAppointments
} from "../services/appointmentService";

import {
  getTrucks
} from "../services/truckService";

import {
  getDrivers
} from "../services/driverService";

import {
  createCheckIn
} from "../services/checkInService";

import {
  useAuth
} from "../context/AuthContext";

export default function CheckInPage() {

  const { user } = useAuth();

  const [
    appointments,
    setAppointments
  ] = useState([]);

  const [
    trucks,
    setTrucks
  ] = useState([]);

  const [
    selectedAppointment,
    setSelectedAppointment
  ] = useState(null);

  const [
    selectedTruckId,
    setSelectedTruckId
  ] = useState();

  const [drivers, setDrivers]= useState([]);
const [selectedDriverId, setSelectedDriverId]= useState("");

  useEffect(() => {

    loadData();

  }, []);

  const loadData =
    async () => {

      try {

        const [
          appointmentsData,
          trucksData,
          driversData
        ] = await Promise.all([
          getAppointments(),
          getTrucks(),
          getDrivers()
        ]);

        setAppointments(
          appointmentsData
        );
        setDrivers(driversData);

        setTrucks(
          trucksData
        );

      } catch (error) {

        console.error(error);

      }

    };

const handleCheckIn =
  async () => {

    try {

      const checkIn =
        await createCheckIn({

          appointmentId:
            selectedAppointment.id,

          truckId:
            selectedTruckId,

            driverId:selectedDriverId,

          createdById:
            user.id

        });

      const assignResult =
        await assignDock({

          checkInId:
            checkIn.id,

          assignedById:
            user.id

        });

      if (
        assignResult.assigned
      ) {

alert(
  `✅ Check-In realizado

WhatsApp destino:
${assignResult.driverPhone}

Mensaje:

Hola ${assignResult.driverName},

Su vehículo fue asignado al dock ${assignResult.dockCode}.

Por favor diríjase al muelle indicado.`
);


      } else {

        alert(
          "✅ Check-In realizado\n\nNo hay docks disponibles.\nVehículo enviado a cola de espera."
        );

      }

      setSelectedAppointment(
        null
      );

      setSelectedTruckId("");
      setSelectedDriverId("");

      await loadData();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Error realizando Check-In"
      );

    }

  };

  const scheduledAppointments =
    appointments.filter(
      appointment =>
        appointment.status ===
        "SCHEDULED"
    );

  return (

    <MainLayout>

      <h1
        className="
          text-3xl
          font-bold
          mb-6
        "
      >
        Check-In
      </h1>

      <AppointmentTable
        appointments={
          scheduledAppointments
        }
        actionLabel="Check-In"
        onAction={(appointment) => {

          setSelectedAppointment(
            appointment
          );

          setSelectedTruckId(
            ""
          );
          setSelectedDriverId("");

        }}
      />

      {selectedAppointment && (

        <div
          className="
            fixed
            inset-0
            bg-black/40
            flex
            items-center
            justify-center
            z-50
          "
        >

          <div
            className="
              bg-white
              rounded-xl
              p-6
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
              Realizar Check-In
            </h2>

            <div className="space-y-3">

              <div>

                <strong>
                  Proveedor:
                </strong>{" "}

                {
                  selectedAppointment
                    .supplier?.name
                }

              </div>

              <div>

                <strong>
                  Operación:
                </strong>{" "}

                {
                  selectedAppointment
                    .operationType
                }

              </div>

              <div>

                <strong>
                  Vehículo:
                </strong>{" "}

                {
                  selectedAppointment
                    .vehicleType?.name
                }

              </div>

              <div>

                <strong>
                  Dock Group:
                </strong>{" "}

                {
                  selectedAppointment
                    .dockGroup?.code
                }

              </div>

              <div>

                <strong>
                  Hora:
                </strong>{" "}

                {new Date(
                  selectedAppointment.startTime
                ).toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit"
                  }
                )}

              </div>

              <div>

                <strong>
                  Camión:
                </strong>

                <select
                  value={
                    selectedTruckId
                  }
                  onChange={(e) =>
                    setSelectedTruckId(
                      e.target.value
                    )
                  }
                  className="
                    block
                    w-full
                    mt-2
                    border
                    rounded-lg
                    px-3
                    py-2
                  "
                >

                  <option value="">
                    Seleccionar camión
                  </option>

                  {trucks.map(
                    (truck) => (

                      <option
                        key={truck.id}
                        value={truck.id}
                      >
                        {truck.plate}
                      </option>

                    )
                  )}

                </select>
<strong>
  Chofer:
</strong>

<select
  value={selectedDriverId}
  onChange={(e) =>
    setSelectedDriverId(
      e.target.value
    )
  }
  className="
    block
    w-full
    mt-2
    border
    rounded-lg
    px-3
    py-2
  "
>

  <option value="">
    Seleccionar chofer
  </option>

  {drivers.map(
    (driver) => (

      <option
        key={driver.id}
        value={driver.id}
      >
        {driver.firstName}{" "}
        {driver.lastName}
      </option>

    )
  )}

</select>

              </div>

            </div>

            <div
              className="
                mt-6
                flex
                justify-end
                gap-2
              "
            >

              <button
                onClick={() =>
                  setSelectedAppointment(
                    null
                  )
                }
                className="
                  border
                  px-4
                  py-2
                  rounded-lg
                "
              >
                Cancelar
              </button>

              <button
                disabled={
                  !selectedTruckId ||!selectedDriverId
                }
                onClick={
                  handleCheckIn
                }
                className="
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  px-4
                  py-2
                  rounded-lg
                  disabled:bg-slate-300
                "
              >
                Confirmar Check-In
              </button>

            </div>

          </div>

        </div>

      )}

    </MainLayout>

  );

}