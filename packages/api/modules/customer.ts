import { UseMutationOptions } from "@tanstack/react-query";
import { axiosClient } from "../axios";
import { useFetch } from "../utils/fetch";
import { Meta, QueryParams } from "../types";
import { User } from "../types/models/customer";
import { buildQueryString, combineIncludeData } from "../utils/dynamicRest";

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

export const useCreateUser = (opts?: UseMutationOptions<{ user: User }, any>) => {
  const { mutate } = useFetch();

  const postData = (data: any) =>
    axiosClient.post("/users", data).then((response) => response.data);

  return mutate<{ user: User }, any>(["users"], [], postData, {
    ...opts,
  });
};

export const useEditUser = (opts?: UseMutationOptions<{ user: User }, any>) => {
  const { mutate } = useFetch();

  const postData = (data: { id: string }) =>
    axiosClient
      .put(`/users/${data.id}`, data)
      .then((response) => response.data);

  return mutate<{ user: User }, any>(["update-user"], [["list-of-users"], ["user-detail"]], postData, {
    ...opts,
  });
};

export const getSingleUser = (
  type: string[],
  id: number,
  params: QueryParams,
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
      .then((response) => {
        const responseData = response.data;
        const combinedData = combineIncludeData(responseData, objectStitching);
        return {
          user: combinedData?.["user"] ?? {},
        };
        // user: data?.["data"]?.["user"] ?? {},
      });

  return query<{ user: User }>(["user-detail"].concat(type), postData, {
    ...options,
  });
};

export const useDeleteUser = (opts?: UseMutationOptions<any, any>) => {
  const { mutate } = useFetch();

  const deleteData = (id: string) =>
    axiosClient.delete(`/users/${id}`).then((response) => response.data);

  return mutate<any, any>(["users"], [["list-of-users"]], deleteData, {
    ...opts,
  });
};

export const useUpdateRole = (opts?: UseMutationOptions<{ user: User }, any>) => {
  const { mutate } = useFetch();

  const updateRole = (data: { id: string; role: string }) =>
    axiosClient
      .post(`/users/${data.id}/update_role/`, { role: data.role })
      .then((response) => response.data);

  return mutate<{ user: User }, any>(["update-role"], [["list-of-users"]], updateRole, {
    ...opts,
  });
};

export const useDeclareProfileValid = (opts?: UseMutationOptions<{ user: User }, any>) => {
  const { mutate } = useFetch();

  const declareProfileValid = (data: { id: string }) =>
    axiosClient
      .post(`/users/${data.id}/declare_profile_valid/`)
      .then((response) => response.data);

  return mutate<{ user: User }, any>(["declare-profile"], [["list-of-users"]], declareProfileValid, {
    ...opts,
  });
};

export const useUploadOkuDocument = (opts?: UseMutationOptions<{ user: User }, any>) => {
  const { mutate } = useFetch();

  const uploadOkuDocument = (data: { id: string; file: File }) => {
    const formData = new FormData();
    formData.append('file', data.file);
    
    return axiosClient
      .post(`/users/${data.id}/upload_oku_document`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => response.data);
  };

  return mutate<{ user: User }, any>(["upload-oku"], [["list-of-users"]], uploadOkuDocument, {
    ...opts,
  });
};

export const useRemoveOkuDocument = (opts?: UseMutationOptions<{ user: User }, any>) => {
  const { mutate } = useFetch();

  const removeOkuDocument = (data: { id: string }) =>
    axiosClient
      .post(`/users/${data.id}/remove_oku_document`)
      .then((response) => response.data);

  return mutate<{ user: User }, any>(["remove-oku"], [["list-of-users"]], removeOkuDocument, {
    ...opts,
  });
};

export const getIncludeInactiveUsers = (
  type: string[],
  params: QueryParams = {
    per_page: 10,
  },
  objectStitching = {},
  options = {},
) => {
  const { query } = useFetch();

  const getUsers = () =>
    axiosClient
      .get("/users/include_inactive/", {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => combineIncludeData(response.data, objectStitching))
      .then((data) => ({
        users: data?.["users"] ?? [],
        meta: data?.meta ?? {},
      }));

  return query<{ users: User[]; meta: Meta }>(
    ["include-inactive-users"].concat(type),
    getUsers,
    {
      ...options,
    }
  );
};