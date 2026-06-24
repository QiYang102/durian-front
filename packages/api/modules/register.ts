import { UseMutationOptions } from "@tanstack/react-query";
import { axiosClient } from "../axios";
import { useFetch } from "../utils/fetch";
import { User } from "../types/models/user";


export const useRegisterUser = (
  opts?: UseMutationOptions<{ user: User }, {}>
) => {
  const { mutate } = useFetch();

  const postData = (data) =>
    axiosClient
      .post("/rest-auth/registration", {
        ...data,
        timezone: data.timezone || 'Asia/Kuala_Lumpur',
        language_code: data.language_code || 'en',
      })
      .then(async (response) => response.data);

  return mutate<{ user: User }, {}>(
    ["register-user"],
    [],
    postData,
  );
};