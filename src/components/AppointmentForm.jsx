import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import {
  getSuppliers,
  getVehicleTypes,
  getWarehouses,
  getDockGroups,
  getAvailability
} from "../services/catalogService";

import { OPERATION_TYPE_OPTIONS } from "../utils/operationType";
import { getBuenosAiresToday } from "../utils/buenosAiresTime";

export default function AppointmentForm({
  onSubmit
}) {

  const { user } = useAuth();

  const isSupplier =
    user?.role === "SUPPLIER";

  const [suppliers, setSuppliers] =
    useState([]);

  const [vehicleTypes, setVehicleTypes] =
    useState([]);

  const [warehouses, setWarehouses] =
    useState([]);

  const [dockGroups, setDockGroups] =
    useState([]);

  const [availableSlots,
    setAvailableSlots] =
    useState([]);

  const [formError, setFormError] =
    useState("");

const [form, setForm] =
  useState({
    supplierId: "",
    vehicleTypeId: "",
    warehouseId: "",
    dockGroupId: "",
    operationType: "",
    date: "",
    startTime: ""
  });

  useEffect(() => {
    loadCatalogs();
  }, []);

  useEffect(() => {

    if (
      !form.dockGroupId ||
      !form.vehicleTypeId ||
      !form.operationType ||
      !form.date
    ) {

      setAvailableSlots([]);

      return;

    }

    loadAvailability();

  }, [
    form.dockGroupId,
    form.vehicleTypeId,
    form.operationType,
    form.date
  ]);

  const loadCatalogs = async () => {

    try {

      const [
        suppliersData,
        vehicleTypesData,
        warehousesData,
        dockGroupsData
      ] = await Promise.all([
        getSuppliers(),
        getVehicleTypes(),
        getWarehouses(),
        getDockGroups()
      ]);

      setSuppliers(
        suppliersData
      );

      setVehicleTypes(
        vehicleTypesData
      );

      setWarehouses(
        warehousesData
      );

      setDockGroups(
        dockGroupsData
      );

    } catch (error) {

      console.error(
        "Error loading catalogs",
        error
      );

    }

  };

  const loadAvailability =
    async () => {

      try {

        const slots =
          await getAvailability(
            form.dockGroupId,
            form.vehicleTypeId,
            form.operationType,
            form.date
          );

        setAvailableSlots(
          slots
        );

      } catch (error) {

        console.error(
          "Error loading availability",
          error
        );

      }

    };

 const handleChange = (
  e
) => {

  setFormError("");

  setForm({
    ...form,
    [e.target.name]:
      e.target.value
  });

};

  const requiredFields = [
    {
      key: "supplierId",
      label: "Proveedor",
      // El proveedor se completa automáticamente para usuarios SUPPLIER
      skip: isSupplier
    },
    { key: "vehicleTypeId", label: "Tipo de vehículo" },
    { key: "warehouseId", label: "Warehouse" },
    { key: "operationType", label: "Tipo de operación" },
    { key: "dockGroupId", label: "Tipo de dock" },
    { key: "date", label: "Fecha" },
    { key: "startTime", label: "Horario (elegí un slot disponible)" }
  ];

  const handleSubmit = (
    e
  ) => {

    e.preventDefault();

    const missing = requiredFields
      .filter(
        (field) =>
          !field.skip && !form[field.key]
      )
      .map((field) => field.label);

    if (missing.length > 0) {

      setFormError(
        `Faltan completar los siguientes campos: ${missing.join(", ")}`
      );

      return;

    }

    setFormError("");

    onSubmit(form);

  };

  return (
    <div
      className="
        bg-white
        border
        rounded-xl
        shadow-sm
        p-6
        mb-6
      "
    >

      <h2
        className="
          text-lg
          font-semibold
          mb-4
        "
      >
        Nuevo Turno
      </h2>

      {formError && (

        <div
          className="
            mb-4
            rounded-lg
            border
            border-red-200
            bg-red-50
            px-3
            py-2
            text-sm
            text-red-700
          "
        >
          {formError}
        </div>

      )}

      <form
        onSubmit={handleSubmit}
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-4
        "
      >

        {isSupplier ? (

          <div
            className="
              border
              rounded-lg
              px-3
              py-2
              bg-slate-50
              text-slate-700
            "
          >
            {user.email}
          </div>

        ) : (

          <select
            name="supplierId"
            value={form.supplierId}
            onChange={handleChange}
            className="
              border
              rounded-lg
              px-3
              py-2
            "
          >
            <option value="">
              Seleccionar proveedor
            </option>

            {suppliers.map(
              (supplier) => (
                <option
                  key={supplier.id}
                  value={supplier.id}
                >
                  {supplier.name}
                </option>
              )
            )}

          </select>

        )}

        <select
          name="vehicleTypeId"
          value={form.vehicleTypeId}
          onChange={handleChange}
          className="
            border
            rounded-lg
            px-3
            py-2
          "
        >
          <option value="">
            Tipo de vehículo
          </option>

          {vehicleTypes.map(
            (vehicleType) => (
              <option
                key={vehicleType.id}
                value={vehicleType.id}
              >
                {vehicleType.name}
              </option>
            )
          )}
        </select>

        <select
          name="warehouseId"
          value={form.warehouseId}
          onChange={handleChange}
          className="
            border
            rounded-lg
            px-3
            py-2
          "
        >
          <option value="">
            Seleccione warehouse
          </option>

          {warehouses.map(
            (warehouse) => (
              <option
                key={warehouse.id}
                value={warehouse.id}
              >
                {warehouse.name}
              </option>
            )
          )}
        </select>

        <select
          name="operationType"
          value={form.operationType}
          onChange={handleChange}
          className="
            border
            rounded-lg
            px-3
            py-2
          "
        >
          <option value="">
            Seleccione tipo de operación
          </option>

          {OPERATION_TYPE_OPTIONS.map(
            (option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            )
          )}
        </select>

        <select
          name="dockGroupId"
          value={form.dockGroupId}
          onChange={handleChange}
          className="
            border
            rounded-lg
            px-3
            py-2
          "
        >
          <option value="">
            Seleccione tipo de dock
          </option>

          {dockGroups.map(
            (group) => (
              <option
                key={group.id}
                value={group.id}
              >
                {group.name}
              </option>
            )
          )}
        </select>

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          min={getBuenosAiresToday()}
          className="
            border
            rounded-lg
            px-3
            py-2
          "
        />

        <div className="md:col-span-2">

          <h3
            className="
              font-medium
              mb-3
            "
          >
            Slots disponibles
          </h3>

          <div
            className="
              grid
              grid-cols-2
              md:grid-cols-4
              gap-2
            "
          >

            {availableSlots.map(
              (slot) => {

                const selected =
                  form.startTime ===
                  slot.time;

                return (

                  <button
                    key={slot.time}
                    type="button"
                    disabled={
                      slot.available <= 0
                    }
                    onClick={() =>
                      setForm({
                        ...form,
                        startTime:
                          slot.time
                      })
                    }
                    className={`
                      p-3
                      rounded-lg
                      border
                      text-sm
                      transition

                      ${
                        selected
                          ? "bg-blue-600 text-white"
                          : slot.available > 0
                          ? "bg-green-50 hover:bg-green-100"
                          : "bg-red-50 text-red-400 cursor-not-allowed"
                      }
                    `}
                  >

                    <div className="font-medium">

                      {new Date(
                        slot.time
                      ).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZone:
                            "America/Argentina/Buenos_Aires"
                        }
                      )}

                    </div>

                    <div>
                      Disp: {slot.available}
                    </div>

                  </button>

                );

              }
            )}

            {availableSlots.length === 0 && (

              <div
                className="
                  col-span-full
                  text-slate-500
                "
              >
                Seleccionar vehículo, tipo de
                operación, tipo de dock y fecha
                para consultar disponibilidad.
              </div>

            )}

          </div>

        </div>

        <div className="md:col-span-2">

          <button
            type="submit"
            className="
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-4
              py-2
              rounded-lg
            "
          >
            Reservar Turno
          </button>

        </div>

      </form>

    </div>
  );

}