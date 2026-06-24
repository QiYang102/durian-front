import { UseMutationOptions } from "@tanstack/react-query";
import { axiosClient } from "../axios";
import { QueryParams, Meta } from "../types";
import { StoryTag, TagReport } from "../types/models/story-tag";
import { buildQueryString, combineIncludeData } from "../utils/dynamicRest";
import { useFetch } from "../utils/fetch";

export const useListStoryTag = (
  type: string[],
  id: number,
  params: QueryParams = {},
  objectStitching = {},
  options = {},
) => {
  const { query } = useFetch();

  const getData = () =>
    axiosClient
      .get(`/stories/${id}/tags`, {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => {
        const responseData = response.data;
        const combinedData = combineIncludeData(responseData, objectStitching);
        return {
          tag: combinedData ?? {},
        };
      });

  return query<{ tag: StoryTag[]; meta: Meta }>(
    ["list-of-story-tags"].concat(type),
    getData,
    {
      ...options,
    },
  );
};

export const useCreateTag = (
  opts?: UseMutationOptions<{ tags: StoryTag }, any>,
) => {
  const { mutate } = useFetch();

  const postData = ({
    storyId,
    ...data
  }: {
    storyId: string | number;
    name: string;
    color: string;
  }) =>
    axiosClient
      .post(`/stories/${storyId}/add-tag`, data)
      .then((response) => response.data);

  return mutate<{ tags: StoryTag }, any>(
    ["add-tag"],
    [["list-of-story-tags"], ["list-of-tags"]],
    postData,
    { ...opts },
  );
};

export const useRemoveTag = (opts?: UseMutationOptions<any, any>) => {
  const { mutate } = useFetch();

  const deleteData = (data: {
    storyId: string | number;
    tagId: string | number;
  }) =>
    axiosClient
      .post(`/stories/${data.storyId}/remove-tag`, { id: data.tagId })
      .then((response) => response.data);

  return mutate<any, any>(
    ["delete-tag"],
    [["list-of-story-tags"]],
    deleteData,
    {
      ...opts,
    },
  );
};

export const useListTag = (
  type: string[],
  params: QueryParams = {
    per_page: 10,
  },
  objectStitching = {},
) => {
  const { query } = useFetch();

  const getData = () =>
    axiosClient
      .get("/tags", {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => combineIncludeData(response.data, objectStitching))
      .then((data) => ({
        tags: data?.["tags"] ?? [],
        meta: data?.["meta"] ?? [],
      }));

  return query<{ tags: StoryTag[]; meta: Meta }>(
    ["list-of-tags"].concat(type),
    getData,
  );
};

export const useGetSingleTag = (
  type: string[],
  id: number,
  params: QueryParams,
  objectStitching = {},
  options = {},
) => {
  const { query } = useFetch();

  const getData = () =>
    axiosClient
      .get(`/tags/${id}`, {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => {
        const responseData = response.data;
        const combinedData = combineIncludeData(responseData, objectStitching);
        return {
          tag: combinedData?.["tag"] ?? {},
        };
      });

  return query<{ tag: StoryTag }>(["tag-detail"].concat(type), getData, {
    ...options,
  });
};

export const useGetSingleTagReport = (
  type: string[],
  id: number,
  params: QueryParams,
  objectStitching = {},
  options = {},
) => {
  const { query } = useFetch();

  const getData = () =>
    axiosClient
      .get(`/tags/${id}/get-tag-report`, {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => {
        const responseData = response.data;
        const combinedData = combineIncludeData(responseData, objectStitching);
        return {
          result: combinedData?.["result"] ?? {},
        };
      });

  return query<{ result: TagReport }>(["tag-report"].concat(type), getData, {
    ...options,
  });
};

export const useEditTag = (
  opts?: UseMutationOptions<{ tag: StoryTag }, any>,
) => {
  const { mutate } = useFetch();

  const postData = (data: { id: string | number }) =>
    axiosClient.put(`/tags/${data.id}`, data).then((response) => response.data);

  return mutate<{ tag: StoryTag }, any>(
    ["update-tag-detail"],
    [["list-of-tags"], ["tag-detail"], ["tag-report"]],
    postData,
    { ...opts },
  );
};

export const useDeleteTag = (opts?: UseMutationOptions<any, any>) => {
  const { mutate } = useFetch();

  const deleteData = (id: string | number) =>
    axiosClient.delete(`/tags/${id}`).then((response) => response.data);

  return mutate<any, any>(["delete-tag"], [["list-of-tags"]], deleteData, {
    ...opts,
  });
};
