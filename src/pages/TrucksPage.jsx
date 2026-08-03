import {
  useEffect,
  useState
} from "react";
import { useAuth }
  from "../context/AuthContext";

import MainLayout
  from "../layouts/MainLayout";

import {
  getVehicleTypes
} from "../services/catalogService";

import {
  getTrucks,
  createTruck
} from "../services/truckService";

export default function TrucksPage() {
    const { user } = useAuth();

  const [
    trucks,
    setTrucks
  ] = useState([]);

  const [
    vehicleTypes,
    setVehicleTypes
  ] = useState([]);

  const [form, setForm] =
    useState({
      plate: "",
      vehicleTypeId: ""
    });

  useEffect(() => {

    loadData();
console.log(user);

  }, []);

  const loadData =
    async () => {

      const [
        trucksData,
        vehicleTypesData
      ] = await Promise.all([
        getTrucks(),
        getVehicleTypes()
      ]);

      setTrucks(
        trucksData
      );

      setVehicleTypes(
        vehicleTypesData
      );

    };

  const handleChange =
    (e) => {

      setForm({
        ...form,
        [e.target.name]:
          e.target.value
      });

    };

  const handleSubmit =
    async (e) => {
if (!form.vehicleTypeId) {

  alert(
    "Debe seleccionar un tipo de vehículo."
  );

  return;

}

      e.preventDefault();

      await createTruck(
        form
      );

      setForm({
        plate: "",
        vehicleTypeId: ""
      });

      await loadData();

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
        Trucks
      </h1>

      <form
        onSubmit={handleSubmit}
        className="
          bg-white
          border
          rounded-xl
          p-6
          mb-6
          flex
          gap-4
        "
      >

        <input
          name="plate"
          placeholder="Patente"
          value={form.plate}
          onChange={
            handleChange
          }
          className="
            border
            rounded-lg
            px-3
            py-2
          "
        />

        <select
          name="vehicleTypeId"
          value={
            form.vehicleTypeId
          }
          onChange={
            handleChange
          }
          className="
            border
            rounded-lg
            px-3
            py-2
          "
        >

          <option value="">
            Tipo Vehículo
          </option>

          {vehicleTypes.map(
            (vehicleType) => (
              <option
                key={
                  vehicleType.id
                }
                value={
                  vehicleType.id
                }
              >
                {
                  vehicleType.name
                }
              </option>
            )
          )}

        </select>

        <button
          type="submit"
          className="
            bg-blue-600
            text-white
            px-4
            py-2
            rounded-lg
          "
        >
          Crear
        </button>

      </form>

      <div
        className="
          bg-white
          border
          rounded-xl
          overflow-hidden
        "
      >

        <table className="w-full">

          <thead>

            <tr>

              <th className="p-4 text-left">
                Patente
              </th>

              <th className="p-4 text-left">
                Tipo
              </th>

            </tr>

          </thead>

          <tbody>

            {trucks.map(
              (truck) => (

                <tr
                  key={truck.id}
                  className="border-t"
                >

                  <td className="p-4">
                    {truck.plate}
                  </td>

                  <td className="p-4">
                    {
                      truck
                        .vehicleType
                        ?.name
                    }
                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </MainLayout>

  );

}