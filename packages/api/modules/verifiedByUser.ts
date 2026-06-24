import { UseMutationOptions } from "@tanstack/react-query";
import { axiosClient } from "../axios";
import { useFetch } from "../utils/fetch";
import { Meta, QueryParams } from "../types";
import { VerifiedByUser } from "../types/models/verifiedByUser";
import { buildQueryString, combineIncludeData } from "../utils/dynamicRest";

export const listVerifiedByUsers = (
  type: string[],
  params: QueryParams = {
    per_page: 10,
  },
  objectStitching = {},
) => {
  const { query } = useFetch();

  const getVerifiedByUsers = () =>
    axiosClient
      .get("/verified-by-users", {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => combineIncludeData(response.data, objectStitching))
      .then((data) => ({
        verifiedByUsers: data?.["verified-by-users"] ?? [],
        meta: data?.meta ?? {},
      }));

  return query<{ verifiedByUsers: VerifiedByUser[]; meta: Meta }>(
    ["list-of-verified-by-users"].concat(type),
    getVerifiedByUsers,
  );
};

export const getSingleVerifiedByUser = (
  type: string[],
  id: number,
  params: QueryParams,
  objectStitching = {},
  options = {},
) => {
  const { query } = useFetch();

  const getData = () =>
    axiosClient
      .get(`/verified-by-users/${id}`, {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => {
        const responseData = response.data;
        const combinedData = combineIncludeData(responseData, objectStitching);
        return {
          verifiedByUser: combinedData?.["verified-by-user"] ?? {},
        };
      });

  return query<{ verifiedByUser: VerifiedByUser }>(
    ["verified-by-user-detail"].concat(type),
    getData,
    {
      ...options,
    },
  );
};

export const useCreateVerifiedByUser = (
  opts?: UseMutationOptions<{ verifiedByUser: VerifiedByUser }, any>,
) => {
  const { mutate } = useFetch();

  const postData = (data: any) =>
    axiosClient
      .post("/verified-by-users", data)
      .then((response) => response.data);

  return mutate<{ verifiedByUser: VerifiedByUser }, any>(
    ["verified-by-users"],
    [["list-of-verified-by-users"]],
    postData,
    {
      ...opts,
    },
  );
};

export const useEditVerifiedByUser = (
  opts?: UseMutationOptions<{ verifiedByUser: VerifiedByUser }, any>,
) => {
  const { mutate } = useFetch();

  const postData = (data: { id: string }) =>
    axiosClient
      .put(`/verified-by-users/${data.id}`, data)
      .then((response) => response.data);

  return mutate<{ verifiedByUser: VerifiedByUser }, any>(
    ["update-verified-by-user"],
    [["list-of-verified-by-users"], ["verified-by-user-detail"]],
    postData,
    {
      ...opts,
    },
  );
};

export const useDeleteVerifiedByUser = (
  opts?: UseMutationOptions<any, any>,
) => {
  const { mutate } = useFetch();

  const deleteData = (id: string) =>
    axiosClient
      .delete(`/verified-by-users/${id}`)
      .then((response) => response.data);

  return mutate<any, any>(
    ["verified-by-users"],
    [["list-of-verified-by-users"]],
    deleteData,
    {
      ...opts,
    },
  );
};
