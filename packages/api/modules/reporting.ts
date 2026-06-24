import { axiosClient } from "../axios";
import { useFetch } from "../utils/fetch";
import { CapacityReport, UserStatistics } from "../types/models/reporting";

export const getBurndownChart = (
  type: string[],
  params: { iteration: string },
  options = {},
) => {
  const { query } = useFetch();

  const getData = () =>
    axiosClient
      .get("/reporting/burndown-chart/", { params })
      .then((response) => response.data);

  return query<any>(["burndown-chart"].concat(type), getData, {
    ...options,
  });
};

export const getHoursBurndownChart = (
  type: string[],
  params: { iteration: string },
  options = {},
) => {
  const { query } = useFetch();

  const getData = () =>
    axiosClient
      .get("/reporting/hours-burndown-chart/", { params })
      .then((response) => response.data);

  return query<any>(["hours-burndown-chart"].concat(type), getData, {
    ...options,
  });
};

export const getPieChartProjects = (
  type: string[],
  params: { iteration: string },
  options = {},
) => {
  const { query } = useFetch();

  const getData = () =>
    axiosClient
      .get("/reporting/pie-chart-projects/", { params })
      .then((response) => response.data);

  return query<any>(["pie-chart-projects"].concat(type), getData, {
    ...options,
  });
};

export const getUserTaskStatistics = (
  type: string[],
  params: { iteration?: string; team?: string },
  options = {},
) => {
  const { query } = useFetch();

  const getData = () =>
    axiosClient
      .get("/reporting/user-task-statistics/", {
        params,
      })
      .then((response) => response.data);

  return query<{ result: UserStatistics[] }>(
    ["user-task-statistics"].concat(type),
    getData,
    {
      ...options,
    },
  );
};

export const getProjectStoryReporting = (
  type: string[],
  params: { iteration: string; team?: string },
  options = {},
) => {
  const { query } = useFetch();

  const getData = () =>
    axiosClient
      .get("/reporting/project-story-reporting/", { params })
      .then((response) => response.data);

  return query<any>(["project-story-reporting"].concat(type), getData, {
    ...options,
  });
};

export const getFirstUserAchieveEffort = (
  type: string[],
  params: { iteration: string; team?: string },
  options = {},
) => {
  const { query } = useFetch();

  const getData = () =>
    axiosClient
      .get("/reporting/first-user-achieve-effort/", { params })
      .then((response) => response.data);

  return query<any>(["first-user-achieve-effort"].concat(type), getData, {
    ...options,
  });
};

export const useGetCapacityReport = (
  type: string[],
  params: { team_id: string; period: string; iteration?: number },
  options = {},
) => {
  const { query } = useFetch();

  const getData = () =>
    axiosClient
      .get("/reporting/capacity-reporting", { params })
      .then((response) => response.data);

  return query<CapacityReport>(["capacity-report"].concat(type), getData, {
    ...options,
  });
};
