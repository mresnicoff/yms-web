import {
  useEffect,
  useState
} from "react";

import MainLayout
  from "../layouts/MainLayout";

import {
  getDocumentTypes,
  createDocumentType,
  deleteDocumentType
} from "../services/documentTypeService";

export default function DocumentTypesPage() {

  const [
    documentTypes,
    setDocumentTypes
  ] = useState([]);

  const [
    code,
    setCode
  ] = useState("");

  const [
    name,
    setName
  ] = useState("");

  useEffect(() => {

    loadData();

  }, []);

  const loadData =
    async () => {

      const data =
        await getDocumentTypes();

      setDocumentTypes(
        data
      );

    };

const handleCreate = async () => {
    try {
      console.log("Creating document type with code:", code, "and name:", name);
      await createDocumentType({
        code,
        name
      });
      
      setCode("");
      setName("");
      await loadData();
    } catch (error) {
      // Capturamos la respuesta de la API para ver qué falló en el backend
      console.error("Detalle del error desde la API:", error.response?.data);
    }
  };

  const handleDelete =
    async (id) => {

      await deleteDocumentType(
        id
      );

      await loadData();

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
        Tipos de Documento
      </h1>

      <div
        className="
          bg-white
          border
          rounded-xl
          p-4
          mb-6
        "
      >

        <div
          className="
            grid
            grid-cols-3
            gap-4
          "
        >

          <input
            placeholder="Código"
            value={code}
            onChange={(e) =>
              setCode(
                e.target.value
              )
            }
            className="
              border
              rounded-lg
              px-3
              py-2
            "
          />

          <input
            placeholder="Nombre"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            className="
              border
              rounded-lg
              px-3
              py-2
            "
          />

          <button
            onClick={
              handleCreate
            }
            className="
              bg-blue-600
              text-white
              rounded-lg
            "
          >
            Agregar
          </button>

        </div>

      </div>

      <div
        className="
          bg-white
          border
          rounded-xl
          overflow-hidden
        "
      >

        <table
          className="w-full"
        >

          <thead>

            <tr>

              <th className="p-4">
                Código
              </th>

              <th className="p-4">
                Nombre
              </th>

              <th className="p-4">
                Acción
              </th>

            </tr>

          </thead>

          <tbody>

            {documentTypes.map(
              (type) => (

                <tr
                  key={type.id}
                >

                  <td className="p-4">
                    {type.code}
                  </td>

                  <td className="p-4">
                    {type.name}
                  </td>

                  <td className="p-4">

                    <button
                      onClick={() =>
                        handleDelete(
                          type.id
                        )
                      }
                      className="
                        bg-red-600
                        text-white
                        px-3
                        py-1
                        rounded
                      "
                    >
                      Eliminar
                    </button>

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </MainLayout>

  );

}