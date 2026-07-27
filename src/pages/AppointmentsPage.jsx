import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import AppointmentForm from "../components/AppointmentForm";
import AppointmentFilters from "../components/AppointmentFilters";
import AppointmentTable from "../components/AppointmentTable";

import {
  getAppointments,
  createAppointment
} from "../services/appointmentService";

export default function AppointmentsPage() {

  const [appointments, setAppointments] =
    useState([]);
  const [formKey, setFormKey] =useState(0);

  const [loading, setLoading] =
    useState(true);

  const loadAppointments = async () => {

    try {

      const data =
        await getAppointments();

      setAppointments(data);

    } catch (error) {

      console.error(
        "Error loading appointments",
        error
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadAppointments();

  }, []);

 const handleCreate = async (
  form
) => {

  try {

    await createAppointment(form);

    alert(
      "✅ Turno reservado correctamente"
    );

    await loadAppointments();

    setFormKey(
      previous => previous + 1
    );

  } catch (error) {

    alert(
      error.response?.data?.message ||
      "Error al reservar turno"
    );

  }

};

  return (
    <MainLayout>

      <div
        className="
          flex
          items-center
          justify-between
          mb-6
        "
      >

        <h1
          className="
            text-3xl
            font-bold
          "
        >
          Appointments
        </h1>

      </div>

<AppointmentForm
  key={formKey}
  onSubmit={handleCreate}
/>

      <AppointmentFilters />

      {loading ? (

        <div
          className="
            bg-white
            border
            rounded-xl
            p-6
          "
        >
          Cargando...
        </div>

      ) : (

        <AppointmentTable
          appointments={appointments}
        />

      )}

    </MainLayout>
  );

}