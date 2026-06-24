import { axiosClient } from "../axios";
import { Meta, QueryParams } from "../types";
import { Season } from "../types/models/season-summary";
import { buildQueryString, combineIncludeData } from "../utils/dynamicRest";
import { useFetch } from "../utils/fetch";

export const useListSeason = (
  type: string[],
  params: QueryParams = {
    per_page: 10,
  },
  objectStitching = {},
) => {
  const { query } = useFetch();

  const getData = () =>
    axiosClient
      .get("/season-session", {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => combineIncludeData(response.data, objectStitching))
      .then((data) => ({
        seasons: data?.["seasons"] ?? [],
        meta: data?.["meta"] ?? [],
      }));

  return query<{ seasons: Season[]; meta: Meta }>(
    ["list-of-seasons"].concat(type),
    getData,
  );
};

export const useGetSingleSeason = (
  type: string[],
  id: number,
  params: QueryParams,
  objectStitching = {},
  options = {},
) => {
  const { query } = useFetch();

  const getData = () =>
    axiosClient
      .get(`/season-session/${id}`, {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => {
        const responseData = response.data;
        const combinedData = combineIncludeData(responseData, objectStitching);
        return {
          season: combinedData?.["season"] ?? {},
        };
      });

  return query<{ season: Season }>(["season-detail"].concat(type), getData, {
    ...options,
  });
};

// export const useListSeasonName = (
//   type: string[],
//   id: number,
//   params: QueryParams,
//   objectStitching = {},
// ) => {
//   const { query } = useFetch();

//   const getData = () =>
//     axiosClient
//       .get(`/season-session/get-season-name?teamId=${id}`, {
//         params,
//         paramsSerializer: (params) => buildQueryString(params),
//       })
//       .then((response) => combineIncludeData(response.data, objectStitching))
//       .then((data) => ({
//         seasons: data?.["seasons"] ?? [],
//         meta: data?.["meta"] ?? [],
//       }));

//   return query<{ seasons: SeasonName[]; meta: Meta }>(
//     ["list-of-seasons-name"].concat(type),
//     getData,
//   );
// };
