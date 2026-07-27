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