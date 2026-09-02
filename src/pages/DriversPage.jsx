import {
  useEffect,
  useState
} from "react";

import MainLayout
  from "../layouts/MainLayout";

import {
  getDrivers,
  createDriver,
  updateDriver,
  deleteDriver
} from "../services/driverService";

import {
  getDriverDocuments,
  createDocument,
  deleteDocument,
  uploadDocument
} from "../services/documentService";

import {
  getDocumentTypes
} from "../services/documentTypeService";

export default function DriversPage() {

  const [
    drivers,
    setDrivers
  ] = useState([]);

  const [
  selectedFile,
  setSelectedFile
] = useState(null);

  const [
    selectedDriver,
    setSelectedDriver
  ] = useState(null);

  const [
    documents,
    setDocuments
  ] = useState([]);

  const [
    documentTypes,
    setDocumentTypes
  ] = useState([]);

  const [
    documentTypeId,
    setDocumentTypeId
  ] = useState("");

  const [
    expirationDate,
    setExpirationDate
  ] = useState("");

  const [form, setForm] =
    useState({
      firstName: "",
      lastName: "",
      phone: "",
      licenseNumber: ""
    });

  const [
    editingDriver,
    setEditingDriver
  ] = useState(null);

  const [editForm, setEditForm] =
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

      if (!form.firstName.trim() || !form.phone.trim()) {

        alert(
          "Debe completar al menos nombre y teléfono."
        );

        return;

      }

      try {

        await createDriver(form);

        setForm({
          firstName: "",
          lastName: "",
          phone: "",
          licenseNumber: ""
        });

        await loadDrivers();

      } catch (error) {

        alert(
          error.response?.data?.message ||
          "Error al crear el chofer."
        );

      }

    };

  const openEdit =
    (driver) => {

      setEditingDriver(
        driver
      );

      setEditForm({
        firstName:
          driver.firstName || "",
        lastName:
          driver.lastName || "",
        phone:
          driver.phone || "",
        licenseNumber:
          driver.licenseNumber || ""
      });

    };

  const handleEditChange =
    (e) => {

      setEditForm({
        ...editForm,
        [e.target.name]:
          e.target.value
      });

    };

  const handleUpdate =
    async (e) => {

      e.preventDefault();

      if (!editForm.firstName.trim() || !editForm.phone.trim()) {

        alert(
          "Debe completar al menos nombre y teléfono."
        );

        return;

      }

      try {

        await updateDriver(
          editingDriver.id,
          editForm
        );

        setEditingDriver(null);

        await loadDrivers();

      } catch (error) {

        alert(
          error.response?.data?.message ||
          "Error al actualizar el chofer."
        );

      }

    };

  const handleDelete =
    async (driver) => {

      const confirmed = window.confirm(
        `¿Eliminar al chofer ${driver.firstName} ${driver.lastName || ""}? Esta acción no se puede deshacer desde la pantalla.`
      );

      if (!confirmed) {
        return;
      }

      try {

        await deleteDriver(driver.id);

        await loadDrivers();

      } catch (error) {

        alert(
          error.response?.data?.message ||
          "Error al eliminar el chofer."
        );

      }

    };

  const openDocuments =
    async (driver) => {

      setSelectedDriver(
        driver
      );

      const [
        docs,
        types
      ] = await Promise.all([
        getDriverDocuments(
          driver.id
        ),
        getDocumentTypes()
      ]);

      setDocuments(
        docs
      );

      setDocumentTypes(
        types
      );

      if (
        types.length > 0
      ) {

        setDocumentTypeId(
          types[0].id
        );

      }

    };

const handleAddDocument =
  async () => {

    try {

      let uploadedUrl = "";

      if (selectedFile) {

        const formData =
          new FormData();

        formData.append(
          "file",
          selectedFile
        );

        const upload =
          await uploadDocument(
            formData
          );

        uploadedUrl =
          upload.url;

      }

      await createDocument({

        documentTypeId,

        ownerType:
          "DRIVER",

        driverId:
          selectedDriver.id,

        expirationDate:
          expirationDate
            ? new Date(
                expirationDate
              ).toISOString()
            : null,

        fileUrl:
          uploadedUrl

      });

      const docs =
        await getDriverDocuments(
          selectedDriver.id
        );

      setDocuments(
        docs
      );

      setExpirationDate("");

      setSelectedFile(
        null
      );

    } catch (error) {

  alert(
    error.response?.data?.message ||
    "Error al subir el documento."
  );

}

  };


  const handleDeleteDocument =
    async (id) => {

      await deleteDocument(
        id
      );

      const docs =
        await getDriverDocuments(
          selectedDriver.id
        );

      setDocuments(
        docs
      );

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
                Documentación
              </th>

              <th className="p-4 text-left">
                Acción
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

                    {driver.firstName}{" "}
                    {driver.lastName}

                  </td>

                  <td className="p-4">
                    {driver.phone}
                  </td>

                  <td className="p-4">
                    {driver.licenseNumber}
                  </td>

                  <td className="p-4">

                    <button
                      onClick={() =>
                        openDocuments(
                          driver
                        )
                      }
                      className="
                        bg-indigo-600
                        hover:bg-indigo-700
                        text-white
                        px-3
                        py-1
                        rounded-lg
                      "
                    >
                      Documentos
                    </button>

                  </td>

                  <td className="p-4">

                    <div className="flex gap-2">

                      <button
                        onClick={() =>
                          openEdit(
                            driver
                          )
                        }
                        className="
                          bg-slate-200
                          hover:bg-slate-300
                          text-slate-700
                          px-3
                          py-1
                          rounded-lg
                        "
                      >
                        Editar
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(
                            driver
                          )
                        }
                        className="
                          bg-red-600
                          hover:bg-red-700
                          text-white
                          px-3
                          py-1
                          rounded-lg
                        "
                      >
                        Eliminar
                      </button>

                    </div>

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

{editingDriver && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl p-6 max-w-md w-full">

      <h2 className="text-xl font-bold mb-4">
        Editar chofer
      </h2>

      <form
        onSubmit={handleUpdate}
        className="flex flex-col gap-3"
      >

        <input
          name="firstName"
          placeholder="Nombre"
          value={editForm.firstName}
          onChange={handleEditChange}
          className="border rounded-lg px-3 py-2"
        />

        <input
          name="lastName"
          placeholder="Apellido"
          value={editForm.lastName}
          onChange={handleEditChange}
          className="border rounded-lg px-3 py-2"
        />

        <input
          name="phone"
          placeholder="WhatsApp"
          value={editForm.phone}
          onChange={handleEditChange}
          className="border rounded-lg px-3 py-2"
        />

        <input
          name="licenseNumber"
          placeholder="N° de licencia"
          value={editForm.licenseNumber}
          onChange={handleEditChange}
          className="border rounded-lg px-3 py-2"
        />

        <div className="flex justify-end gap-2 mt-2">

          <button
            type="button"
            onClick={() => setEditingDriver(null)}
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

{selectedDriver && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    {/* Cambiado a max-w-5xl y w-full para que no se corte en pantallas chicas */}
    <div className="bg-white rounded-xl p-6 max-w-5xl w-full max-h-[90vh] flex flex-col">
      <button
        type="button"
        onClick={() => setSelectedDriver(null)} // O tu función de cierre (ej: onClose)
        className="absolute top-4 right-4 bg-gray-200 text-gray-500 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition-colors"
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
      {/* Encabezado */}
      <h2 className="text-xl font-bold mb-4 shrink-0">
        Documentación de {selectedDriver.firstName} {selectedDriver.lastName}
      </h2>

      {/* Formulario de carga */}
      <div className="flex flex-wrap md:flex-nowrap gap-4 items-center mb-6 shrink-0">
        <select
          value={documentTypeId}
          onChange={(e) => setDocumentTypeId(e.target.value)}
          className="border rounded p-2 w-full md:w-56 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="border rounded p-2 w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          className="
            flex-1 w-full border rounded p-1 text-sm text-gray-500 cursor-pointer
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
          className="bg-green-600 hover:bg-green-700 text-white rounded px-6 py-2 whitespace-nowrap transition-colors font-medium w-full md:w-auto"
        >
          Agregar
        </button>
      </div>

      {/* Contenedor con overflow-x-auto para asegurar que la columna de acciones se vea SIEMPRE */}
      <div className="overflow-x-auto overflow-y-auto flex-1 border rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-50 text-gray-600 text-sm">
              <th className="p-3">Documento</th>
              <th className="p-3">Vencimiento</th>
              <th className="p-3">Archivo</th>
              <th className="p-3 text-center">Acción</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{doc.documentType?.name}</td>
                <td className="p-3">
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
                
                {/* Columna de Acción con el botón Delete visibilizado */}
                <td className="p-3 text-center">
                  <button
                    type="button"
                    onClick={() => handleDeleteDocument(doc.id)} // Asegurate de tener tu handler aquí
                    className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1.5 rounded transition-colors font-medium text-sm inline-flex items-center gap-1"
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
)}

    </MainLayout>

  );

}