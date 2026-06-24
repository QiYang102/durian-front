import { UseMutationOptions } from "@tanstack/react-query";
import { axiosClient } from "../axios";
import { useFetch } from "../utils/fetch";
import { Meta, QueryParams } from "../types";
import { EventCalendar } from "../types/models/eventCalendar";
import { buildQueryString, combineIncludeData } from "../utils/dynamicRest";

export const listEventCalendars = (
  type: string[],
  params: QueryParams = {
    per_page: 10,
  },
  objectStitching = {},
) => {
  const { query } = useFetch();

  const getEventCalendars = () =>
    axiosClient
      .get("/event-calendars", {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => combineIncludeData(response.data, objectStitching))
      .then((data) => ({
        event_calendars: data?.["event_calendars"] ?? [],
        meta: data?.meta ?? {},
      }));

  return query<{ event_calendars: EventCalendar[]; meta: Meta }>(
    ["list-of-event-calendars"].concat(type),
    getEventCalendars,
  );
};

export const useListEventCalendarsByRange = (
  type: string[],
  params: QueryParams = {
    per_page: 10,
  },
  objectStitching = {},
) => {
  const { query } = useFetch();

  const getEventCalendars = () =>
    axiosClient
      .get("/event-calendars/event-calendar-by-range", {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => combineIncludeData(response.data, objectStitching))
      .then((data) => ({
        event_calendars: data?.["event_calendars"] ?? [],
      }));

  return query<{ event_calendars: EventCalendar[] }>(
    ["list-of-event-calendars-by-range"].concat(type),
    getEventCalendars,
  );
};

export const useCreateEventCalendar = (
  opts?: UseMutationOptions<{ event_calendar: EventCalendar }, any>,
) => {
  const { mutate } = useFetch();

  const postData = (data: any) =>
    axiosClient
      .post("/event-calendars", data)
      .then((response) => response.data);

  return mutate<{ event_calendar: EventCalendar }, any>(
    ["event-calendars"],
    [["list-of-event-calendars"], ["list-of-event-calendars-by-range"]],
    postData,
    {
      ...opts,
    },
  );
};

export const useEditEventCalendar = (
  opts?: UseMutationOptions<{ event_calendar: EventCalendar }, any>,
) => {
  const { mutate } = useFetch();

  const postData = (data: { id: string | number }) =>
    axiosClient
      .put(`/event-calendars/${data.id}`, data)
      .then((response) => response.data);

  return mutate<{ event_calendar: EventCalendar }, any>(
    ["update-event-calendar"],
    [
      ["list-of-event-calendars"],
      ["event-calendar-detail"],
      ["list-of-event-calendars-by-range"],
    ],
    postData,
    {
      ...opts,
    },
  );
};

export const getSingleEventCalendar = (
  type: string[],
  id: number,
  params: QueryParams,
  objectStitching = {},
  options = {},
) => {
  const { query } = useFetch();

  const getData = () =>
    axiosClient
      .get(`/event-calendars/${id}`, {
        params,
        paramsSerializer: (params) => buildQueryString(params),
      })
      .then((response) => {
        const responseData = response.data;
        const combinedData = combineIncludeData(responseData, objectStitching);
        return {
          event_calendar: combinedData?.["event_calendar"] ?? {},
        };
      });

  return query<{ event_calendar: EventCalendar }>(
    ["event-calendar-detail"].concat(type),
    getData,
    {
      ...options,
    },
  );
};

export const useDeleteEventCalendar = (opts?: UseMutationOptions<any, any>) => {
  const { mutate } = useFetch();

  const deleteData = (id: string | number) =>
    axiosClient
      .delete(`/event-calendars/${id}`)
      .then((response) => response.data);

  return mutate<any, any>(
    ["event-calendars"],
    [["list-of-event-calendars"], ["list-of-event-calendars-by-range"]],
    deleteData,
    {
      ...opts,
    },
  );
};
