import {
  useEffect,
  useState
} from "react";

import MainLayout
  from "../layouts/MainLayout";

import {
  getDrivers,
  createDriver
} from "../services/driverService";

export default function DriversPage() {

  const [
    drivers,
    setDrivers
  ] = useState([]);

  const [form, setForm] =
    useState({
      firstName: "",
      lastName: "",
      phone: "",
      licenseNumber: ""
    });

  useEffect(() => {

    loadDrivers();

  }, []);

  const loadDrivers =
    async () => {

      const data =
        await getDrivers();

      setDrivers(data);

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

      e.preventDefault();

      await createDriver(form);

      setForm({
        firstName: "",
        lastName: "",
        phone: "",
        licenseNumber: ""
      });

      await loadDrivers();

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
        Drivers
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
          flex-wrap
        "
      >

        <input
          name="firstName"
          placeholder="Nombre"
          value={form.firstName}
          onChange={handleChange}
          className="
            border
            rounded-lg
            px-3
            py-2
          "
        />

        <input
          name="lastName"
          placeholder="Apellido"
          value={form.lastName}
          onChange={handleChange}
          className="
            border
            rounded-lg
            px-3
            py-2
          "
        />

        <input
          name="phone"
          placeholder="WhatsApp"
          value={form.phone}
          onChange={handleChange}
          className="
            border
            rounded-lg
            px-3
            py-2
          "
        />

        <input
          name="licenseNumber"
          placeholder="Licencia"
          value={form.licenseNumber}
          onChange={handleChange}
          className="
            border
            rounded-lg
            px-3
            py-2
          "
        />

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
                Nombre
              </th>

              <th className="p-4 text-left">
                Teléfono
              </th>

              <th className="p-4 text-left">
                Licencia
              </th>

            </tr>

          </thead>

          <tbody>

            {drivers.map(
              (driver) => (

                <tr
                  key={driver.id}
                  className="border-t"
                >

                  <td className="p-4">

                    {
                      driver.firstName
                    } {
                      driver.lastName
                    }

                  </td>

                  <td className="p-4">
                    {driver.phone}
                  </td>

                  <td className="p-4">
                    {
                      driver.licenseNumber
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