import api from "../api/axios";

export const getDriverDocuments =
  async (driverId) => {

    const { data } =
      await api.get(
        `/documents/driver/${driverId}`
      );

    return data;

  };

  export const uploadDocument =
  async (formData) => {

    const { data } =
      await api.post(
        "/documents/upload",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data"
          }
        }
      );

    return data;

  };

export const getTruckDocuments =
  async (truckId) => {

    const { data } =
      await api.get(
        `/documents/truck/${truckId}`
      );

    return data;

  };

export const createDocument =
  async (payload) => {

    const { data } =
      await api.post(
        "/documents",
        payload
      );

    return data;

  };

export const deleteDocument =
  async (id) => {

    await api.delete(
      `/documents/${id}`
    );

  };