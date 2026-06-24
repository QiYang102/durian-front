import { UseMutationOptions } from "@tanstack/react-query";
import { axiosClient } from "../axios";
import { useFetch } from "../utils/fetch";
import { QueryParams } from "../types";
import { buildQueryString, combineIncludeData } from "../utils/dynamicRest";
import { Role } from "../types/models/role";

export const useSampleDeleteRole = (opts?: UseMutationOptions<{}, {}>) => {
  const { mutate } = useFetch();

  const postData = (roleId) =>
    axiosClient.delete(`/roles/${roleId}`).then((response) => response.data);

  return mutate<any, any>(["delete-role"], [["list-of-roles"]], postData, {
    ...opts,
  });
};

export const useSampleGetRole = (
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
