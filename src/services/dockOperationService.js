import api from "../api/axios";

export const assignDock =
  async (payload) => {

    const { data } =
      await api.post(
        "/dock-operations/assign",
        payload
      );

    return data;

  };

export const getActiveOperations =
  async () => {

    const { data } =
      await api.get(
        "/dock-operations/active"
      );

    return data;

  };

export const finishDockOperation =
  async (payload) => {

    const { data } =
      await api.post(
        "/dock-operations/finish",
        payload
      );

    return data;

  };
