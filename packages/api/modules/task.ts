import { UseMutationOptions } from "@tanstack/react-query";
import { axiosClient } from "../axios";
import { useFetch } from "../utils/fetch";
import { Meta, QueryParams } from "../types";
import { Task } from "../types/models/task";
import { TaskHour } from "../types/models/taskHour";
import { buildQueryString, combineIncludeData } from "../utils/dynamicRest";

export const listTasks = (
  type: string[],
  params: QueryParams = {
    per_page: 10,
  },
  objectStitching = {},
  options = {},
) => {
  const { query } = useFetch();

  const getTasks = () =>
    axiosClient
      .get("/tasks", {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => combineIncludeData(response.data, objectStitching))
      .then((data) => ({
        tasks: data?.["tasks"] ?? [],
        meta: data?.meta ?? {},
      }));

  return query<{ tasks: Task[]; meta: Meta }>(
    ["list-of-tasks"].concat(type),
    getTasks,
    {
      ...options,
    },
  );
};

export const getSingleTask = (
  type: string[],
  id: number,
  params: QueryParams,
  objectStitching = {},
  options = {},
) => {
  const { query } = useFetch();

  const getTask = () =>
    axiosClient
      .get(`/tasks/${id}`, {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => {
        const responseData = response.data;
        const combinedData = combineIncludeData(responseData, objectStitching);
        return {
          task: combinedData?.["task"] ?? {},
        };
      });

  return query<{ task: Task }>(["task-detail"].concat(type), getTask, {
    ...options,
  });
};

export const useCreateTask = (
  opts?: UseMutationOptions<{ task: Task }, any>,
) => {
  const { mutate } = useFetch();

  const postData = (data: any) =>
    axiosClient.post("/tasks", data).then((response) => response.data);

  return mutate<{ task: Task }, any>(
    ["tasks"],
    [
      ["list-of-tasks"],
      ["incomplete-stories"],
      ["list-of-stories"],
      ["story-detail"],
      ["deployment-pending"],
      ["deployment-staging"],
      ["deployment-production"],
    ],
    postData,
    {
      ...opts,
    },
  );
};

export const useEditTask = (opts?: UseMutationOptions<{ task: Task }, any>) => {
  const { mutate } = useFetch();

  const putData = (data: { id: string }) =>
    axiosClient
      .put(`/tasks/${data.id}`, data)
      .then((response) => response.data);

  return mutate<{ task: Task }, any>(
    ["update-task"],
    [
      ["list-of-tasks"],
      ["task-detail"],
      ["incomplete-stories"],
      ["list-of-stories"],
      ["story-detail"],
    ],
    putData,
    {
      ...opts,
    },
  );
};

export const useDeleteTask = (opts?: UseMutationOptions<any, any>) => {
  const { mutate } = useFetch();

  const deleteData = (id: string) =>
    axiosClient.delete(`/tasks/${id}`).then((response) => response.data);

  return mutate<any, any>(
    ["tasks"],
    [
      ["list-of-tasks"],
      ["incomplete-stories"],
      ["list-of-stories"],
      ["story-detail"],
    ],
    deleteData,
    {
      ...opts,
    },
  );
};

export const listTaskHours = (
  type: string[],
  params: QueryParams = {
    per_page: 10,
  },
  objectStitching = {},
) => {
  const { query } = useFetch();

  const getTaskHours = () =>
    axiosClient
      .get("/task-hours", {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => combineIncludeData(response.data, objectStitching))
      .then((data) => ({
        taskHours: data?.["task-hours"] ?? [],
        meta: data?.meta ?? {},
      }));

  return query<{ taskHours: TaskHour[]; meta: Meta }>(
    ["list-of-task-hours"].concat(type),
    getTaskHours,
  );
};

export const getSingleTaskHour = (
  type: string[],
  id: number,
  params: QueryParams,
  objectStitching = {},
  options = {},
) => {
  const { query } = useFetch();

  const getTaskHour = () =>
    axiosClient
      .get(`/task-hours/${id}`, {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => {
        const responseData = response.data;
        const combinedData = combineIncludeData(responseData, objectStitching);
        return {
          taskHour: combinedData?.["task-hour"] ?? {},
        };
      });

  return query<{ taskHour: TaskHour }>(
    ["task-hour-detail"].concat(type),
    getTaskHour,
    {
      ...options,
    },
  );
};

export const useCreateTaskHour = (
  opts?: UseMutationOptions<{ taskHour: TaskHour }, any>,
) => {
  const { mutate } = useFetch();

  const postData = (data: any) =>
    axiosClient.post("/task-hours", data).then((response) => response.data);

  return mutate<{ taskHour: TaskHour }, any>(
    ["task-hours"],
    [["list-of-task-hours"], ["list-of-tasks"]],
    postData,
    {
      ...opts,
    },
  );
};

export const useEditTaskHour = (
  opts?: UseMutationOptions<{ taskHour: TaskHour }, any>,
) => {
  const { mutate } = useFetch();

  const putData = (data: { id: string }) =>
    axiosClient
      .put(`/task-hours/${data.id}`, data)
      .then((response) => response.data);

  return mutate<{ taskHour: TaskHour }, any>(
    ["update-task-hour"],
    [
      ["list-of-task-hours"], 
      ["task-hour-detail"],
      ["list-of-tasks"],
      ["task-detail"],
    ],
    putData,
    {
      ...opts,
    },
  );
};

export const useDeleteTaskHour = (opts?: UseMutationOptions<any, any>) => {
  const { mutate } = useFetch();

  const deleteData = (id: string) =>
    axiosClient.delete(`/task-hours/${id}`).then((response) => response.data);

  return mutate<any, any>(
    ["task-hours"],
    [["list-of-task-hours"]],
    deleteData,
    {
      ...opts,
    },
  );
};

export const useToggleTaskIssue = (opts?: UseMutationOptions<any, any>) => {
  const { mutate } = useFetch();

  const toggleIssue = (data: { taskId: number }) =>
    axiosClient
      .post(`/tasks/${data.taskId}/toggle-issue`)
      .then((response) => response.data);

  return mutate<any, any>(
    ["toggle-task-issue"],
    [
      ["list-of-tasks"],
      ["task-detail"],
      ["incomplete-stories"],
      ["list-of-stories"],
      ["story-detail"],
      ["deployment-pending"],
      ["deployment-staging"],
      ["deployment-production"],
    ],
    toggleIssue,
    {
      ...opts,
    },
  );
};
