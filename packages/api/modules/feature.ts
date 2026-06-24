import { axiosClient } from "../axios";
import { Meta, QueryParams } from "../types";
import { Feature } from "../types/models/role";
import { buildQueryString, combineIncludeData } from "../utils/dynamicRest";
import { useFetch } from "../utils/fetch";

export const listFeatureTree = (
  type: string[] = [],
  params: QueryParams = {},
) => {
  const { query } = useFetch();

  const getFeatureTree = () =>
    axiosClient
      .get("/features/get-feature", {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => response.data ?? []);

  return query<any>(["feature-tree"].concat(type), getFeatureTree);
};

export const useListFeatures = (
  type: string[],
  params: QueryParams = {
    per_page: 1000,
  },
  objectStitching = {},
) => {
  const { query } = useFetch();

  const getData = () =>
    axiosClient
      .get("/features", {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => combineIncludeData(response.data, objectStitching))
      .then((data) => ({
        features: data?.["features"] ?? [],
        meta: data?.meta ?? {},
      }));

  return query<{ features: Feature[]; meta: Meta }>(
    ["list-features"].concat(type),
    getData,
  );
};