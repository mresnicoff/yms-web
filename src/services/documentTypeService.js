import api from "../api/axios";

export const getDocumentTypes =
  async () => {

    const { data } =
      await api.get(
        "/document-types"
      );

    return data;

  };

export const createDocumentType =
  async (payload) => {

    const { data } =
      await api.post(
        "/document-types",
        payload
      );

    return data;

  };

export const updateDocumentType =
  async (
    id,
    payload
  ) => {

    const { data } =
      await api.put(
        `/document-types/${id}`,
        payload
      );

    return data;

  };

export const deleteDocumentType =
  async (id) => {

    await api.delete(
      `/document-types/${id}`
    );

  };