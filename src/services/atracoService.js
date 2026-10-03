import api from "../api/axios";

export const createAtraco =
  async (payload) => {

    const { data } =
      await api.post(
        "/atracos",
        payload
      );

    return data;

  };

export const getAtracoByCheckIn =
  async (checkInId) => {

    const { data } =
      await api.get(
        `/atracos/by-checkin/${checkInId}`
      );

    return data;

  };
