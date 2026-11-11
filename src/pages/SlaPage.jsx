import { useEffect, useMemo, useState } from "react";

import MainLayout from "../layouts/MainLayout";
import Card from "../components/Card";
import Button from "../components/Button";

import { getSlaReport } from "../services/slaService";
import { getWarehouses } from "../services/catalogService";
import { getBuenosAiresToday } from "../utils/buenosAiresTime";

const SETTINGS_KEY = "sla-settings";

const DEFAULT_SETTINGS = {
  maxYardWait: 30,
  maxDockTime: 60,
  lateTolerance: 15,
  lateFine: 0
};

function loadSettings() {

  try {
    return {
      ...DEFAULT_SETTINGS,
      ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}")
    };
  } catch {
    return DEFAULT_SETTINGS;
  }

}

function daysAgo(dateStr, days) {

  const d = new Date(`${dateStr}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - days);

  return d.toISOString().slice(0, 10);

}

function fmtMin(m) {

  if (m === null || m === undefined) return "–";

  const sign = m < 0 ? "-" : "";
  const abs = Math.abs(m);

  if (abs < 60) return `${sign}${abs} min`;

  return `${sign}${Math.floor(abs / 60)}h ${abs % 60}min`;

}

function fmtTime(iso) {

  if (!iso) return "–";

  return new Intl.DateTimeFormat("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(new Date(iso));

}

function fmtDate(iso) {

  return new Intl.DateTimeFormat("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    day: "2-digit",
    month: "2-digit"
  }).format(new Date(iso));

}

function pctWithin(rows, key, limit) {

  const v = rows.filter((r) => r[key] !== null && r[key] !== undefined);

  if (v.length === 0) return null;

  return Math.round((v.filter((r) => r[key] <= limit).length / v.length) * 100);

}

function Kpi({ title, avgValue, p90Value, pct, note }) {

  const good = pct === null || pct >= 90;

  return (
    <Card>
      <div className="text-sm text-slate-500">{title}</div>
      <div className="text-3xl font-bold mt-1">{fmtMin(avgValue)}</div>
      <div className="text-xs text-slate-500 mt-1">
        promedio · 90% de los camiones ≤ {fmtMin(p90Value)}
      </div>
      {pct !== null && (
        <div
          className={`mt-3 inline-block text-xs font-semibold px-2 py-1 rounded-full ${
            good ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"
          }`}
        >
          {pct}% dentro del objetivo
        </div>
      )}
      {note && <div className="text-xs text-slate-400 mt-2">{note}</div>}
    </Card>
  );

}

export default function SlaPage() {

  const today = getBuenosAiresToday();

  const [from, setFrom] = useState(daysAgo(today, 7));
  const [to, setTo] = useState(today);
  const [warehouseId, setWarehouseId] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const [settings, setSettings] = useState(loadSettings);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getWarehouses().then(setWarehouses).catch(() => {});
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      /* sin almacenamiento: no pasa nada */
    }
  }, [settings]);

  const load = async () => {

    setLoading(true);
    setError("");

    try {
      setReport(
        await getSlaReport({
          from,
          to,
          warehouseId: warehouseId || undefined
        })
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "No se pudo cargar el reporte."
      );
    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setNum = (key) => (e) =>
    setSettings({ ...settings, [key]: Number(e.target.value) || 0 });

  const rows = useMemo(() => report?.rows || [], [report]);

  const lateRows = useMemo(
    () => rows.filter((r) => r.lateMinutes !== null && r.lateMinutes > settings.lateTolerance),
    [rows, settings.lateTolerance]
  );

  const totalFine = lateRows.length * settings.lateFine;

  const exportCsv = () => {

    const head = [
      "Fecha", "Proveedor", "Patente", "Operación", "Dock", "Turno",
      "Llegada", "Min tarde", "Espera en playa", "Asignación a atraco",
      "Operación en dock", "Total en planta", "Multa"
    ];

    const lines = rows.map((r) => [
      fmtDate(r.scheduledStart), r.supplier, r.plate || "", r.operationType,
      r.dock || "", fmtTime(r.scheduledStart), fmtTime(r.arrivalTime),
      r.lateMinutes ?? "", r.yardWait ?? "", r.toDock ?? "", r.dockTime ?? "",
      r.total ?? "",
      r.lateMinutes > settings.lateTolerance ? settings.lateFine : 0
    ]);

    const csv = [head, ...lines]
      .map((l) => l.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";"))
      .join("\n");

    const url = URL.createObjectURL(
      new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" })
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `tiempos-sla-${from}-${to}.csv`;
    a.click();
    URL.revokeObjectURL(url);

  };

  const s = report?.summary;

  return (
    <MainLayout>

      <h1 className="text-3xl font-bold mb-1">Tiempos y SLA</h1>
      <p className="text-slate-500 mb-6">
        Cuánto tarda cada etapa del camión en planta y si se cumple lo acordado.
      </p>

      <Card className="mb-6">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">

          <label className="text-sm">
            <span className="block text-slate-500 mb-1">Desde</span>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full px-3 py-2" />
          </label>

          <label className="text-sm">
            <span className="block text-slate-500 mb-1">Hasta</span>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-full px-3 py-2" />
          </label>

          <label className="text-sm">
            <span className="block text-slate-500 mb-1">Depósito</span>
            <select value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)} className="w-full px-3 py-2">
              <option value="">Todos</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </label>

          <Button onClick={load} disabled={loading}>
            {loading ? "Cargando..." : "Ver reporte"}
          </Button>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-5 border-t border-line">

          <label className="text-sm">
            <span className="block text-slate-500 mb-1">Espera máx. en playa (min)</span>
            <input type="number" min="0" value={settings.maxYardWait} onChange={setNum("maxYardWait")} className="w-full px-3 py-2" />
          </label>

          <label className="text-sm">
            <span className="block text-slate-500 mb-1">Operación máx. en dock (min)</span>
            <input type="number" min="0" value={settings.maxDockTime} onChange={setNum("maxDockTime")} className="w-full px-3 py-2" />
          </label>

          <label className="text-sm">
            <span className="block text-slate-500 mb-1">Tolerancia de llegada (min)</span>
            <input type="number" min="0" value={settings.lateTolerance} onChange={setNum("lateTolerance")} className="w-full px-3 py-2" />
          </label>

          <label className="text-sm">
            <span className="block text-slate-500 mb-1">Multa por llegada tarde ($)</span>
            <input type="number" min="0" value={settings.lateFine} onChange={setNum("lateFine")} className="w-full px-3 py-2" />
          </label>

        </div>

      </Card>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {report && report.count === 0 && (
        <p className="text-slate-500">No hay camiones con Check-In en ese período.</p>
      )}

      {report && report.count > 0 && (
        <>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">

            <Kpi
              title="Espera en playa"
              note="Llegada → asignación de dock"
              avgValue={s.yardWait.avg}
              p90Value={s.yardWait.p90}
              pct={pctWithin(rows, "yardWait", settings.maxYardWait)}
            />

            <Kpi
              title="Operación en dock"
              note="Atraco → dock liberado"
              avgValue={s.dockTime.avg}
              p90Value={s.dockTime.p90}
              pct={pctWithin(rows, "dockTime", settings.maxDockTime)}
            />

            <Kpi
              title="Asignación → estacionado"
              note="Asignación de dock → Atraco"
              avgValue={s.toDock.avg}
              p90Value={s.toDock.p90}
              pct={null}
            />

            <Kpi
              title="Total en planta"
              note="Llegada → dock liberado"
              avgValue={s.total.avg}
              p90Value={s.total.p90}
              pct={null}
            />

          </div>

          <Card className="mb-6">

            <div className="flex flex-wrap items-center justify-between gap-3">

              <div>
                <div className="text-sm text-slate-500">Llegadas tarde (más de {settings.lateTolerance} min)</div>
                <div className="text-3xl font-bold">
                  {lateRows.length}{" "}
                  <span className="text-base font-normal text-slate-500">
                    de {rows.length} camiones
                  </span>
                </div>
              </div>

              {settings.lateFine > 0 && (
                <div className="text-right">
                  <div className="text-sm text-slate-500">Multas a facturar</div>
                  <div className="text-3xl font-bold text-red-700">
                    $ {totalFine.toLocaleString("es-AR")}
                  </div>
                </div>
              )}

              <Button onClick={exportCsv} className="!bg-ink">
                Descargar CSV
              </Button>

            </div>

          </Card>

          <div className="bg-white border border-line rounded-xl overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-slate-50 border-b border-line">
                <tr>
                  {["Fecha", "Proveedor", "Patente", "Dock", "Turno", "Llegada", "Tarde", "Espera en playa", "A dock", "Operación", "Total"].map((h) => (
                    <th key={h} className="text-left p-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {rows.map((r) => {

                  const late = r.lateMinutes !== null && r.lateMinutes > settings.lateTolerance;

                  return (
                    <tr key={r.appointmentId} className="border-b border-line last:border-0">
                      <td className="p-3">{fmtDate(r.scheduledStart)}</td>
                      <td className="p-3">{r.supplier}</td>
                      <td className="p-3">{r.plate || "–"}</td>
                      <td className="p-3">{r.dock || "–"}</td>
                      <td className="p-3">{fmtTime(r.scheduledStart)}</td>
                      <td className="p-3">{fmtTime(r.arrivalTime)}</td>
                      <td className={`p-3 font-medium ${late ? "text-red-700" : "text-slate-600"}`}>
                        {fmtMin(r.lateMinutes)}
                      </td>
                      <td className={`p-3 ${r.yardWait > settings.maxYardWait ? "text-red-700 font-medium" : ""}`}>{fmtMin(r.yardWait)}</td>
                      <td className="p-3">{fmtMin(r.toDock)}</td>
                      <td className={`p-3 ${r.dockTime > settings.maxDockTime ? "text-red-700 font-medium" : ""}`}>{fmtMin(r.dockTime)}</td>
                      <td className="p-3 font-medium">{fmtMin(r.total)}</td>
                    </tr>
                  );

                })}
              </tbody>

            </table>

          </div>

        </>
      )}

    </MainLayout>
  );

}
