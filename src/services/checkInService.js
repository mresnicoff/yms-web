import api from "../api/axios";

export const createCheckIn =
  async (payload) => {

    const { data } =
      await api.post(
        "/checkins",
        payload
      );

    return data;

  };