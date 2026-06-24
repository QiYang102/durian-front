import { UseMutationOptions } from "@tanstack/react-query";
import { axiosClient } from "../axios";
import { useFetch } from "../utils/fetch";
import { Meta, QueryParams } from "../types";
import { Team } from "../types/models/team";
import { buildQueryString, combineIncludeData } from "../utils/dynamicRest";
import { TeamMember } from "../types/models/team-member";

export const listTeams = (
  type: string[],
  params: QueryParams = {
    per_page: 10,
  },
  objectStitching = {},
) => {
  const { query } = useFetch();

  const getTeams = () =>
    axiosClient
      .get("/teams", {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => combineIncludeData(response.data, objectStitching))
      .then((data) => ({
        teams: data?.["teams"] ?? [],
        meta: data?.meta ?? {},
      }));

  return query<{ teams: Team[]; meta: Meta }>(
    ["list-of-teams"].concat(type),
    getTeams,
  );
};

export const getSingleTeam = (
  type: string[],
  id: number,
  params: QueryParams,
  objectStitching = {},
  options = {},
) => {
  const { query } = useFetch();

  const getData = () =>
    axiosClient
      .get(`/teams/${id}`, {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => {
        const responseData = response.data;
        const combinedData = combineIncludeData(responseData, objectStitching);
        return {
          team: combinedData?.["team"],
        };
      });

  return query<{ team: Team }>(["team-detail"].concat(type), getData, {
    ...options,
  });
};

export const useCreateTeam = (
  opts?: UseMutationOptions<{ team: Team }, any>,
) => {
  const { mutate } = useFetch();

  const postData = (data: any) =>
    axiosClient.post("/teams", data).then((response) => response.data);

  return mutate<{ team: Team }, any>(["teams"], [], postData, {
    ...opts,
  });
};

export const useEditTeam = (opts?: UseMutationOptions<{ team: Team }, any>) => {
  const { mutate } = useFetch();

  const postData = (data: { id: string; formData: FormData }) =>
    axiosClient
      .post(`/teams/${data.id}/edit_team`, data.formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data);

  return mutate<{ team: Team }, any>(
    ["update-team"],
    [["list-of-teams"], ["team-detail"]],
    postData,
    {
      ...opts,
    },
  );
};

export const useDeleteTeam = (opts?: UseMutationOptions<any, any>) => {
  const { mutate } = useFetch();

  const deleteData = (id: string) =>
    axiosClient.delete(`/teams/${id}`).then((response) => response.data);

  return mutate<any, any>(["teams"], [["list-of-teams"]], deleteData, {
    ...opts,
  });
};

export const useUploadTeamImage = (
  opts?: UseMutationOptions<{ team: Team }, any>,
) => {
  const { mutate } = useFetch();

  const uploadImage = (data: { id: string; image: File }) => {
    const formData = new FormData();
    formData.append("image", data.image);

    return axiosClient
      .post(`/teams/${data.id}/upload_image`, formData)
      .then((response) => response.data);
  };

  return mutate<{ team: Team }, any>(
    ["upload-team-image"],
    [["list-of-teams"], ["team-detail"]],
    uploadImage,
    {
      ...opts,
    },
  );
};

export const useDeleteTeamImage = (opts?: UseMutationOptions<{}, {}>) => {
  const { mutate } = useFetch();

  const deleteData = (teamId) =>
    axiosClient
      .post(`/teams/${teamId}/delete_image`)
      .then((response) => response.data);

  return mutate<any, any>(
    ["delete-team-image"],
    [["team-detail"], ["list-of-teams"]],
    deleteData,
    {
      ...opts,
    },
  );
};

export const listTeamMembers = (
  type: string[],
  params: QueryParams = {
    per_page: 10,
  },
  objectStitching = {},
) => {
  const { query } = useFetch();

  const getTeamMembers = () =>
    axiosClient
      .get("/team-members", {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => combineIncludeData(response.data, objectStitching))
      .then((data) => ({
        teamMembers: data?.["team-members"] ?? [],
        meta: data?.meta ?? {},
      }));

  return query<{ teamMembers: TeamMember[]; meta: Meta }>(
    ["list-of-team-members"].concat(type),
    getTeamMembers,
  );
};

export const getSingleTeamMember = (
  type: string[],
  id: number,
  params: QueryParams,
  objectStitching = {},
  options = {},
) => {
  const { query } = useFetch();

  const getData = () =>
    axiosClient
      .get(`/team-members/${id}`, {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => {
        const responseData = response.data;
        const combinedData = combineIncludeData(responseData, objectStitching);
        return {
          teamMember: combinedData?.["team-member"] ?? {},
        };
      });

  return query<{ teamMember: TeamMember }>(
    ["team-member-detail"].concat(type),
    getData,
    {
      ...options,
    },
  );
};

export const useCreateTeamMember = (
  opts?: UseMutationOptions<{ teamMember: TeamMember }, any>,
) => {
  const { mutate } = useFetch();

  const postData = (data: any) =>
    axiosClient.post("/team-members", data).then((response) => response.data);

  return mutate<{ teamMember: TeamMember }, any>(
    ["team-members"],
    [["list-of-team-members"], ["list-of-teams"]],
    postData,
    {
      ...opts,
    },
  );
};

export const useEditTeamMember = (
  opts?: UseMutationOptions<{ teamMember: TeamMember }, any>,
) => {
  const { mutate } = useFetch();

  const postData = (data: { id: string }) =>
    axiosClient
      .put(`/team-members/${data.id}`, data)
      .then((response) => response.data);

  return mutate<{ teamMember: TeamMember }, any>(
    ["update-team-member"],
    [["list-of-team-members"], ["team-member-detail"]],
    postData,
    {
      ...opts,
    },
  );
};

export const useDeleteTeamMember = (opts?: UseMutationOptions<any, any>) => {
  const { mutate } = useFetch();

  const deleteData = (id: string) =>
    axiosClient.delete(`/team-members/${id}`).then((response) => response.data);

  return mutate<any, any>(
    ["team-members"],
    [["list-of-team-members"]],
    deleteData,
    {
      ...opts,
    },
  );
};
