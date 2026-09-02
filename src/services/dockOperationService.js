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
  export const getQueue =
  async (dockGroupId) => {

    const { data } =
      await api.get(
        `/dock-operations/queue/${dockGroupId}`
      );

    return data;

  };

export const getDocksByGroup =
  async (dockGroupId) => {

    const { data } =
      await api.get(
        `/dock-operations/docks/${dockGroupId}`
      );

    return data;

  };
  export const manualAssign =
  async (payload) => {

    const { data } =
      await api.post(
        "/dock-operations/manual-assign",
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

export const getQueue =
  async (dockGroupId) => {

    const { data } =
      await api.get(
        `/dock-operations/queue/${dockGroupId}`
      );

    return data;

  };

export const getDocksByGroup =
  async (dockGroupId) => {

    const { data } =
      await api.get(
        `/dock-operations/docks/${dockGroupId}`
      );

    return data;

  };

export const manualAssign =
  async (payload) => {

    const { data } =
      await api.post(
        "/dock-operations/manual-assign",
        payload
      );

    return data;

  };
