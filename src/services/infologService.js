import api from "../api/axios";

export const syncInfologTrips =
  async (payload) => {

    const { data } =
      await api.post(
        "/infolog/sync",
        payload
      );

    return data;

  };
