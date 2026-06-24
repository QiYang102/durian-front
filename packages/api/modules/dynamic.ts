import { axiosClient } from "../axios";
import { QueryParams } from "../types";
import { buildQueryString, combineIncludeData } from "../utils/dynamicRest";
import { useFetch } from "../utils/fetch";

export const useDynamicGetList = (
  url: string,
  type: any[],
  params: QueryParams,
  objectStitching = {},
  options: {} = {},
) => {
  if (!url) {
    throw new Error("url is required");
  }

  const { infiniteQuery } = useFetch();

  const getDynamicData = async ({ pageParam }) => {
    return await axiosClient
      .get(url, {
        params: { page: pageParam, ...params },
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => combineIncludeData(response.data, objectStitching));
  };

  return infiniteQuery(
    ["dynamicGetList"].concat(type),
    getDynamicData,
    options,
  );
};
