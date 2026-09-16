import {
  useEffect,
  useState
} from "react";

import MainLayout
  from "../layouts/MainLayout";

import {
  getUsers,
  getRoles,
  createUser,
  updateUser,
  resetUserPassword
} from "../services/userService";

import {
  getSuppliers,
  createSupplier
} from "../services/catalogService";

const SUPPLIER_ROLE_CODE = "SUPPLIER";

const NEW_SUPPLIER_OPTION = "__NEW__";

const ESTADOS = [
  "ACTIVE",
  "INACTIVE",
  "BLOCKED"
];

const ESTADO_LABEL = {
  ACTIVE: "Activo",
  INACTIVE: "Inactivo",
  BLOCKED: "Bloqueado"
};

export default function UsersPage() {

  const [users, setUsers] =
    useState([]);

  const [roles, setRoles] =
    useState([]);

  const [suppliers, setSuppliers] =
    useState([]);

  const [form, setForm] =
    useState({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      roleId: "",
      supplierId: ""
    });

  const [newSupplier, setNewSupplier] =
    useState({
      name: "",
      taxId: "",
      email: ""
    });

  const [editingUser, setEditingUser] =
    useState(null);

  const [editForm, setEditForm] =
    useState({
      firstName: "",
      lastName: "",
      email: "",
      roleId: "",
      status: "ACTIVE",
      supplierId: ""
    });

  const [editNewSupplier, setEditNewSupplier] =
    useState({
      name: "",
      taxId: "",
      email: ""
    });

  const [resettingUser, setResettingUser] =
    useState(null);

  const [newPassword, setNewPassword] =
    useState("");

  const [newPasswordConfirm, setNewPasswordConfirm] =
    useState("");

  useEffect(() => {

    loadData();

  }, []);

  const loadData =
    async () => {

      const [usersData, rolesData, suppliersData] =
        await Promise.all([
          getUsers(),
          getRoles(),
          getSuppliers()
        ]);

      setUsers(usersData);

      setRoles(rolesData);

      setSuppliers(suppliersData);

      if (rolesData.length > 0) {

        setForm((prev) => ({
          ...prev,
          roleId: prev.roleId || rolesData[0].id
        }));

      }

    };

  const isSupplierRole =
    (roleId) => {

      const role = roles.find(
        (r) => r.id === roleId
      );

      return role?.code === SUPPLIER_ROLE_CODE;

    };

  // Si el rol elegido es Proveedor, resuelve el supplierId a usar:
  // si se eligió "crear proveedor nuevo", lo crea primero y devuelve
  // su id; si se eligió uno existente, devuelve ese id tal cual.
  const resolveSupplierIdForSubmit =
    async (supplierIdValue, newSupplierData) => {

      if (supplierIdValue === NEW_SUPPLIER_OPTION) {

        if (!newSupplierData.name.trim() || !newSupplierData.taxId.trim()) {

          throw new Error(
            "Para crear un proveedor nuevo hay que completar nombre y CUIT."
          );

        }

        const created = await createSupplier({
          name: newSupplierData.name.trim(),
          taxId: newSupplierData.taxId.trim(),
          email: newSupplierData.email.trim() || undefined
        });

        return created.id;

      }

      if (!supplierIdValue) {

        throw new Error(
          "Para el rol Proveedor hay que seleccionar o crear un proveedor."
        );

      }

      return supplierIdValue;

    };

  const handleChange =
    (e) => {

      setForm({
        ...form,
        [e.target.name]:
          e.target.value
      });

    };

  const handleNewSupplierChange =
    (e) => {

      setNewSupplier({
        ...newSupplier,
        [e.target.name]:
          e.target.value
      });

    };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (
        !form.firstName.trim() ||
        !form.lastName.trim() ||
        !form.email.trim() ||
        !form.password.trim() ||
        !form.roleId
      ) {

        alert(
          "Debe completar nombre, apellido, email, contraseña y rol."
        );

        return;

      }

      if (form.password.length < 6) {

        alert(
          "La contraseña debe tener al menos 6 caracteres."
        );

        return;

      }

      try {

        let supplierId;

        if (isSupplierRole(form.roleId)) {

          supplierId = await resolveSupplierIdForSubmit(
            form.supplierId,
            newSupplier
          );

        }

        await createUser({
          ...form,
          supplierId
        });

        setForm({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          roleId: roles[0]?.id || "",
          supplierId: ""
        });

        setNewSupplier({
          name: "",
          taxId: "",
          email: ""
        });

        await loadData();

      } catch (error) {

        alert(
          error.response?.data?.message ||
          error.message ||
          "Error al crear el usuario."
        );

      }

    };

  const openEdit =
    (user) => {

      setEditingUser(user);

      setEditForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        roleId: user.roleId || "",
        status: user.status || "ACTIVE",
        supplierId: user.supplierId || ""
      });

      setEditNewSupplier({
        name: "",
        taxId: "",
        email: ""
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

  const handleEditNewSupplierChange =
    (e) => {

      setEditNewSupplier({
        ...editNewSupplier,
        [e.target.name]:
          e.target.value
      });

    };

  const handleUpdate =
    async (e) => {

      e.preventDefault();

      if (
        !editForm.firstName.trim() ||
        !editForm.lastName.trim() ||
        !editForm.email.trim() ||
        !editForm.roleId
      ) {

        alert(
          "Debe completar nombre, apellido, email y rol."
        );

        return;

      }

      try {

        let supplierId;

        if (isSupplierRole(editForm.roleId)) {

          supplierId = await resolveSupplierIdForSubmit(
            editForm.supplierId,
            editNewSupplier
          );

        }

        await updateUser(
          editingUser.id,
          {
            ...editForm,
            supplierId
          }
        );

        setEditingUser(null);

        await loadData();

      } catch (error) {

        alert(
          error.response?.data?.message ||
          error.message ||
          "Error al actualizar el usuario."
        );

      }

    };

  const openResetPassword =
    (user) => {

      setResettingUser(user);

      setNewPassword("");

      setNewPasswordConfirm("");

    };

  const handleResetPassword =
    async (e) => {

      e.preventDefault();

      if (newPassword.length < 6) {

        alert(
          "La contraseña debe tener al menos 6 caracteres."
        );

        return;

      }

      if (newPassword !== newPasswordConfirm) {

        alert(
          "Las contraseñas no coinciden."
        );

        return;

      }

      try {

        await resetUserPassword(
          resettingUser.id,
          newPassword
        );

        alert(
          `Contraseña actualizada para ${resettingUser.firstName} ${resettingUser.lastName}.`
        );

        setResettingUser(null);

      } catch (error) {

        alert(
          error.response?.data?.message ||
          "Error al resetear la contraseña."
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
        Usuarios
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
          name="email"
          type="email"
          placeholder="Email (usuario)"
          value={form.email}
          onChange={handleChange}
          className="
            border
            rounded-lg
            px-3
            py-2
          "
        />

        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          className="
            border
            rounded-lg
            px-3
            py-2
          "
        />

        <select
          name="roleId"
          value={form.roleId}
          onChange={handleChange}
          className="
            border
            rounded-lg
            px-3
            py-2
          "
        >

          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}

        </select>

        {isSupplierRole(form.roleId) && (

          <div
            className="
              w-full
              flex
              gap-4
              flex-wrap
              items-start
              bg-slate-50
              border
              rounded-lg
              p-4
            "
          >

            <select
              name="supplierId"
              value={form.supplierId}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2"
            >

              <option value="">
                -- Seleccionar proveedor --
              </option>

              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}

              <option value={NEW_SUPPLIER_OPTION}>
                ➕ Crear proveedor nuevo
              </option>

            </select>

            {form.supplierId === NEW_SUPPLIER_OPTION && (

              <>

                <input
                  name="name"
                  placeholder="Nombre del proveedor"
                  value={newSupplier.name}
                  onChange={handleNewSupplierChange}
                  className="border rounded-lg px-3 py-2"
                />

                <input
                  name="taxId"
                  placeholder="CUIT / Tax ID"
                  value={newSupplier.taxId}
                  onChange={handleNewSupplierChange}
                  className="border rounded-lg px-3 py-2"
                />

                <input
                  name="email"
                  type="email"
                  placeholder="Email del proveedor (opcional)"
                  value={newSupplier.email}
                  onChange={handleNewSupplierChange}
                  className="border rounded-lg px-3 py-2"
                />

              </>

            )}

          </div>

        )}

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
                Email
              </th>

              <th className="p-4 text-left">
                Rol
              </th>

              <th className="p-4 text-left">
                Proveedor
              </th>

              <th className="p-4 text-left">
                Estado
              </th>

              <th className="p-4 text-left">
                Acción
              </th>

            </tr>

          </thead>

          <tbody>

            {users.map((user) => (

              <tr
                key={user.id}
                className="border-t"
              >

                <td className="p-4">
                  {user.firstName} {user.lastName}
                </td>

                <td className="p-4">
                  {user.email}
                </td>

                <td className="p-4">
                  {user.role?.name}
                </td>

                <td className="p-4">
                  {user.supplier?.name || "-"}
                </td>

                <td className="p-4">

                  <span
                    className={
                      user.status === "ACTIVE"
                        ? "text-green-700"
                        : "text-red-600"
                    }
                  >
                    {ESTADO_LABEL[user.status] || user.status}
                  </span>

                </td>

                <td className="p-4">

                  <div className="flex gap-2">

                    <button
                      onClick={() => openEdit(user)}
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
                      onClick={() => openResetPassword(user)}
                      className="
                        bg-amber-500
                        hover:bg-amber-600
                        text-white
                        px-3
                        py-1
                        rounded-lg
                      "
                    >
                      Resetear contraseña
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">

            <h2 className="text-xl font-bold mb-4">
              Editar usuario
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
                name="email"
                type="email"
                placeholder="Email (usuario)"
                value={editForm.email}
                onChange={handleEditChange}
                className="border rounded-lg px-3 py-2"
              />

              <select
                name="roleId"
                value={editForm.roleId}
                onChange={handleEditChange}
                className="border rounded-lg px-3 py-2"
              >

                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}

              </select>

              <select
                name="status"
                value={editForm.status}
                onChange={handleEditChange}
                className="border rounded-lg px-3 py-2"
              >

                {ESTADOS.map((estado) => (
                  <option key={estado} value={estado}>
                    {ESTADO_LABEL[estado]}
                  </option>
                ))}

              </select>

              {isSupplierRole(editForm.roleId) && (

                <div
                  className="
                    flex
                    flex-col
                    gap-3
                    bg-slate-50
                    border
                    rounded-lg
                    p-4
                  "
                >

                  <select
                    name="supplierId"
                    value={editForm.supplierId}
                    onChange={handleEditChange}
                    className="border rounded-lg px-3 py-2"
                  >

                    <option value="">
                      -- Seleccionar proveedor --
                    </option>

                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}

                    <option value={NEW_SUPPLIER_OPTION}>
                      ➕ Crear proveedor nuevo
                    </option>

                  </select>

                  {editForm.supplierId === NEW_SUPPLIER_OPTION && (

                    <>

                      <input
                        name="name"
                        placeholder="Nombre del proveedor"
                        value={editNewSupplier.name}
                        onChange={handleEditNewSupplierChange}
                        className="border rounded-lg px-3 py-2"
                      />

                      <input
                        name="taxId"
                        placeholder="CUIT / Tax ID"
                        value={editNewSupplier.taxId}
                        onChange={handleEditNewSupplierChange}
                        className="border rounded-lg px-3 py-2"
                      />

                      <input
                        name="email"
                        type="email"
                        placeholder="Email del proveedor (opcional)"
                        value={editNewSupplier.email}
                        onChange={handleEditNewSupplierChange}
                        className="border rounded-lg px-3 py-2"
                      />

                    </>

                  )}

                </div>

              )}

              <div className="flex justify-end gap-2 mt-2">

                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
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

      {resettingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">

            <h2 className="text-xl font-bold mb-4">
              Resetear contraseña de {resettingUser.firstName} {resettingUser.lastName}
            </h2>

            <form
              onSubmit={handleResetPassword}
              className="flex flex-col gap-3"
            >

              <input
                type="password"
                placeholder="Contraseña nueva"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border rounded-lg px-3 py-2"
              />

              <input
                type="password"
                placeholder="Repetir contraseña nueva"
                value={newPasswordConfirm}
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                className="border rounded-lg px-3 py-2"
              />

              <div className="flex justify-end gap-2 mt-2">

                <button
                  type="button"
                  onClick={() => setResettingUser(null)}
                  className="px-4 py-2 rounded-lg"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg"
                >
                  Resetear
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </MainLayout>

  );

}
