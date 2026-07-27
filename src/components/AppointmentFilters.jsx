export default function AppointmentFilters() {

  return (
    <div
      className="
        bg-white
        border
        rounded-xl
        shadow-sm
        p-4
        mb-6
      "
    >

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-4
        "
      >

        <input
          type="text"
          placeholder="Proveedor"
          className="
            border
            rounded-lg
            px-3
            py-2
          "
        />

        <input
          type="date"
          className="
            border
            rounded-lg
            px-3
            py-2
          "
        />

        <select
          className="
            border
            rounded-lg
            px-3
            py-2
          "
        >
          <option value="">
            Todos los estados
          </option>

          <option value="SCHEDULED">
            SCHEDULED
          </option>

          <option value="WAITING_DOCK">
            WAITING_DOCK
          </option>

          <option value="IN_OPERATION">
            IN_OPERATION
          </option>

          <option value="COMPLETED">
            COMPLETED
          </option>

          <option value="CANCELLED">
            CANCELLED
          </option>
        </select>

      </div>

    </div>
  );

}