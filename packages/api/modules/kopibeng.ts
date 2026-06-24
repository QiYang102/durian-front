import { axiosClient } from "../axios";
import { Meta, QueryParams } from "../types";
import { buildQueryString, combineIncludeData } from "../utils/dynamicRest";
import { useFetch } from "../utils/fetch";
import { Kopibeng, OverallKopibeng } from "../types/models/kopibeng";
import { Query, UseMutationOptions } from "@tanstack/react-query";
import moment from "moment";

export const useListKopibeng = (
  type: string[],
  params: QueryParams = {
    per_page: 10,
  },
  objectStitching = {},
) => {
  const { query } = useFetch();

  const getData = () =>
    axiosClient
      .get("/kopibeng", {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => combineIncludeData(response.data, objectStitching))
      .then((data) => ({
        kopibengs: data?.["kopibengs"] ?? [],
        meta: data?.["meta"] ?? [],
      }));

  return query<{ kopibengs: Kopibeng[]; meta: Meta }>(
    ["list-of-kopibengs"].concat(type),
    getData,
  );
};

export const useListUserOverallKopibeng = (
  type: string[],
  params: QueryParams = {
    per_page: 10,
  },
  objectStitching = {},
) => {
  const { query } = useFetch();

  const getData = () =>
    axiosClient
      .get("/kopibeng/top3-user-kopibeng", {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => combineIncludeData(response.data, objectStitching))
      .then((data) => ({
        result: data?.["result"] ?? [],
      }));

  return query<{ result: OverallKopibeng[] }>(
    ["top3-kopibeng-user"].concat(type),
    getData,
  );
};

export const useCreateKopibeng = (
  opts?: UseMutationOptions<{ kopibeng: Kopibeng }, any>,
) => {
  const { mutate } = useFetch();

  const postData = (data: any) =>
    axiosClient.post("/kopibeng", data).then((response) => response.data);

  return mutate<{ kopibeng: Kopibeng }, any>(
    ["kopibeng"],
    [["list-of-kopibengs"], ["top3-kopibeng-user"]],
    postData,
    { ...opts },
  );
};

export const useGetSingleKopibeng = (
  type: string[],
  id: number,
  params: QueryParams,
  objectStitching = {},
  options = {},
) => {
  const { query } = useFetch();

  const getData = () =>
    axiosClient
      .get(`/kopibeng/${id}`, {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => {
        const responseData = response.data;
        const combinedData = combineIncludeData(responseData, objectStitching);
        return {
          kopibeng: combinedData?.["kopibeng"] ?? {},
        };
      });

  return query<{ kopibeng: Kopibeng }>(
    ["kopibeng-detail"].concat(type),
    getData,
    {
      ...options,
    },
  );
};

export const useEditKopibeng = (
  opts?: UseMutationOptions<{ kopibeng: Kopibeng }, any>,
) => {
  const { mutate } = useFetch();

  const postData = (data: { id: string | number }) =>
    axiosClient
      .put(`/kopibeng/${data.id}`, data)
      .then((response) => response.data);

  return mutate<{ kopibeng: Kopibeng }, any>(
    ["update-kopibeng-detail"],
    [["list-of-kopibengs"], ["top3-kopibeng-user"]],
    postData,
    { ...opts },
  );
};

export const useDeleteKopibeng = (opts?: UseMutationOptions<any, any>) => {
  const { mutate } = useFetch();

  const deleteData = (id: string | number) =>
    axiosClient.delete(`/kopibeng/${id}`).then((response) => response.data);

  return mutate<any, any>(
    ["delete-kopibeng"],
    [["list-of-kopibengs"], ["top3-kopibeng-user"]],
    deleteData,
    { ...opts },
  );
};
