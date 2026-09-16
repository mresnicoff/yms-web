// Las operaciones se muestran siempre en castellano en la interfaz,
// aunque el backend siga usando LOAD/UNLOAD internamente.
export const OPERATION_TYPE_LABEL = {
  LOAD: "Carga",
  UNLOAD: "Descarga"
};

export const OPERATION_TYPE_OPTIONS = [
  { value: "LOAD", label: "Carga" },
  { value: "UNLOAD", label: "Descarga" }
];
