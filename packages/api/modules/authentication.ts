import { axiosClient } from "../axios";
import { User } from "@ttm/api/types/models/user";
import { useFetch } from "../utils/fetch";
import { UseMutationOptions } from "@tanstack/react-query";

export const useAuthGetMe = async () => {
  return await axiosClient.get("/rest-auth/user/").then((res) => res.data);
};

export const useAuthLogin = () => {
  const { mutate } = useFetch();

  const postLogin = (data: { username: string; password: string }) =>
    axiosClient
      .post("/rest-auth/login/", data, { withCredentials: false })
      .then(async (response) => response.data);

    type LoginResponse ={ access_token: string; refresh_token: string; user: User};

  return mutate<LoginResponse, { username: string; password: string }>(
    ["login"],
    [],
    postLogin,
  );
};

export const useAuthLogout = async () => {
  await axiosClient.post("/rest-auth/logout/");
};

export const useForgotPassword = (opts?: UseMutationOptions<{}, {}>) => {
  const { mutate } = useFetch();

  const postData = (data: { email: string }) =>
    axiosClient
      .post(`/rest-auth/password/reset/`, data)
      .then((response) => response.data);

  return mutate<any, any>(["forgot-password"], [], postData, {
    ...opts,
  });
};

export const useResetPasswordConfirm = (opts?: UseMutationOptions<{}, {}>) => {
  const { mutate } = useFetch();

  const postData = (data) =>
    axiosClient
      .post(`/rest-auth/password/reset/confirm/`, data)
      .then((response) => response.data);

  return mutate<any, any>(["reset-password-confirm"], [], postData, {
    ...opts,
  });
};
