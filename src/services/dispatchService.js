import api from "../api/axios";

export const createDispatch =
  async (payload) => {

    const { data } =
      await api.post(
        "/dispatches",
        payload
      );

    return data;

  };