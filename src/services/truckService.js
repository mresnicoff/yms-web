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