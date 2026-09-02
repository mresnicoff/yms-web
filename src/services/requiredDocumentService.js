import api from "../api/axios";

export const getRequiredDocuments =
  async () => {

    const { data } =
      await api.get(
        "/required-documents"
      );

    return data;

  };

export const createRequiredDocument =
  async (payload) => {

    const { data } =
      await api.post(
        "/required-documents",
        payload
      );

    return data;

  };

export const updateRequiredDocument =
  async (
    id,
    payload
  ) => {

    const { data } =
      await api.put(
        `/required-documents/${id}`,
        payload
      );

    return data;

  };

export const deleteRequiredDocument =
  async (id) => {

    await api.delete(
      `/required-documents/${id}`
    );

  };