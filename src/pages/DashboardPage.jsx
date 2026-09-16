import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";
import Card from "../components/Card";

import { getDashboardSummary } from "../services/dashboardService";

// Refresco automático cada 30s: es un dashboard operativo (ocupación de
// docks en tiempo real), tiene sentido que se mantenga al día solo.
const REFRESH_INTERVAL_MS = 30000;

function formatWeekLabel(week) {

  if (!week) return "";

  const formatShort = (dateStr) => {
    const [, month, day] = dateStr.split("-");
    return `${day}/${month}`;
  };

  return `Semana del ${formatShort(week.startDate)} al ${formatShort(week.endDate)}`;

}

function formatDuration(minutes) {

  if (minutes === null || minutes === undefined) return "";

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}h ${remainingMinutes}min`;

}

function groupDocks(docks) {

  const groups = [];

  docks.forEach((dock) => {

    let warehouseGroup = groups.find(
      (g) => g.warehouseId === dock.warehouseId
    );

    if (!warehouseGroup) {
      warehouseGroup = {
        warehouseId: dock.warehouseId,
        warehouseName: dock.warehouseName,
        dockGroups: []
      };
      groups.push(warehouseGroup);
    }

    let dockGroup = warehouseGroup.dockGroups.find(
      (g) => g.dockGroupId === dock.dockGroupId
    );

    if (!dockGroup) {
      dockGroup = {
        dockGroupId: dock.dockGroupId,
        dockGroupName: dock.dockGroupName,
        docks: []
      };
      warehouseGroup.dockGroups.push(dockGroup);
    }

    dockGroup.docks.push(dock);

  });

  return groups;

}

export default function DashboardPage() {

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSummary = async () => {

    try {

      const data = await getDashboardSummary();

      setSummary(data);
      setError("");

    } catch (err) {

      console.error("DASHBOARD SUMMARY ERROR", err);

      setError(
        err.response?.data?.message ||
        "No se pudo cargar la información del dashboard."
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadSummary();

    const interval = setInterval(loadSummary, REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);

  }, []);

  const warehouseGroups = summary ? groupDocks(summary.docks) : [];

  return (
    <MainLayout>

      <div className="flex items-center justify-between mb-6">

        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <span className="text-sm text-slate-500">
          {formatWeekLabel(summary?.week)}
        </span>

      </div>

      {loading && (
        <p className="text-slate-500">
          Cargando...
        </p>
      )}

      {error && (
        <p className="text-red-600 mb-4">
          {error}
        </p>
      )}

      {summary && (
        <>

          <div className="mb-8">

            <Card>

              <div className="text-sm text-slate-500 mb-1">
                Turnos activos esta semana
              </div>

              <div className="text-4xl font-bold">
                {summary.activeAppointmentsCount}
              </div>

            </Card>

          </div>

          <h2 className="text-xl font-bold mb-4">
            Estado de docks
          </h2>

          <div className="space-y-6">

            {warehouseGroups.map((warehouse) => (

              <div key={warehouse.warehouseId}>

                <h3 className="font-semibold text-slate-700 mb-2">
                  {warehouse.warehouseName}
                </h3>

                <div className="space-y-4">

                  {warehouse.dockGroups.map((dockGroup) => (

                    <Card key={dockGroup.dockGroupId}>

                      <div className="font-medium text-sm text-slate-500 mb-3">
                        {dockGroup.dockGroupName}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">

                        {dockGroup.docks.map((dock) => (

                          <div
                            key={dock.id}
                            className={`border rounded-lg p-3 ${
                              !dock.active
                                ? "bg-slate-50 border-slate-200"
                                : dock.status === "OUT_OF_SERVICE"
                                ? "bg-amber-50 border-amber-200"
                                : dock.isOccupied
                                ? "bg-red-50 border-red-200"
                                : "bg-green-50 border-green-200"
                            }`}
                          >

                            <div className="font-semibold">
                              {dock.code}
                            </div>

                            {!dock.active ? (

                              <div className="text-xs text-slate-500 mt-1">
                                Deshabilitado
                              </div>

                            ) : dock.status === "OUT_OF_SERVICE" ? (

                              <div className="text-xs text-amber-700 font-medium mt-1">
                                Fuera de servicio
                              </div>

                            ) : dock.isOccupied ? (

                              <>
                                <div className="text-xs text-red-700 font-medium mt-1">
                                  Ocupado
                                </div>

                                <div className="text-xs text-slate-500">
                                  hace {formatDuration(dock.occupiedMinutes)}
                                </div>
                              </>

                            ) : (

                              <div className="text-xs text-green-700 font-medium mt-1">
                                Libre
                              </div>

                            )}

                          </div>

                        ))}

                      </div>

                    </Card>

                  ))}

                </div>

              </div>

            ))}

          </div>

        </>
      )}

    </MainLayout>
  );

}
