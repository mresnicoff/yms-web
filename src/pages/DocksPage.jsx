import { useEffect, useState } from "react";
import {
  getQueue,
  manualAssign
} from "../services/dockOperationService";
import {
  useAuth
} from "../context/AuthContext";

import MainLayout
  from "../layouts/MainLayout";

import {
  getDockGroups
} from "../services/catalogService";

import {
  getDocksByGroup
} from "../services/dockOperationService";

export default function DocksPage() {
  const [
  selectedCheckInId,
  setSelectedCheckInId
] = useState("");
const { user } = useAuth();
const [
  selectedDockId,
  setSelectedDockId
] = useState("");

  const [
    dockGroups,
    setDockGroups
  ] = useState([]);

  const [
    selectedDockGroupId,
    setSelectedDockGroupId
  ] = useState("");

  const [
    queue,
    setQueue
  ] = useState([]);

  const [
    docks,
    setDocks
  ] = useState([]);

  useEffect(() => {

    loadDockGroups();

  }, []);

  const loadDockGroups =
    async () => {

      const data =
        await getDockGroups();
   

      setDockGroups(
        data.filter(
          dockGroup =>
            dockGroup.assignmentMode ===
            "MANUAL"
        )
      );

    };

  const loadGroupData =
    async (dockGroupId) => {

      const [
        queueData,
        docksData
      ] = await Promise.all([
        getQueue(dockGroupId),
        getDocksByGroup(dockGroupId)
      ]);

      setQueue(queueData);
      setDocks(docksData);

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
        Asignación Manual de Dock
      </h1>

      <select
        value={selectedDockGroupId}
        onChange={async (e) => {

          const dockGroupId =
            e.target.value;

          setSelectedDockGroupId(
            dockGroupId
          );

          await loadGroupData(
            dockGroupId
          );

        }}
        className="
          border
          rounded-lg
          px-3
          py-2
          mb-6
        "
      >

        <option value="">
          Seleccionar grupo
        </option>

        {dockGroups.map(
          (dockGroup) => (

            <option
              key={dockGroup.id}
              value={dockGroup.id}
            >
              {dockGroup.name}
            </option>

          )
        )}

      </select>
    <div className="grid grid-cols-2 gap-6">

  <div>

    <h2 className="font-bold mb-2">
      Cola
    </h2>

    {queue.map((item) => (

      <button
        key={item.checkInId}
        onClick={() =>
          setSelectedCheckInId(
            item.checkInId
          )
        }
        className={`w-full text-left border rounded p-2 mb-2 ${
          selectedCheckInId ===
          item.checkInId
            ? "bg-blue-100 border-blue-500"
            : ""
        }`}
      >
        {item.supplier}
      </button>

    ))}

  </div>

  <div>

    <h2 className="font-bold mb-2">
      Docks Disponibles
    </h2>

    {docks.map((dock) => (

      <button
        key={dock.id}
        onClick={() =>
          setSelectedDockId(
            dock.id
          )
        }
        className={`w-full text-left border rounded p-2 mb-2 ${
          selectedDockId ===
          dock.id
            ? "bg-green-100 border-green-500"
            : ""
        }`}
      >
        {dock.code}
      </button>

    ))}

  </div>

</div>
<div className="mt-6">

  <button
    disabled={
      !selectedCheckInId ||
      !selectedDockId
    }
  onClick={async () => {

  try {

    await manualAssign({
      checkInId:
        selectedCheckInId,
      dockId:
        selectedDockId,
      assignedById:
        user.id
    });

    await loadGroupData(
      selectedDockGroupId
    );

    setSelectedCheckInId("");
    setSelectedDockId("");

    alert(
      "Dock asignado correctamente"
    );

  } catch (error) {

    console.error(
      "MANUAL ASSIGN ERROR",
      error.response?.data
    );

    alert(
      error.response?.data?.message ||
      "Error asignando dock"
    );

  }

}}
    className="
      bg-blue-600
      text-white
      px-4
      py-2
      rounded-lg
      disabled:bg-slate-300
    "
  >
    Asignar Dock
  </button>

</div>

    </MainLayout>

  );

}