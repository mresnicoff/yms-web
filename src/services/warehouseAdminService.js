import api from "../api/axios";

// --- Warehouses ---

export const getWarehousesAdmin =
  async () => {

    const { data } =
      await api.get(
        "/warehouses/admin"
      );

    return data;

  };

export const createWarehouse =
  async (payload) => {

    const { data } =
      await api.post(
        "/warehouses",
        payload
      );

    return data;

  };

export const updateWarehouse =
  async (id, payload) => {

    const { data } =
      await api.put(
        `/warehouses/${id}`,
        payload
      );

    return data;

  };

// --- Dock groups ---

export const createDockGroup =
  async (payload) => {

    const { data } =
      await api.post(
        "/dock-groups",
        payload
      );

    return data;

  };

export const updateDockGroup =
  async (id, payload) => {

    const { data } =
      await api.put(
        `/dock-groups/${id}`,
        payload
      );

    return data;

  };

// --- Docks ---

export const createDock =
  async (payload) => {

    const { data } =
      await api.post(
        "/docks",
        payload
      );

    return data;

  };

export const createDocksBulk =
  async (payload) => {

    const { data } =
      await api.post(
        "/docks/bulk",
        payload
      );

    return data;

  };

export const updateDock =
  async (id, payload) => {

    const { data } =
      await api.put(
        `/docks/${id}`,
        payload
      );

    return data;

  };
