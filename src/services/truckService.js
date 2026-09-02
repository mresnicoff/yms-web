import api from "../api/axios";

export const getTrucks =
  async () => {

    const { data } =
      await api.get(
        "/trucks"
      );

    return data;

  };

export const createTruck =
  async (payload) => {

    const { data } =
      await api.post(
        "/trucks",
        payload
      );

    return data;

  };

export const updateTruck =
  async (id, payload) => {

    const { data } =
      await api.put(
        `/trucks/${id}`,
        payload
      );

    return data;

  };

export const deleteTruck =
  async (id) => {

    await api.delete(
      `/trucks/${id}`
    );

  };