import { UseMutationOptions } from "@tanstack/react-query";
import { axiosClient } from "../axios";
import { useFetch } from "../utils/fetch";
import { Meta, QueryParams } from "../types";
import { Story } from "../types/models/story";
import { buildQueryString, combineIncludeData } from "../utils/dynamicRest";
import { StoryImage } from "../types/models/storyImage";

export const listStories = (
  type: string[],
  params: QueryParams = {
    per_page: 10,
  },
  objectStitching = {},
  options = {},
) => {
  const { query } = useFetch();

  const getStories = () =>
    axiosClient
      .get("/stories", {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => combineIncludeData(response.data, objectStitching))
      .then((data) => ({
        stories: data?.["stories"] ?? [],
        meta: data?.meta ?? {},
      }));

  return query<{ stories: Story[]; meta: Meta }>(
    ["list-of-stories"].concat(type),
    getStories,
    {
      ...options,
    },
  );
};

export const getSingleStory = (
  type: string[],
  id: number,
  params: QueryParams,
  objectStitching = {},
  options = {},
) => {
  const { query } = useFetch();

  const getStory = () =>
    axiosClient
      .get(`/stories/${id}`, {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => {
        const responseData = response.data;
        const combinedData = combineIncludeData(responseData, objectStitching);
        return {
          story: combinedData?.["story"] ?? {},
        };
      });

  return query<{ story: Story }>(["story-detail"].concat(type), getStory, {
    ...options,
  });
};

export const useCreateStory = (
  opts?: UseMutationOptions<{ story: Story }, any>,
) => {
  const { mutate } = useFetch();

  const postData = (data: any) =>
    axiosClient.post("/stories", data).then((response) => response.data);

  return mutate<{ story: Story }, any>(["stories"], [], postData, {
    ...opts,
  });
};

export const useEditStory = (
  opts?: UseMutationOptions<{ story: Story }, any>,
) => {
  const { mutate } = useFetch();

  const putData = (data: { id: string }) =>
    axiosClient
      .put(`/stories/${data.id}`, data)
      .then((response) => response.data);

  return mutate<{ story: Story }, any>(
    ["update-story"],
    [
      ["list-of-stories"],
      ["story-detail"],
      ["incomplete-stories"],
      ["deployment-pending"],
      ["deployment-staging"],
      ["deployment-production"],
      ["list-of-tasks"],
    ],
    putData,
    {
      ...opts,
    },
  );
};

export const useDeleteStory = (opts?: UseMutationOptions<any, any>) => {
  const { mutate } = useFetch();

  const deleteData = (id: string) =>
    axiosClient.delete(`/stories/${id}`).then((response) => response.data);

  return mutate<any, any>(
    ["stories"],
    [["list-of-stories"], ["incomplete-stories"], ["story-detail"]],
    deleteData,
    {
      ...opts,
    },
  );
};

export const useMoveToLatestIteration = (
  opts?: UseMutationOptions<any, any>,
) => {
  const { mutate } = useFetch();

  const moveStory = (data: { storyId: number }) =>
    axiosClient
      .patch(`/stories/${data.storyId}/move-to-latest-iteration`)
      .then((response) => response.data);

  return mutate<any, any>(
    ["move-story-to-iteration"],
    [["list-of-stories"], ["story-detail"]],
    moveStory,
    {
      ...opts,
    },
  );
};

export const getIncompleteStory = (
  type: string[],
  params: QueryParams = {},
  objectStitching = {},
  options = {},
) => {
  const { query } = useFetch();

  const getStories = () =>
    axiosClient
      .get("/stories/get-incomplete-story", {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => combineIncludeData(response.data, objectStitching))
      .then((data) => ({
        stories: data?.["stories"] ?? data ?? [],
      }));

  return query<{ stories: Story[] }>(
    ["incomplete-stories"].concat(type),
    getStories,
    {
      ...options,
    },
  );
};

export const checkCelebration = (
  type: string[],
  params: QueryParams = {},
  options = {},
) => {
  const { query } = useFetch();

  const checkCelebrationStatus = () =>
    axiosClient
      .get("/stories/check-celebration", {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => response.data);

  return query<{
    should_celebrate: boolean;
  }>(["check-celebration"].concat(type), checkCelebrationStatus, {
    ...options,
  });
};

export const listStoryImages = (
  type: string[],
  params: QueryParams = {
    per_page: 10,
  },
  objectStitching = {},
) => {
  const { query } = useFetch();

  const getStoryImages = () =>
    axiosClient
      .get("/story-images", {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => combineIncludeData(response.data, objectStitching))
      .then((data) => ({
        storyImages: data?.["story-images"] ?? [],
        meta: data?.meta ?? {},
      }));

  return query<{ storyImages: StoryImage[]; meta: Meta }>(
    ["list-of-story-images"].concat(type),
    getStoryImages,
  );
};

export const useUploadStoryImage = (opts?: UseMutationOptions<any, any>) => {
  const { mutate } = useFetch();

  const uploadImage = (data: { story_id: string; image: File }) => {
    const formData = new FormData();
    formData.append("story_id", data.story_id);
    formData.append("image", data.image);

    return axiosClient
      .post("/story-images/storyUploadImage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => response.data);
  };

  return mutate<any, any>(
    ["upload-story-image"],
    [["list-of-story-images"]],
    uploadImage,
    {
      ...opts,
    },
  );
};

export const useDeleteStoryImage = (opts?: UseMutationOptions<any, any>) => {
  const { mutate } = useFetch();

  const deleteData = (id: string) =>
    axiosClient.delete(`/story-images/${id}`).then((response) => response.data);

  return mutate<any, any>(
    ["story-images"],
    [["list-of-story-images"]],
    deleteData,
    {
      ...opts,
    },
  );
};

export const getStoriesToBeDeploy = (
  type: string[],
  params: QueryParams = {},
  objectStitching = {},
  options = {},
) => {
  const { query } = useFetch();

  const getStories = () =>
    axiosClient
      .get("/stories/deployment-to-be-deploy", {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => combineIncludeData(response.data, objectStitching))
      .then((data) => ({
        stories: data?.["stories"] ?? data ?? [],
      }));

  return query<{ stories: Story[] }>(
    ["deployment-pending"].concat(type),
    getStories,
    {
      ...options,
    },
  );
};

export const getStoriesInStaging = (
  type: string[],
  params: QueryParams = {},
  objectStitching = {},
  options = {},
) => {
  const { query } = useFetch();

  const getStories = () =>
    axiosClient
      .get("/stories/deployment-staging", {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => combineIncludeData(response.data, objectStitching))
      .then((data) => ({
        stories: data?.["stories"] ?? data ?? [],
      }));

  return query<{ stories: Story[] }>(
    ["deployment-staging"].concat(type),
    getStories,
    {
      ...options,
    },
  );
};

export const getStoriesInProduction = (
  type: string[],
  params: QueryParams = {},
  objectStitching = {},
  options = {},
) => {
  const { query } = useFetch();

  const getStories = () =>
    axiosClient
      .get("/stories/deployment-production", {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => combineIncludeData(response.data, objectStitching))
      .then((data) => ({
        stories: data?.["stories"] ?? data ?? [],
      }));

  return query<{ stories: Story[] }>(
    ["deployment-production"].concat(type),
    getStories,
    {
      ...options,
    },
  );
};

export const getStoryboardCounts = (
  type: string[],
  params: QueryParams = {},
  options = {},
) => {
  const { query } = useFetch();

  const getCounts = () =>
    axiosClient
      .get("/stories/storyboard-counts", {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => response.data);

  return query<{
    incompleted: number;
    completed: number;
    issues: number;
  }>(["storyboard-counts"].concat(type), getCounts, {
    ...options,
  });
};
