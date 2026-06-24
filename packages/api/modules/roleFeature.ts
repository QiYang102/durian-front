import { DefaultError, UseMutationOptions } from "@tanstack/react-query";

import { axiosClient } from "../axios";
import { Meta, QueryParams } from "../types";
import { buildQueryString, combineIncludeData } from "../utils/dynamicRest";
import { useFetch } from "../utils/fetch";
import { Feature, Role, RoleFeature } from "../types/models/role";

export const listAllRoleFeature = (
  type: string[],
  params: QueryParams = {
    per_page: 1000,
  },
  objectStitching = {},
) => {
  const { query } = useFetch();

  const getData = () =>
    axiosClient
      .get("/role-features", {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => combineIncludeData(response.data, objectStitching))
      .then((data) => ({
        roleFeatures: data?.["role-features"] ?? [],
        meta: data?.meta ?? {},
      }));

  return query<{ roleFeatures: RoleFeature[]; meta: Meta }>(
    ["list-role-features"].concat(type),
    getData,
  );
};

type BulkUpdateInput = {
  roleId: number;
  featureIds: number[];
  name?: string;
  code?: string;
};

type BulkUpdateResponse = {
  role: Role;
  "role-features": RoleFeature[];
};

export const useBulkUpdateRoleFeatures = (
  opts?: UseMutationOptions<BulkUpdateResponse, DefaultError, BulkUpdateInput>,
) => {
  const { mutate } = useFetch();

  const postData = (data: BulkUpdateInput): Promise<BulkUpdateResponse> =>
    axiosClient
      .post(`/roles/${data.roleId}/update-role-with-feature`, {
        feature_ids: data.featureIds,
        name: data.name,
        code: data.code,
      })
      .then((response) => response.data);

  return mutate<BulkUpdateResponse, BulkUpdateInput>(
    ["bulk-update-role-features"],
    [["list-of-role-feature"], ["role-detail"], ["list-of-roles"]],
    postData,
    opts,
  );
};

type Payload = {
  name: string;
  code: string;
  feature_ids?: number[];
};

type Response = {
  role: Role;
  "role-features": RoleFeature[];
};

export const useCreateRoleWithFeatures = (
  opts?: UseMutationOptions<Response, DefaultError, Payload>,
) => {
  const { mutate } = useFetch();

  const postData = (data: Payload) =>
    axiosClient
      .post("/roles/create-role", data)
      .then((response) => response.data);

  return mutate<Response, Payload>(
    ["create-role-with-features"],
    [["list-of-roles"]],
    postData,
    opts,
  );
};
