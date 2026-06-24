import React, { createContext, useContext, useEffect, useState } from "react";

import { useAuthGetMe, useAuthLogin, useAuthLogout } from "@ttm/api";
import { User } from "@ttm/api/types/models/user";
import {
  getStorageItemAsync,
  setStorageItemAsync,
  useStorageState,
} from "@ttm/storage";
import { setGlobalLogout } from "@ttm/api/axios";

type SignInData = { username: string; password: string };

export const AuthContext = createContext<{
  signIn: (data: SignInData) => void;
  signOut: () => void;
  init: () => void;
  user: User | null;
  isPendingLogin: boolean;
  isLoading: boolean;
  isRefreshTokenLoading: boolean;
  accessToken?: string | null;
  refreshToken?: string | null;
  loginError?: Error | null;
  updateUserCheckInStatus: (isCheckedIn: boolean) => void;
  isLoggingOut: boolean;
}>({
  signIn: function (data: SignInData): void {
    throw new Error("Function not implemented.");
  },
  signOut: function (): void {
    throw new Error("Function not implemented.");
  },
  init: function (): void {
    throw new Error("Function not implemented.");
  },
  user: null,
  isPendingLogin: false,
  isLoading: false,
  isRefreshTokenLoading: false,
  updateUserCheckInStatus: () => {
    throw new Error("Function not implemented.");
  },
  isLoggingOut: false,
});

export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production" && !value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, accessToken], setAccessToken] =
    useStorageState("accessToken");
  const [[isRefreshTokenLoading, refreshToken], setRefreshToken] =
    useStorageState("refreshToken");
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const { mutateAsync: login, isPending, error: loginError } = useAuthLogin();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const signIn = async (data: SignInData): Promise<void> => {
    const res = await login(data);
    const access = res.access_token;
    const refresh = res.refresh_token;

    setAccessToken(access);
    setRefreshToken(refresh);

    setUser(res?.user);
    localStorage.setItem("user", JSON.stringify(res?.user));
  };

  const signOut = () => {
    setIsLoggingOut(true);
    // useAuthLogout();
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("outletId");
  };

  const init = () => {
    if (!accessToken) return;
    useAuthGetMe()
      .then((data) => {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data)); // Persist user to localStorage
      })
      .catch((e) => {
        console.error("Error from session context init:", e);
        if (e.data !== undefined) {
          signOut();
        }
      });
  };

  const updateUserCheckInStatus = (isCheckedIn: any) => {
    setUser((currentUser) => {
      if (currentUser) {
        const updatedUser = { ...currentUser, is_checked_in: isCheckedIn };
        localStorage.setItem("user", JSON.stringify(updatedUser)); // Update the persisted user
        return updatedUser;
      }
      return currentUser;
    });
  };

  // Check if tokens are missing and user exists - auto logout
  useEffect(() => {
    if (!isLoading && !isRefreshTokenLoading) {
      if (!accessToken && !refreshToken && user) {
        signOut();
      }
    }
  }, [accessToken, refreshToken, user, isLoading, isRefreshTokenLoading]);

  // Set the global logout function for axios client
  useEffect(() => {
    setGlobalLogout(signOut);
  }, []);

  useEffect(() => {
    if (isLoggingOut && !user && !accessToken) {
      setIsLoggingOut(false);
    }
  }, [isLoggingOut, user, accessToken]);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        init,
        isLoading,
        isRefreshTokenLoading,
        isPendingLogin: isPending,
        accessToken,
        refreshToken,
        user,
        loginError,
        updateUserCheckInStatus,
        isLoggingOut,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
