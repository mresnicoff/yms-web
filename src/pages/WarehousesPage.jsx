import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import {
  getWarehousesAdmin,
  createWarehouse,
  updateWarehouse,
  createDockGroup,
  updateDockGroup,
  createDock,
  createDocksBulk,
  updateDock
} from "../services/warehouseAdminService";

import {
  WEEKDAY_LABELS,
  defaultWeeklySchedules
} from "../utils/weekdays";

const ASSIGNMENT_MODE_OPTIONS = [
  { value: "AUTO", label: "Automático" },
  { value: "MANUAL", label: "Manual" }
];

function WeeklyScheduleEditor({ schedules, onChange }) {

  const updateDay = (weekday, patch) => {

    onChange(
      schedules.map((day) =>
        day.weekday === weekday ? { ...day, ...patch } : day
      )
    );

  };

  return (
    <div className="border rounded-lg divide-y">

      {schedules
        .slice()
        .sort((a, b) => a.weekday - b.weekday)
        .map((day) => (

          <div
            key={day.weekday}
            className="flex items-center gap-3 p-2 flex-wrap"
          >

            <div className="w-24 font-medium text-sm">
              {WEEKDAY_LABELS[day.weekday]}
            </div>

            <label className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={day.closed}
                onChange={(e) =>
                  updateDay(day.weekday, { closed: e.target.checked })
                }
              />
              Cerrado
            </label>

            {!day.closed && (
              <>
                <input
                  type="time"
                  value={day.startTime || ""}
                  onChange={(e) =>
                    updateDay(day.weekday, { startTime: e.target.value })
                  }
                  className="border rounded-lg px-2 py-1 text-sm"
                />

                <span className="text-sm">a</span>

                <input
                  type="time"
                  value={day.endTime || ""}
                  onChange={(e) =>
                    updateDay(day.weekday, { endTime: e.target.value })
                  }
                  className="border rounded-lg px-2 py-1 text-sm"
                />
              </>
            )}

          </div>

        ))}

    </div>
  );

}

export default function WarehousesPage() {

  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [warehouseModal, setWarehouseModal] = useState(null);
  // { mode: "create" } | { mode: "edit", warehouse }

  const [warehouseForm, setWarehouseForm] = useState({
    code: "",
    name: "",
    address: "",
    active: true
  });

  const [dockGroupModal, setDockGroupModal] = useState(null);
  // { mode: "create", warehouseId } | { mode: "edit", dockGroup }

  const [dockGroupForm, setDockGroupForm] = useState({
    code: "",
    name: "",
    description: "",
    assignmentMode: "AUTO",
    active: true,
    schedules: defaultWeeklySchedules()
  });

  const [docksModalGroup, setDocksModalGroup] = useState(null);

  const [newDockForm, setNewDockForm] = useState({
    code: "",
    description: ""
  });

  const [bulkDockForm, setBulkDockForm] = useState({
    prefix: "",
    quantity: "",
    startNumber: "1"
  });

  const [editingDockId, setEditingDockId] = useState(null);
  const [editDockForm, setEditDockForm] = useState({
    code: "",
    description: ""
  });

  useEffect(() => {

    loadData();

  }, []);

  const loadData = async () => {

    try {

      const data = await getWarehousesAdmin();

      setWarehouses(data);

      // Si el modal de docks está abierto, lo refrescamos con los datos
      // nuevos (docks recién creados/editados) en vez de dejarlo stale.
      setDocksModalGroup((prev) => {

        if (!prev) return prev;

        const warehouse = data.find((w) =>
          w.dockGroups.some((g) => g.id === prev.id)
        );

        return warehouse?.dockGroups.find((g) => g.id === prev.id) || null;

      });

    } catch (error) {

      console.error("Error loading warehouses", error);

    } finally {

      setLoading(false);

    }

  };

  // --- Warehouse modal ---

  const openCreateWarehouse = () => {

    setWarehouseForm({ code: "", name: "", address: "", active: true });
    setWarehouseModal({ mode: "create" });

  };

  const openEditWarehouse = (warehouse) => {

    setWarehouseForm({
      code: warehouse.code,
      name: warehouse.name,
      address: warehouse.address || "",
      active: warehouse.active
    });

    setWarehouseModal({ mode: "edit", warehouse });

  };

  const handleWarehouseFormChange = (e) => {

    const { name, value, type, checked } = e.target;

    setWarehouseForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

  };

  const handleWarehouseSubmit = async (e) => {

    e.preventDefault();

    if (!warehouseForm.code.trim() || !warehouseForm.name.trim()) {

      alert("Completá código y nombre del depósito.");

      return;

    }

    try {

      if (warehouseModal.mode === "create") {

        await createWarehouse({
          code: warehouseForm.code.trim(),
          name: warehouseForm.name.trim(),
          address: warehouseForm.address.trim() || undefined
        });

      } else {

        await updateWarehouse(warehouseModal.warehouse.id, {
          code: warehouseForm.code.trim(),
          name: warehouseForm.name.trim(),
          address: warehouseForm.address.trim(),
          active: warehouseForm.active
        });

      }

      setWarehouseModal(null);

      await loadData();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Error al guardar el depósito."
      );

    }

  };

  // --- Dock group modal ---

  const openCreateDockGroup = (warehouseId) => {

    setDockGroupForm({
      code: "",
      name: "",
      description: "",
      assignmentMode: "AUTO",
      active: true,
      schedules: defaultWeeklySchedules()
    });

    setDockGroupModal({ mode: "create", warehouseId });

  };

  const openEditDockGroup = (dockGroup) => {

    setDockGroupForm({
      code: dockGroup.code,
      name: dockGroup.name,
      description: dockGroup.description || "",
      assignmentMode: dockGroup.assignmentMode,
      active: dockGroup.active,
      schedules:
        dockGroup.schedules && dockGroup.schedules.length === 7
          ? dockGroup.schedules.map((s) => ({
              weekday: s.weekday,
              closed: s.closed,
              startTime: s.startTime || "08:00",
              endTime: s.endTime || "17:00"
            }))
          : defaultWeeklySchedules()
    });

    setDockGroupModal({ mode: "edit", dockGroup });

  };

  const handleDockGroupFormChange = (e) => {

    const { name, value, type, checked } = e.target;

    setDockGroupForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

  };

  const handleDockGroupSubmit = async (e) => {

    e.preventDefault();

    if (!dockGroupForm.code.trim() || !dockGroupForm.name.trim()) {

      alert("Completá código y nombre del dock group.");

      return;

    }

    const payload = {
      code: dockGroupForm.code.trim(),
      name: dockGroupForm.name.trim(),
      description: dockGroupForm.description.trim(),
      assignmentMode: dockGroupForm.assignmentMode,
      schedules: dockGroupForm.schedules
    };

    try {

      if (dockGroupModal.mode === "create") {

        await createDockGroup({
          ...payload,
          warehouseId: dockGroupModal.warehouseId
        });

      } else {

        await updateDockGroup(dockGroupModal.dockGroup.id, {
          ...payload,
          active: dockGroupForm.active
        });

      }

      setDockGroupModal(null);

      await loadData();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Error al guardar el dock group."
      );

    }

  };

  // --- Docks modal ---

  const openDocksModal = (dockGroup) => {

    setDocksModalGroup(dockGroup);
    setNewDockForm({ code: "", description: "" });
    setBulkDockForm({ prefix: dockGroup.code || "", quantity: "", startNumber: "1" });
    setEditingDockId(null);

  };

  const handleAddDock = async (e) => {

    e.preventDefault();

    if (!newDockForm.code.trim()) {

      alert("Completá el código del dock.");

      return;

    }

    try {

      await createDock({
        groupId: docksModalGroup.id,
        code: newDockForm.code.trim(),
        description: newDockForm.description.trim() || undefined
      });

      setNewDockForm({ code: "", description: "" });

      await loadData();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Error al crear el dock."
      );

    }

  };

  const handleAddDocksBulk = async (e) => {

    e.preventDefault();

    if (!bulkDockForm.prefix.trim() || !bulkDockForm.quantity) {

      alert("Completá prefijo y cantidad.");

      return;

    }

    try {

      await createDocksBulk({
        groupId: docksModalGroup.id,
        prefix: bulkDockForm.prefix.trim(),
        quantity: Number(bulkDockForm.quantity),
        startNumber: Number(bulkDockForm.startNumber) || 1
      });

      setBulkDockForm({ prefix: docksModalGroup.code || "", quantity: "", startNumber: "1" });

      await loadData();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Error al crear los docks."
      );

    }

  };

  const startEditDock = (dock) => {

    setEditingDockId(dock.id);

    setEditDockForm({
      code: dock.code,
      description: dock.description || ""
    });

  };

  const handleSaveDock = async (dockId) => {

    try {

      await updateDock(dockId, {
        code: editDockForm.code.trim(),
        description: editDockForm.description.trim()
      });

      setEditingDockId(null);

      await loadData();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Error al actualizar el dock."
      );

    }

  };

  const handleToggleDockActive = async (dock) => {

    try {

      await updateDock(dock.id, { active: !dock.active });

      await loadData();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Error al actualizar el dock."
      );

    }

  };

  const formatSchedule = (schedules) => {

    if (!schedules || schedules.length === 0) return "Sin horario configurado";

    const sorted = schedules.slice().sort((a, b) => a.weekday - b.weekday);

    const allSame =
      sorted.every((s) => !s.closed) &&
      new Set(sorted.map((s) => `${s.startTime}-${s.endTime}`)).size === 1;

    if (allSame) {
      return `Todos los días ${sorted[0].startTime} a ${sorted[0].endTime}`;
    }

    return sorted
      .map((s) =>
        s.closed
          ? `${WEEKDAY_LABELS[s.weekday]}: cerrado`
          : `${WEEKDAY_LABELS[s.weekday]}: ${s.startTime}-${s.endTime}`
      )
      .join(" · ");

  };

  return (
    <MainLayout>

      <div className="flex items-center justify-between mb-6">

        <h1 className="text-3xl font-bold">
          Warehouses
        </h1>

        <button
          onClick={openCreateWarehouse}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Nuevo warehouse
        </button>

      </div>

      {loading ? (

        <div className="bg-white border rounded-xl p-6">
          Cargando...
        </div>

      ) : (

        <div className="flex flex-col gap-6">

          {warehouses.map((warehouse) => (

            <div
              key={warehouse.id}
              className="bg-white border rounded-xl p-6"
            >

              <div className="flex items-start justify-between flex-wrap gap-2">

                <div>

                  <div className="flex items-center gap-2">

                    <h2 className="text-xl font-semibold">
                      {warehouse.name}
                    </h2>

                    <span className="text-sm text-slate-500">
                      ({warehouse.code})
                    </span>

                    {!warehouse.active && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                        Inactivo
                      </span>
                    )}

                  </div>

                  {warehouse.address && (
                    <div className="text-sm text-slate-500">
                      {warehouse.address}
                    </div>
                  )}

                </div>

                <div className="flex gap-2">

                  <button
                    onClick={() => openEditWarehouse(warehouse)}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1 rounded-lg text-sm"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => openCreateDockGroup(warehouse.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    + Dock group
                  </button>

                </div>

              </div>

              <div className="mt-4 flex flex-col gap-3">

                {warehouse.dockGroups.length === 0 && (

                  <div className="text-sm text-slate-500">
                    Este warehouse todavía no tiene dock groups.
                  </div>

                )}

                {warehouse.dockGroups.map((dockGroup) => (

                  <div
                    key={dockGroup.id}
                    className="border rounded-lg p-4"
                  >

                    <div className="flex items-start justify-between flex-wrap gap-2">

                      <div>

                        <div className="flex items-center gap-2">

                          <span className="font-medium">
                            {dockGroup.name}
                          </span>

                          <span className="text-sm text-slate-500">
                            ({dockGroup.code})
                          </span>

                          <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                            {dockGroup.assignmentMode === "AUTO" ? "Automático" : "Manual"}
                          </span>

                          {!dockGroup.active && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                              Inactivo
                            </span>
                          )}

                        </div>

                        {dockGroup.description && (
                          <div className="text-sm text-slate-500 mt-1">
                            {dockGroup.description}
                          </div>
                        )}

                        <div className="text-sm text-slate-500 mt-1">
                          {dockGroup.docks.filter((d) => d.active).length} docks activos
                          {" "}({dockGroup.docks.length} en total)
                        </div>

                        <div className="text-sm text-slate-500 mt-1">
                          Horario: {formatSchedule(dockGroup.schedules)}
                        </div>

                      </div>

                      <div className="flex gap-2">

                        <button
                          onClick={() => openDocksModal(dockGroup)}
                          className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1 rounded-lg text-sm"
                        >
                          Docks
                        </button>

                        <button
                          onClick={() => openEditDockGroup(dockGroup)}
                          className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1 rounded-lg text-sm"
                        >
                          Editar
                        </button>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          ))}

        </div>

      )}

      {warehouseModal && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">

            <h2 className="text-xl font-bold mb-4">
              {warehouseModal.mode === "create" ? "Nuevo warehouse" : "Editar warehouse"}
            </h2>

            <form onSubmit={handleWarehouseSubmit} className="flex flex-col gap-3">

              <input
                name="code"
                placeholder="Código"
                value={warehouseForm.code}
                onChange={handleWarehouseFormChange}
                className="border rounded-lg px-3 py-2"
              />

              <input
                name="name"
                placeholder="Nombre"
                value={warehouseForm.name}
                onChange={handleWarehouseFormChange}
                className="border rounded-lg px-3 py-2"
              />

              <input
                name="address"
                placeholder="Dirección (opcional)"
                value={warehouseForm.address}
                onChange={handleWarehouseFormChange}
                className="border rounded-lg px-3 py-2"
              />

              {warehouseModal.mode === "edit" && (

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="active"
                    checked={warehouseForm.active}
                    onChange={handleWarehouseFormChange}
                  />
                  Activo
                </label>

              )}

              <div className="flex justify-end gap-2 mt-2">

                <button
                  type="button"
                  onClick={() => setWarehouseModal(null)}
                  className="px-4 py-2 rounded-lg"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Guardar
                </button>

              </div>

            </form>

          </div>
        </div>

      )}

      {dockGroupModal && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full my-8">

            <h2 className="text-xl font-bold mb-4">
              {dockGroupModal.mode === "create" ? "Nuevo dock group" : "Editar dock group"}
            </h2>

            <form onSubmit={handleDockGroupSubmit} className="flex flex-col gap-3">

              <input
                name="code"
                placeholder="Código"
                value={dockGroupForm.code}
                onChange={handleDockGroupFormChange}
                className="border rounded-lg px-3 py-2"
              />

              <input
                name="name"
                placeholder="Nombre"
                value={dockGroupForm.name}
                onChange={handleDockGroupFormChange}
                className="border rounded-lg px-3 py-2"
              />

              <input
                name="description"
                placeholder="Descripción (opcional)"
                value={dockGroupForm.description}
                onChange={handleDockGroupFormChange}
                className="border rounded-lg px-3 py-2"
              />

              <select
                name="assignmentMode"
                value={dockGroupForm.assignmentMode}
                onChange={handleDockGroupFormChange}
                className="border rounded-lg px-3 py-2"
              >

                {ASSIGNMENT_MODE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}

              </select>

              {dockGroupModal.mode === "edit" && (

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="active"
                    checked={dockGroupForm.active}
                    onChange={handleDockGroupFormChange}
                  />
                  Activo
                </label>

              )}

              <div>

                <div className="font-medium text-sm mb-2">
                  Horario de atención
                </div>

                <WeeklyScheduleEditor
                  schedules={dockGroupForm.schedules}
                  onChange={(schedules) =>
                    setDockGroupForm((prev) => ({ ...prev, schedules }))
                  }
                />

              </div>

              <div className="flex justify-end gap-2 mt-2">

                <button
                  type="button"
                  onClick={() => setDockGroupModal(null)}
                  className="px-4 py-2 rounded-lg"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Guardar
                </button>

              </div>

            </form>

          </div>
        </div>

      )}

      {docksModalGroup && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full my-8">

            <div className="flex items-center justify-between mb-4">

              <h2 className="text-xl font-bold">
                Docks de {docksModalGroup.name}
              </h2>

              <button
                onClick={() => setDocksModalGroup(null)}
                className="px-3 py-1 rounded-lg"
              >
                Cerrar
              </button>

            </div>

            <div className="border rounded-lg overflow-hidden mb-4 max-h-64 overflow-y-auto">

              <table className="w-full text-sm">

                <thead className="bg-slate-50 sticky top-0">
                  <tr>
                    <th className="text-left p-2">Código</th>
                    <th className="text-left p-2">Descripción</th>
                    <th className="text-left p-2">Estado</th>
                    <th className="text-left p-2">Activo</th>
                    <th className="text-left p-2">Acción</th>
                  </tr>
                </thead>

                <tbody>

                  {docksModalGroup.docks.map((dock) => (

                    <tr key={dock.id} className="border-t">

                      {editingDockId === dock.id ? (

                        <>
                          <td className="p-2">
                            <input
                              value={editDockForm.code}
                              onChange={(e) =>
                                setEditDockForm((prev) => ({ ...prev, code: e.target.value }))
                              }
                              className="border rounded px-2 py-1 w-24"
                            />
                          </td>

                          <td className="p-2">
                            <input
                              value={editDockForm.description}
                              onChange={(e) =>
                                setEditDockForm((prev) => ({ ...prev, description: e.target.value }))
                              }
                              className="border rounded px-2 py-1 w-full"
                            />
                          </td>

                          <td className="p-2">{dock.status}</td>

                          <td className="p-2">{dock.active ? "Sí" : "No"}</td>

                          <td className="p-2 flex gap-2">
                            <button
                              onClick={() => handleSaveDock(dock.id)}
                              className="text-blue-600"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={() => setEditingDockId(null)}
                              className="text-slate-500"
                            >
                              Cancelar
                            </button>
                          </td>
                        </>

                      ) : (

                        <>
                          <td className="p-2">{dock.code}</td>
                          <td className="p-2">{dock.description || "-"}</td>
                          <td className="p-2">{dock.status}</td>
                          <td className="p-2">{dock.active ? "Sí" : "No"}</td>
                          <td className="p-2 flex gap-2">
                            <button
                              onClick={() => startEditDock(dock)}
                              className="text-blue-600"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleToggleDockActive(dock)}
                              className={dock.active ? "text-red-600" : "text-green-600"}
                            >
                              {dock.active ? "Desactivar" : "Activar"}
                            </button>
                          </td>
                        </>

                      )}

                    </tr>

                  ))}

                  {docksModalGroup.docks.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-slate-500">
                        Todavía no hay docks en este dock group.
                      </td>
                    </tr>
                  )}

                </tbody>

              </table>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <form onSubmit={handleAddDock} className="border rounded-lg p-3">

                <div className="font-medium text-sm mb-2">Agregar un dock</div>

                <div className="flex gap-2 flex-wrap">

                  <input
                    placeholder="Código"
                    value={newDockForm.code}
                    onChange={(e) =>
                      setNewDockForm((prev) => ({ ...prev, code: e.target.value }))
                    }
                    className="border rounded-lg px-2 py-1 text-sm w-24"
                  />

                  <input
                    placeholder="Descripción (opcional)"
                    value={newDockForm.description}
                    onChange={(e) =>
                      setNewDockForm((prev) => ({ ...prev, description: e.target.value }))
                    }
                    className="border rounded-lg px-2 py-1 text-sm flex-1"
                  />

                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    Agregar
                  </button>

                </div>

              </form>

              <form onSubmit={handleAddDocksBulk} className="border rounded-lg p-3">

                <div className="font-medium text-sm mb-2">Agregar varios</div>

                <div className="flex gap-2 flex-wrap">

                  <input
                    placeholder="Prefijo (ej. D)"
                    value={bulkDockForm.prefix}
                    onChange={(e) =>
                      setBulkDockForm((prev) => ({ ...prev, prefix: e.target.value }))
                    }
                    className="border rounded-lg px-2 py-1 text-sm w-24"
                  />

                  <input
                    type="number"
                    min="1"
                    placeholder="Desde nro."
                    value={bulkDockForm.startNumber}
                    onChange={(e) =>
                      setBulkDockForm((prev) => ({ ...prev, startNumber: e.target.value }))
                    }
                    className="border rounded-lg px-2 py-1 text-sm w-24"
                  />

                  <input
                    type="number"
                    min="1"
                    placeholder="Cantidad"
                    value={bulkDockForm.quantity}
                    onChange={(e) =>
                      setBulkDockForm((prev) => ({ ...prev, quantity: e.target.value }))
                    }
                    className="border rounded-lg px-2 py-1 text-sm w-24"
                  />

                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    Crear
                  </button>

                </div>

                <div className="text-xs text-slate-500 mt-1">
                  Genera códigos {bulkDockForm.prefix || "PREFIJO"}
                  {String(bulkDockForm.startNumber || 1).padStart(2, "0")}, {bulkDockForm.prefix || "PREFIJO"}
                  {String((Number(bulkDockForm.startNumber) || 1) + 1).padStart(2, "0")}, etc.
                </div>

              </form>

            </div>

          </div>
        </div>

      )}

    </MainLayout>
  );

}
