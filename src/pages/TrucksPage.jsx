import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../layouts/MainLayout";
import { getVehicleTypes } from "../services/catalogService";
import { getTrucks, createTruck } from "../services/truckService";
import {
  getTruckDocuments,
  createDocument,
  deleteDocument,
  uploadDocument // 👈 Importante: Usamos la misma función de subida previa
} from "../services/documentService";
import { getDocumentTypes } from "../services/documentTypeService";

export default function TrucksPage() {
  const { user } = useAuth();

  const [trucks, setTrucks] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);

  // Estados para Modal / Documentos
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentTypeId, setDocumentTypeId] = useState("");
  const [expirationDate, setExpirationDate] = useState("");

  const [form, setForm] = useState({
    plate: "",
    vehicleTypeId: ""
  });

  useEffect(() => {
    loadData();
    console.log(user);
  }, []);

  const loadData = async () => {
    const [trucksData, vehicleTypesData] = await Promise.all([
      getTrucks(),
      getVehicleTypes()
    ]);

    setTrucks(trucksData);
    setVehicleTypes(vehicleTypesData);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.vehicleTypeId) {
      alert("Debe seleccionar un tipo de vehículo.");
      return;
    }

    await createTruck(form);
    setForm({
      plate: "",
      vehicleTypeId: ""
    });

    await loadData();
  };

  const openDocuments = async (truck) => {
    setSelectedTruck(truck);

    const [docs, types] = await Promise.all([
      getTruckDocuments(truck.id),
      getDocumentTypes()
    ]);

    setDocuments(docs);
    setDocumentTypes(types);

    if (types.length > 0) {
      setDocumentTypeId(types[0].id);
    }
  };

  // ⚡ LÓGICA DE CARGA EN 2 PASOS (IDÉNTICA A DRIVERS)
  const handleAddDocument = async () => {
    try {
      let uploadedUrl = "";

      // Paso 1: Subir el archivo físicamente si fue seleccionado
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const upload = await uploadDocument(formData);
        console.log("UPLOAD RESPONSE", upload);

        uploadedUrl = upload.url;
      }

      // Paso 2: Crear el registro en Prisma con la URL resultante
      await createDocument({
        documentTypeId,
        ownerType: "TRUCK",
        truckId: selectedTruck.id,
        expirationDate: expirationDate
          ? new Date(expirationDate).toISOString()
          : null,
        fileUrl: uploadedUrl // 👈 Ahora SIEMPRE llega un string (o "" que podés validar)
      });

      const docs = await getTruckDocuments(selectedTruck.id);
      setDocuments(docs);

      // Limpiar campos
      setExpirationDate("");
      setSelectedFile(null);
    } catch (error) {
      console.log("ERROR COMPLETO", error);
      console.log("BACK RESPONSE", error.response?.data);
      alert(JSON.stringify(error.response?.data));
    }
  };

  const handleDeleteDocument = async (id) => {
    await deleteDocument(id);
    const docs = await getTruckDocuments(selectedTruck.id);
    setDocuments(docs);
  };

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-6">Trucks</h1>

      {/* Formulario de creación de Truck */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-xl p-6 mb-6 flex gap-4"
      >
        <input
          name="plate"
          placeholder="Patente"
          value={form.plate}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2"
        />

        <select
          name="vehicleTypeId"
          value={form.vehicleTypeId}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Tipo Vehículo</option>
          {vehicleTypes.map((vehicleType) => (
            <option key={vehicleType.id} value={vehicleType.id}>
              {vehicleType.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Crear
        </button>
      </form>

      {/* Tabla de Trucks */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-4 text-left">Patente</th>
              <th className="p-4 text-left">Tipo</th>
              <th className="p-4 text-left">Documentación</th>
            </tr>
          </thead>
          <tbody>
            {trucks.map((truck) => (
              <tr key={truck.id} className="border-t">
                <td className="p-4">{truck.plate}</td>
                <td className="p-4">{truck.vehicleType?.name}</td>
                <td className="p-4">
                  <button
                    onClick={() => openDocuments(truck)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg"
                  >
                    Documentos
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DE DOCUMENTACIÓN (Misma UI limpia y sticky que en Drivers) */}
      {selectedTruck && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] flex flex-col relative overflow-hidden shadow-2xl">
            
            {/* Cabecera Fija con Botón de Cierre X */}
            <div className="sticky top-0 bg-white z-10 px-6 pt-6 pb-2 border-b border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedTruck(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition-colors z-20"
                aria-label="Cerrar modal"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <h2 className="text-xl font-bold mb-4 pr-10 text-gray-900">
                Documentación del Vehículo {selectedTruck.plate}
              </h2>

              {/* Formulario de Carga */}
              <div className="flex flex-wrap md:flex-nowrap gap-4 items-center mb-4">
                <select
                  value={documentTypeId}
                  onChange={(e) => setDocumentTypeId(e.target.value)}
                  className="border border-gray-300 rounded p-2 w-full md:w-56 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  {documentTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  className="border border-gray-300 rounded p-2 w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="
                    flex-1 w-full border border-gray-300 rounded p-1 text-sm text-gray-500 cursor-pointer
                    file:mr-4 file:py-1.5 file:px-4
                    file:rounded file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                    transition-colors
                  "
                />

                <button
                  type="button"
                  onClick={handleAddDocument}
                  className="bg-green-600 hover:bg-green-700 text-white rounded px-6 py-2 whitespace-nowrap transition-colors font-semibold w-full md:w-auto text-sm"
                >
                  Agregar
                </button>
              </div>
            </div>

            {/* Contenedor Scrolleable para la Tabla */}
            <div className="flex-1 overflow-y-auto p-6 pt-2">
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-left border-collapse text-sm">
                  <thead className="sticky top-0 z-0">
                    <tr className="border-b bg-gray-50 text-gray-600">
                      <th className="p-3 font-semibold">Documento</th>
                      <th className="p-3 font-semibold">Vencimiento</th>
                      <th className="p-3 font-semibold">Archivo</th>
                      <th className="p-3 text-center font-semibold">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc) => (
                      <tr key={doc.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-800">
                          {doc.documentType?.name}
                        </td>
                        <td className="p-3 text-gray-700">
                          {doc.expirationDate
                            ? new Date(doc.expirationDate).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="p-3">
                          {doc.fileUrl ? (
                            <a
                              href={
                                doc.fileUrl.startsWith("http")
                                  ? doc.fileUrl
                                  : `${import.meta.env.VITE_API_URL}/${doc.fileUrl.replace(/\\/g, "/").replace(/^\//, "")}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline inline-flex items-center gap-1 font-medium"
                            >
                              Ver archivo
                            </a>
                          ) : (
                            <span className="text-gray-400">Sin archivo</span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1.5 rounded transition-colors font-medium text-xs inline-flex items-center gap-1"
                            title="Eliminar documento"
                          >
                            🗑️ Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}
    </MainLayout>
  );
}