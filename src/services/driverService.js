import api from "../api/axios";

export const getDrivers =
  async () => {

    const { data } =
      await api.get(
        "/drivers"
      );

    return data;

  };

export const createDriver =
  async (payload) => {

    const { data } =
      await api.post(
        "/drivers",
        payload
      );

    return data;

  };

export const updateDriver =
  async (id, payload) => {

    const { data } =
      await api.put(
        `/drivers/${id}`,
        payload
      );

    return data;

  };

export const deleteDriver =
  async (id) => {

    await api.delete(
      `/drivers/${id}`
    );

  };