import { UseMutationOptions } from "@tanstack/react-query";
import { axiosClient } from "../axios";
import { Meta, QueryParams } from "../types";
import { Role } from "../types/models/role";
import { buildQueryString, combineIncludeData } from "../utils/dynamicRest";
import { useFetch } from "../utils/fetch";

export const useListRole = (
  type: string[],
  params: QueryParams = {
    per_page: 10,
  },
  objectStitching = {},
) => {
  const { query } = useFetch();

  const getData = () =>
    axiosClient
      .get("/roles", {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => combineIncludeData(response.data, objectStitching))
      .then((data) => ({
        roles: data?.["roles"] ?? [],
        meta: data?.meta ?? {},
      }));

  return query<{ roles: Role[]; meta: Meta }>(
    ["list-of-roles"].concat(type),
    getData,
  );
};

export const useDeleteRole = (opts?: UseMutationOptions<{}, {}>) => {
  const { mutate } = useFetch();

  const postData = (roleId) =>
    axiosClient.delete(`/roles/${roleId}`).then((response) => response.data);

  return mutate<any, any>(["delete-role"], [["list-of-roles"]], postData, {
    ...opts,
  });
};

export const getSingleRoleList = (
  type: string[],
  id: string,
  params: QueryParams,
  objectStitching = {},
  options = {},
) => {
  const { query } = useFetch();

  const getRole = () =>
    axiosClient
      .get(`/roles/${id}`, {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => {
        const responseData = response.data;
        const combinedData = combineIncludeData(responseData, objectStitching);
        return {
          role: combinedData?.["role"] ?? {},
        };
      });

  return query<{ role: Role }>(["get-role"].concat(type), getRole, {
    ...options,
  });
};

export const useCreateRole = (
  opts?: UseMutationOptions<{ role: Role }, 
  {}>,
) => {
  const { mutate } = useFetch();

  const postData = (data) =>
    axiosClient
      .post("/roles", data)
      .then(async (response) => response.data);

  return mutate<{ role: Role }, {}>(
    ["create-role"],
    [["list-of-roles"]],
    postData
  );
};

export const useEditRole = (
  opts?: UseMutationOptions<{ role: Role }, 
  {}>,
) => {
  const { mutate } = useFetch();

  const postData = (data: { id: string }) =>
    axiosClient
      .put(`/roles/${data.id}`, data)
      .then(async (response) => response.data);

  return mutate<{ role: Role }, {}>(
    ["edit-role"],
    [
      ["list-of-roles"],
      ["role-detail"],
    ],
    postData
  );
};