import api from "../api/axios";

export const getSuppliers = async () => {
  const { data } = await api.get("/suppliers");
  return data;
};

export const getVehicleTypes = async () => {
  const { data } = await api.get("/vehicle-types");
  return data;
};

export const getWarehouses = async () => {
  const { data } = await api.get("/warehouses");
  return data;
};

export const getDockGroups = async () => {
  const { data } = await api.get("/dock-groups");
  return data;
};

export const getAvailability = async (
  dockGroupId,
  vehicleTypeId,
  operationType,
  date
) => {

  const { data } = await api.get(
    "/slots/availability",
    {
      params: {
        dockGroupId,
        vehicleTypeId,
        operationType,
        date
      }
    }
  );

  return data;
};