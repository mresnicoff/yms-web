import api from "../api/axios";

export const getAppointments = async () => {
  const { data } = await api.get("/appointments");
  return data;
};

export const createAppointment = async (payload) => {
  const { data } = await api.post(
    "/appointments",
    payload
  );

  return data;
};