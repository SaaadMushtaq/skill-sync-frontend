import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../services/api";

export interface Job {
  _id: string;
  company: string;
  role: string;
  status: "Applied" | "Interview" | "Offer" | "Rejected";
  notes: string;
  appliedAt: string;
}

export const jobsApi = createApi({
  reducerPath: "jobsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Job"],
  endpoints: (builder) => ({
    getJobs: builder.query<Job[], void>({
      query: () => "/jobs",
      providesTags: ["Job"],
    }),
    addJob: builder.mutation<Job, Omit<Job, "_id">>({
      query: (body) => ({
        url: "/jobs",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Job"],
    }),
    updateJob: builder.mutation<Job, Partial<Job> & { id: string }>({
      query: ({ id, ...body }) => ({
        url: `/jobs/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Job"],
    }),
    deleteJob: builder.mutation<void, string>({
      query: (id) => ({
        url: `/jobs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Job"],
    }),
  }),
});

export const {
  useGetJobsQuery,
  useAddJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
} = jobsApi;
