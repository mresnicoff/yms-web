import api from "../api/axios";

export const validateCheckIn =
  async (payload) => {

    const { data } =
      await api.post(
        "/document-validation/check-in",
        payload
      );

    return data;

  };