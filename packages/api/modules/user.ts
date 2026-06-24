import { axiosClient } from "../axios";
import { Meta, QueryParams } from "../types";
import { User } from "../types/models/user";
import { buildQueryString, combineIncludeData } from "../utils/dynamicRest";
import { useFetch } from "../utils/fetch";
import { UseMutationOptions } from "@tanstack/react-query";

export const listUsers = (
  type: string[],
  params: QueryParams = {
    per_page: 10,
  },
  objectStitching = {},
) => {
  const { query } = useFetch();

  const getUser = () =>
    axiosClient
      .get("/users", {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => combineIncludeData(response.data, objectStitching))
      .then((data) => ({
        users: data?.["users"] ?? [],
        meta: data?.meta ?? {},
      }));

  return query<{ users: User[]; meta: Meta }>(
    ["list-of-users"].concat(type),
    getUser,
  );
};

export const getSingleUser = (id) =>
  axiosClient.get(`/users/${id}`).then((response) => {
    return response.data["user"] ?? {};
  });

export const useResetPassword = () => {
  const { mutate } = useFetch();

  const resetPassword = (data) =>
    axiosClient
      .post(`/rest-auth/password/change/`, data)
      .then((response) => response.data);

  return mutate(["reset-password"], ["user-password-reset"], resetPassword);
};

export const useSetDeviceToken = () => {
  const { mutate } = useFetch();

  const setDeviceToken = (data: { id: string; device_token: string }) => {
    console.log("setDeviceToken", data);
    return axiosClient
      .post(`/users/${data.id}/set-device-token`, data)
      .then((response) => response.data);
  };

  return mutate<{ user: User }, {}>(["set-device-token"], [], setDeviceToken);
};

export const createUser = (opts?: UseMutationOptions<{ user: User }, {}>) => {
  const { mutate } = useFetch();

  const postData = (data) =>
    axiosClient.post("/users", data).then(async (response) => response.data);

  return mutate<{ user: User }, {}>(["users"], [], postData, opts);
};

export const editUser = (opts?: UseMutationOptions<{ user: User }, any>) => {
  const { mutate } = useFetch();

  const postData = (formData: FormData) => {
    return axiosClient
      .post(`/users/${formData.get("id")}/edit_user`, formData)
      .then((res) => res.data);
  };
  return mutate<{ user: User }, any>(
    ["update-user"],
    [["list-of-users"]],
    postData,
    { ...opts },
  );
};

export const getSingleUserList = (
  type: string[],
  id: number,
  params: QueryParams = {
    per_page: 10,
  },
  objectStitching = {},
  options = {},
) => {
  const { query } = useFetch();

  const postData = () =>
    axiosClient
      .get(`/users/${id}`, {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })

      .then((data) => ({
        user: data?.["data"]?.["user"] ?? {},
      }));

  return query<{ user: User }>(["user-detail"].concat(type), postData, {
    ...options,
  });
};

export const deleteUser = () => {
  const { mutate } = useFetch();

  const deleteData = (id) =>
    axiosClient.delete(`/users/${id}`).then(async (response) => response.data);

  return mutate<{ user: User }, {}>(["users"], [], deleteData);
};

export const useUploadUserImage = (
  opts?: UseMutationOptions<{ user: User }, any>,
) => {
  const { mutate } = useFetch();

  const uploadData = (data: { id: string; image: File }) => {
    const formData = new FormData();
    formData.append("image", data.image);

    return axiosClient
      .post(`/users/${data.id}/upload_image`, formData)
      .then((response) => response.data);
  };

  return mutate<{ user: User }, any>(
    ["upload-user-image"],
    [["list-of-users"], ["user-detail"]],
    uploadData,
    { ...opts },
  );
};

export const useDeleteUserImage = (opts?: UseMutationOptions<{}, {}>) => {
  const { mutate } = useFetch();

  const deleteData = (userId: string) =>
    axiosClient
      .post(`/users/${userId}/delete_image`)
      .then((response) => response.data);

  return mutate<any, any>(
    ["delete-user-image"],
    [["list-of-users"], ["user-detail"]],
    deleteData,
    {
      ...opts,
    },
  );
};
