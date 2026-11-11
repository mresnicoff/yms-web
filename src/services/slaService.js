import api from "../api/axios";

export const getSlaReport = async (params) => {

  const { data } = await api.get("/sla", { params });

  return data;

};
