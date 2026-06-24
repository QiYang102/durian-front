import { UseMutationOptions } from "@tanstack/react-query";
import { axiosClient } from "../axios";
import { useFetch } from "../utils/fetch";
import { Meta, QueryParams } from "../types";
import { Iteration } from "../types/models/iteration";
import { buildQueryString, combineIncludeData } from "../utils/dynamicRest";

export const listIterations = (
  type: string[],
  params: QueryParams = {
    per_page: 10,
  },
  objectStitching = {},
) => {
  const { query } = useFetch();

  const getIterations = () =>
    axiosClient
      .get("/iterations", {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => combineIncludeData(response.data, objectStitching))
      .then((data) => ({
        iterations: data?.["iterations"] ?? [],
        meta: data?.meta ?? {},
      }));

  return query<{ iterations: Iteration[]; meta: Meta }>(
    ["list-of-iterations"].concat(type),
    getIterations,
  );
};

export const useCreateIteration = (
  opts?: UseMutationOptions<{ iteration: Iteration }, any>,
) => {
  const { mutate } = useFetch();

  const postData = (data: any) =>
    axiosClient.post("/iterations", data).then((response) => response.data);

  return mutate<{ iteration: Iteration }, any>(["iterations"], [], postData, {
    ...opts,
  });
};

export const useEditIteration = (
  opts?: UseMutationOptions<{ iteration: Iteration }, any>,
) => {
  const { mutate } = useFetch();

  const postData = (data: { id: string }) =>
    axiosClient
      .put(`/iterations/${data.id}`, data)
      .then((response) => response.data);

  return mutate<{ iteration: Iteration }, any>(
    ["update-iteration"],
    [["list-of-iterations"], ["iteration-detail"]],
    postData,
    {
      ...opts,
    },
  );
};

export const getSingleIteration = (
  type: string[],
  id: number,
  params: QueryParams,
  objectStitching = {},
  options = {},
) => {
  const { query } = useFetch();

  const getData = () =>
    axiosClient
      .get(`/iterations/${id}`, {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => {
        const responseData = response.data;
        const combinedData = combineIncludeData(responseData, objectStitching);
        return {
          iteration: combinedData?.["iteration"] ?? {},
        };
      });

  return query<{ iteration: Iteration }>(
    ["iteration-detail"].concat(type),
    getData,
    {
      ...options,
    },
  );
};

export const useDeleteIteration = (opts?: UseMutationOptions<any, any>) => {
  const { mutate } = useFetch();

  const deleteData = (id: string) =>
    axiosClient.delete(`/iterations/${id}`).then((response) => response.data);

  return mutate<any, any>(
    ["iterations"],
    [["list-of-iterations"]],
    deleteData,
    {
      ...opts,
    },
  );
};
