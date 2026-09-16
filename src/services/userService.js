import api from "../api/axios";

export const getUsers =
  async () => {

    const { data } =
      await api.get(
        "/users"
      );

    return data;

  };

export const getRoles =
  async () => {

    const { data } =
      await api.get(
        "/users/roles"
      );

    return data;

  };

export const createUser =
  async (payload) => {

    const { data } =
      await api.post(
        "/users",
        payload
      );

    return data;

  };

export const updateUser =
  async (id, payload) => {

    const { data } =
      await api.put(
        `/users/${id}`,
        payload
      );

    return data;

  };

export const resetUserPassword =
  async (id, password) => {

    const { data } =
      await api.put(
        `/users/${id}/reset-password`,
        { password }
      );

    return data;

  };
