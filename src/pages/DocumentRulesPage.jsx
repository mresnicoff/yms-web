import {
  useEffect,
  useState
} from "react";

import MainLayout
  from "../layouts/MainLayout";

import {
  getDocumentTypes
} from "../services/documentTypeService";

import {
  getRequiredDocuments,
  createRequiredDocument,
  deleteRequiredDocument
} from "../services/requiredDocumentService";

export default function DocumentRulesPage() {

  const [
    rules,
    setRules
  ] = useState([]);

  const [
    documentTypes,
    setDocumentTypes
  ] = useState([]);

  const [
    operationType,
    setOperationType
  ] = useState("LOAD");

  const [
    ownerType,
    setOwnerType
  ] = useState("DRIVER");

  const [
    documentTypeId,
    setDocumentTypeId
  ] = useState("");

  useEffect(() => {

    loadData();

  }, []);

  const loadData =
    async () => {

      try {

        const [
          rulesData,
          documentTypesData
        ] = await Promise.all([
          getRequiredDocuments(),
          getDocumentTypes()
        ]);

        setRules(
          rulesData
        );

        setDocumentTypes(
          documentTypesData
        );

        if (
          documentTypesData.length > 0 &&
          !documentTypeId
        ) {

          setDocumentTypeId(
            documentTypesData[0].id
          );

        }

      } catch (error) {

        console.error(error);

      }

    };

  const handleCreate =
    async () => {

      try {

        await createRequiredDocument({

          documentTypeId,

          operationType,

          ownerType

        });

        await loadData();

      } catch (error) {

        alert(
          error.response?.data?.message ||
          "Error creando regla"
        );

      }

    };

  const handleDelete =
    async (id) => {

      try {

        await deleteRequiredDocument(
          id
        );

        await loadData();

      } catch (error) {

        alert(
          error.response?.data?.message ||
          "Error eliminando regla"
        );

      }

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
        Exigencias de documentos
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
            grid-cols-4
            gap-4
          "
        >

          <select
            value={operationType}
            onChange={(e) =>
              setOperationType(
                e.target.value
              )
            }
            className="
              border
              rounded-lg
              px-3
              py-2
            "
          >

            <option value="LOAD">
              LOAD
            </option>

            <option value="UNLOAD">
              UNLOAD
            </option>

          </select>

          <select
            value={ownerType}
            onChange={(e) =>
              setOwnerType(
                e.target.value
              )
            }
            className="
              border
              rounded-lg
              px-3
              py-2
            "
          >

            <option value="DRIVER">
              DRIVER
            </option>

            <option value="TRUCK">
              TRUCK
            </option>

          </select>

          <select
            value={documentTypeId}
            onChange={(e) =>
              setDocumentTypeId(
                e.target.value
              )
            }
            className="
              border
              rounded-lg
              px-3
              py-2
            "
          >

            {documentTypes.map(
              (type) => (

                <option
                  key={type.id}
                  value={type.id}
                >
                  {type.name}
                </option>

              )
            )}

          </select>

          <button
            onClick={
              handleCreate
            }
            className="
              bg-blue-600
              hover:bg-blue-700
              text-white
              rounded-lg
              px-4
              py-2
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

          <thead
            className="
              bg-slate-50
              border-b
            "
          >

            <tr>

              <th className="p-4 text-left">
                Operación
              </th>

              <th className="p-4 text-left">
                Documento
              </th>

              <th className="p-4 text-left">
                Responsable
              </th>

              <th className="p-4 text-left">
                Acción
              </th>

            </tr>

          </thead>

          <tbody>

            {rules.map(
              (rule) => (

                <tr
                  key={rule.id}
                  className="border-b"
                >

                  <td className="p-4">
                    {rule.operationType}
                  </td>

                  <td className="p-4">
                    {
                      rule.documentType
                        ?.name
                    }
                  </td>

                  <td className="p-4">
                    {rule.ownerType}
                  </td>

                  <td className="p-4">

                    <button
                      onClick={() =>
                        handleDelete(
                          rule.id
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

                  </td>

                </tr>

              )
            )}

            {rules.length === 0 && (

              <tr>

                <td
                  colSpan={4}
                  className="
                    p-8
                    text-center
                    text-slate-500
                  "
                >
                  No hay reglas configuradas
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </MainLayout>

  );

}