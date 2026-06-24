import { AxiosError } from "axios";

export const isTokenExpiredError = (error: AxiosError) => {
  return (
    error.response?.status === 401 &&
    // @ts-ignore
    error.response?.data?.code === "token_not_valid"
  );
};
