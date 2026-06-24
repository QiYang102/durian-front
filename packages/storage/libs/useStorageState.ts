import * as React from "react";
import * as SecureStore from "expo-secure-store";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { storageToken } from "./token";

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

const isReactNative = (): boolean => {
  return (
    typeof navigator !== "undefined" && navigator.product === "ReactNative"
  );
};

function useAsyncState<T>(
  initialValue: [boolean, T | null] = [true, null],
): UseStateHook<T> {
  return React.useReducer(
    (
      state: [boolean, T | null],
      action: T | null = null,
    ): [boolean, T | null] => [false, action],
    initialValue,
  ) as UseStateHook<T>;
}

export async function setStorageItemAsync(
  key: storageToken,
  value: string | null,
  { secure = false } = {},
) {
  if (isReactNative()) {
    if (value == null) {
      secure
        ? await SecureStore.deleteItemAsync(key)
        : await AsyncStorage.removeItem(key);
    } else {
      secure
        ? await SecureStore.setItemAsync(key, value)
        : await AsyncStorage.setItem(key, value);
    }
  } else {
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      console.error("Local storage is unavailable:", e);
    }
  }
}

export async function getStorageItemAsync(
  key: storageToken,
  { secure = false } = {},
) {
  if (isReactNative()) {
    const value = secure
      ? await SecureStore.getItemAsync(key)
      : await AsyncStorage.getItem(key);
    return Promise.resolve(value);
  } else {
    try {
      if (typeof localStorage !== "undefined") {
        return localStorage.getItem(key);
      }
    } catch (e) {
      console.error("Local storage is unavailable:", e);
    }
  }
}

export function useStorageState(
  key: storageToken,
  { secure = false } = {},
): UseStateHook<string> {
  const [state, setState] = useAsyncState<string>();

  React.useEffect(() => {
    if (isReactNative()) {
      secure
        ? SecureStore.getItemAsync(key).then((value) => {
            setState(value);
          })
        : AsyncStorage.getItem(key).then((value) => {
            setState(value);
          });
    } else {
      try {
        if (typeof localStorage !== "undefined") {
          setState(localStorage.getItem(key));
        }
      } catch (e) {
        console.error("Local storage is unavailable:", e);
      }
    }
  }, [key]);

  const setValue = React.useCallback(
    (value: string | null) => {
      setStorageItemAsync(key, value).then(() => {
        setState(value);
      });
    },
    [key],
  );

  return [state, setValue];
}
