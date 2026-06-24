import { UseMutationOptions } from "@tanstack/react-query";
import { axiosClient } from "../axios";
import { useFetch } from "../utils/fetch";
import { Meta, QueryParams } from "../types";
import { Announcement } from "../types/models/announcement";
import { buildQueryString, combineIncludeData } from "../utils/dynamicRest";

export const listAnnouncements = (
  type: string[],
  params: QueryParams = {
    per_page: 10,
  },
  objectStitching = {},
) => {
  const { query } = useFetch();

  const getAnnouncements = () =>
    axiosClient
      .get("/announcements", {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => combineIncludeData(response.data, objectStitching))
      .then((data) => ({
        announcements: data?.["announcements"] ?? [],
        meta: data?.meta ?? {},
      }));

  return query<{ announcements: Announcement[]; meta: Meta }>(
    ["list-of-announcements"].concat(type),
    getAnnouncements,
  );
};

export const listLiveAnnouncements = (
  type: string[],
  params: QueryParams = {},
  objectStitching = {},
) => {
  const { query } = useFetch();

  const getLiveAnnouncements = () =>
    axiosClient
      .get("/announcements/live", {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => combineIncludeData(response.data, objectStitching))
      .then((data) => ({
        announcements: data?.["announcements"] ?? [],
        meta: data?.meta ?? {},
      }));

  return query<{ announcements: Announcement[]; meta: Meta }>(
    ["list-of-live-announcements"].concat(type),
    getLiveAnnouncements,
  );
};

export const getSingleAnnouncement = (
  type: string[],
  id: number,
  params: QueryParams,
  objectStitching = {},
  options = {},
) => {
  const { query } = useFetch();

  const getData = () =>
    axiosClient
      .get(`/announcements/${id}`, {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => {
        const responseData = response.data;
        const combinedData = combineIncludeData(responseData, objectStitching);
        return {
          announcement: combinedData?.["announcement"],
        };
      });

  return query<{ announcement: Announcement }>(
    ["announcement-detail"].concat(type),
    getData,
    {
      ...options,
    }
  );
};

export const useCreateAnnouncement = (
  opts?: UseMutationOptions<{ announcement: Announcement }, any>
) => {
  const { mutate } = useFetch();

  const postData = (data: any) =>
    axiosClient
      .post("/announcements", data)
      .then((response) => response.data);

  return mutate<{ announcement: Announcement }, any>(
    ["announcements"],
    [],
    postData,
    {
      ...opts,
    }
  );
};

export const useEditAnnouncement = (
  opts?: UseMutationOptions<{ announcement: Announcement }, any>
) => {
  const { mutate } = useFetch();

  const postData = (data: { id: string }) =>
    axiosClient
      .put(`/announcements/${data.id}`, data)
      .then((response) => response.data);

  return mutate<{ announcement: Announcement }, any>(
    ["update-announcement"],
    [["list-of-announcements"], ["announcement-detail"], ["list-of-live-announcements"]],
    postData,
    {
      ...opts,
    }
  );
};

export const useDeleteAnnouncement = (opts?: UseMutationOptions<any, any>) => {
  const { mutate } = useFetch();

  const deleteData = (id: string) =>
    axiosClient
      .delete(`/announcements/${id}`)
      .then((response) => response.data);

  return mutate<any, any>(
    ["announcements"],
    [["list-of-announcements"], ["list-of-live-announcements"]],
    deleteData,
    {
      ...opts,
    }
  );
};